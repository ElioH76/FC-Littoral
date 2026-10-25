import { versionedJsonStore } from "@/lib/blob-json-store";
import { products as seed } from "@/data/products";
import type { Product } from "@/types";

/**
 * Stockage des produits de la boutique sur Vercel Blob.
 *
 * ⚠️ Cache CDN : un blob écrit à un chemin FIXE (overwrite) peut être renvoyé
 * périmé par le CDN après modification. Chaque enregistrement écrit donc un
 * fichier **versionné** (`catalog/<timestamp>.json`) et la lecture prend le
 * plus récent ; les anciennes versions sont supprimées. La lecture est mise en
 * cache côté serveur et invalidée à chaque enregistrement (cf. `blob-json-store`).
 *
 * Repli : le catalogue statique `data/products.ts` tant que Blob n'est pas
 * configuré (`BLOB_READ_WRITE_TOKEN` absent), vide ou inaccessible.
 */

const store = versionedJsonStore<Product[]>({
  dir: "catalog/",
  legacyPath: "products.json", // ancien emplacement (chemin fixe) — migration
  parse: (data) => (Array.isArray(data) ? (data as Product[]) : null),
});

function sortProducts(items: Product[]): Product[] {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * Tous les produits (actifs ET inactifs) — usage admin.
 * `fresh` : relit Blob sans cache (avant une modification en admin).
 */
export async function getAllProducts(fresh = false): Promise<Product[]> {
  const stored = await store.read(fresh);
  return sortProducts(stored ?? seed);
}

/** Produits visibles en boutique (actifs uniquement). */
export async function getActiveProducts(): Promise<Product[]> {
  return (await getAllProducts()).filter((p) => p.active !== false);
}

/** Le catalogue est-il déjà initialisé sur Blob ? */
export async function isStoreInitialized(): Promise<boolean> {
  return (await store.read()) !== null;
}

/** Écrit une nouvelle version du catalogue et purge les anciennes. */
export async function saveProducts(all: Product[]): Promise<void> {
  await store.write(all);
}

/** Le seed statique (pour initialiser le store la première fois). */
export function seedProducts(): Product[] {
  return seed;
}
