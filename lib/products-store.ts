import { del, list, put } from "@vercel/blob";

import { products as seed } from "@/data/products";
import type { Product } from "@/types";

/**
 * Stockage des produits de la boutique sur Vercel Blob.
 *
 * ⚠️ Cache CDN : un blob écrit à un chemin FIXE (overwrite) peut être renvoyé
 * périmé par le CDN après modification. Pour l'éviter, chaque enregistrement
 * écrit un fichier **versionné** (`catalog/<timestamp>.json`, URL neuve donc
 * jamais en cache) et la lecture prend systématiquement le plus récent ; les
 * anciennes versions sont supprimées.
 *
 * Repli : le catalogue statique `data/products.ts` tant que Blob n'est pas
 * configuré (`BLOB_READ_WRITE_TOKEN` absent) ou vide.
 */

const DIR = "catalog/";
const LEGACY_PATH = "products.json"; // ancien emplacement (chemin fixe) — migration

function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function fetchJson(url: string): Promise<Product[] | null> {
  // paramètre unique = anti-cache supplémentaire.
  const res = await fetch(`${url}?ts=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = (await res.json()) as unknown;
  return Array.isArray(data) ? (data as Product[]) : null;
}

/** Lit le catalogue depuis Blob (version la plus récente), ou `null`. */
async function readStore(): Promise<Product[] | null> {
  if (!blobConfigured()) return null;
  try {
    // 1) fichiers versionnés — on prend le plus récent
    const { blobs } = await list({ prefix: DIR });
    if (blobs.length > 0) {
      const latest = blobs.reduce((a, b) =>
        new Date(a.uploadedAt).getTime() >= new Date(b.uploadedAt).getTime() ? a : b,
      );
      return await fetchJson(latest.url);
    }
    // 2) migration : ancien fichier à chemin fixe
    const legacy = await list({ prefix: LEGACY_PATH, limit: 1 });
    const found = legacy.blobs.find((b) => b.pathname === LEGACY_PATH);
    if (found) return await fetchJson(found.url);
    return null;
  } catch {
    return null;
  }
}

function sortProducts(items: Product[]): Product[] {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** Tous les produits (actifs ET inactifs) — usage admin. */
export async function getAllProducts(): Promise<Product[]> {
  const stored = await readStore();
  return sortProducts(stored ?? seed);
}

/** Produits visibles en boutique (actifs uniquement). */
export async function getActiveProducts(): Promise<Product[]> {
  return (await getAllProducts()).filter((p) => p.active !== false);
}

/** Le catalogue est-il déjà initialisé sur Blob ? */
export async function isStoreInitialized(): Promise<boolean> {
  return (await readStore()) !== null;
}

/** Écrit une nouvelle version du catalogue et purge les anciennes. */
export async function saveProducts(all: Product[]): Promise<void> {
  if (!blobConfigured()) {
    throw new Error("BLOB_READ_WRITE_TOKEN manquant");
  }
  const { url } = await put(`${DIR}${Date.now()}.json`, JSON.stringify(all, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: true,
    cacheControlMaxAge: 0,
  });

  // Purge : anciennes versions + éventuel ancien fichier legacy.
  try {
    const { blobs } = await list({ prefix: DIR });
    const toDelete = blobs.filter((b) => b.url !== url).map((b) => b.url);
    const legacy = await list({ prefix: LEGACY_PATH, limit: 1 });
    for (const b of legacy.blobs) {
      if (b.pathname === LEGACY_PATH) toDelete.push(b.url);
    }
    if (toDelete.length > 0) await del(toDelete);
  } catch {
    // purge best-effort : sans conséquence sur l'écriture réussie.
  }
}

/** Le seed statique (pour initialiser le store la première fois). */
export function seedProducts(): Product[] {
  return seed;
}
