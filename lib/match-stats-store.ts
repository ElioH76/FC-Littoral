import { del, list, put } from "@vercel/blob";

import type { MatchStat, MatchStatsStore } from "@/types";

/**
 * Stockage des FEUILLES DE MATCH (buteurs / passeurs / joueurs ayant joué) sur
 * Vercel Blob, indexées par identifiant de match (FFF `ma_no` OU id manuel).
 *
 * La FFF publie les scores mais pas les buteurs : cet overlay permet de les
 * saisir à la main, aussi bien pour les matchs de championnat que pour les
 * matchs amicaux ajoutés manuellement.
 *
 * Même approche versionnée que `products-store` (fichier neuf à chaque save,
 * purge des anciens). Store vide / Blob non configuré → objet vide.
 */

const DIR = "match-stats/";

function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function fetchJson(url: string): Promise<MatchStatsStore | null> {
  // Toujours frais (cf. manual-fixtures-store) : les feuilles de match saisies
  // en admin doivent apparaître immédiatement sur le site.
  const res = await fetch(`${url}?ts=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = (await res.json()) as unknown;
  return data && typeof data === "object" ? (data as MatchStatsStore) : null;
}

/** Lit toutes les feuilles de match (version la plus récente). */
export async function getMatchStats(_fresh = false): Promise<MatchStatsStore> {
  if (!blobConfigured()) return {};
  try {
    const { blobs } = await list({ prefix: DIR });
    if (blobs.length === 0) return {};
    const latest = blobs.reduce((a, b) =>
      new Date(a.uploadedAt).getTime() >= new Date(b.uploadedAt).getTime() ? a : b,
    );
    return (await fetchJson(latest.url)) ?? {};
  } catch {
    return {};
  }
}

/** Feuille d'un match précis (ou undefined). */
export async function getMatchStat(
  id: string,
  fresh = false,
): Promise<MatchStat | undefined> {
  return (await getMatchStats(fresh))[id];
}

/** Écrit une nouvelle version de l'ensemble des feuilles et purge les anciennes. */
export async function saveMatchStats(store: MatchStatsStore): Promise<void> {
  if (!blobConfigured()) {
    throw new Error("BLOB_READ_WRITE_TOKEN manquant");
  }
  const { url } = await put(
    `${DIR}${Date.now()}.json`,
    JSON.stringify(store, null, 2),
    {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: true,
      cacheControlMaxAge: 0,
    },
  );
  try {
    const { blobs } = await list({ prefix: DIR });
    const toDelete = blobs.filter((b) => b.url !== url).map((b) => b.url);
    if (toDelete.length > 0) await del(toDelete);
  } catch {
    // purge best-effort
  }
}
