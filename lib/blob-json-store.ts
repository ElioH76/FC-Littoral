import { del, list, put } from "@vercel/blob";
import { revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";

/**
 * Fichier JSON VERSIONNÉ sur Vercel Blob, avec cache serveur.
 *
 * Écriture : chaque enregistrement crée `<dir><timestamp>.json` (URL neuve,
 * jamais servie périmée par le CDN Blob) puis purge les anciennes versions.
 *
 * Lecture : `list()` est une opération AVANCÉE Blob (quota Hobby : 2 000/mois,
 * Blob bloqué 30 jours au-delà). On ne la fait donc PAS à chaque affichage :
 * le résultat est mis en cache (Data Cache Next) et invalidé par tag à chaque
 * écriture (`revalidateTag`) → les saisies admin restent visibles
 * immédiatement, sans relire Blob entre deux saisies.
 *
 * Les erreurs Blob (quota, réseau…) ne sont jamais mises en cache : la lecture
 * renvoie `null` et retentera à la requête suivante.
 */

/** Filet de sécurité si une écriture se faisait hors de l'appli (dashboard). */
const REVALIDATE = 86_400; // 24 h

type Options<T> = {
  /** Préfixe des versions, ex. `"catalog/"`. */
  dir: string;
  /** Ancien fichier à chemin fixe, lu en repli et purgé à la 1re écriture. */
  legacyPath?: string;
  /** Valide le JSON lu ; `null` si invalide. */
  parse: (data: unknown) => T | null;
};

export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function versionedJsonStore<T>({ dir, legacyPath, parse }: Options<T>) {
  const tag = `blob:${dir}`;

  async function fetchJson(url: string): Promise<T | null> {
    // paramètre unique = anti-cache CDN (la version vient d'être choisie).
    const res = await fetch(`${url}?ts=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Blob ${url} → HTTP ${res.status}`);
    return parse(await res.json());
  }

  /** Lecture directe (1 `list`, +1 si repli legacy). Lève en cas d'erreur. */
  async function readFresh(): Promise<T | null> {
    if (!blobConfigured()) return null;
    const { blobs } = await list({ prefix: dir });
    if (blobs.length > 0) {
      const latest = blobs.reduce((a, b) =>
        new Date(a.uploadedAt).getTime() >= new Date(b.uploadedAt).getTime() ? a : b,
      );
      return fetchJson(latest.url);
    }
    if (legacyPath) {
      const legacy = await list({ prefix: legacyPath, limit: 1 });
      const found = legacy.blobs.find((b) => b.pathname === legacyPath);
      if (found) return fetchJson(found.url);
    }
    return null;
  }

  const readCached = unstable_cache(readFresh, [tag], {
    tags: [tag],
    revalidate: REVALIDATE,
  });

  return {
    /**
     * Lecture pour l'affichage (cache serveur, dédupliquée par requête).
     * `fresh` : relit Blob directement — réservé aux lecture-modification-écriture.
     * Dans ce cas une erreur est LEVÉE (et non `null`) : sinon l'écriture qui
     * suit remplacerait les données existantes par une liste vide.
     */
    read: cache(async (fresh = false): Promise<T | null> => {
      if (!blobConfigured()) return null;
      if (fresh) return readFresh();
      try {
        return await readCached();
      } catch (e) {
        console.error(`[blob] lecture ${dir} impossible:`, e);
        return null;
      }
    }),

    /** Écrit une nouvelle version, purge les anciennes et invalide le cache. */
    async write(value: T): Promise<void> {
      if (!blobConfigured()) {
        throw new Error("BLOB_READ_WRITE_TOKEN manquant");
      }
      const { url } = await put(`${dir}${Date.now()}.json`, JSON.stringify(value, null, 2), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: true,
        cacheControlMaxAge: 0,
      });
      revalidateTag(tag);

      // Purge : anciennes versions + éventuel ancien fichier legacy.
      try {
        const { blobs } = await list({ prefix: dir });
        const toDelete = blobs.filter((b) => b.url !== url).map((b) => b.url);
        if (legacyPath && toDelete.length === 0) {
          // Pas d'ancienne version → peut-être 1re écriture après migration.
          const legacy = await list({ prefix: legacyPath, limit: 1 });
          for (const b of legacy.blobs) {
            if (b.pathname === legacyPath) toDelete.push(b.url);
          }
        }
        if (toDelete.length > 0) await del(toDelete); // `del` : gratuit
      } catch {
        // purge best-effort : sans conséquence sur l'écriture réussie.
      }
    },
  };
}
