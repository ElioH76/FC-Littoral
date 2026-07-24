import { list, put } from "@vercel/blob";

import { products as seed } from "@/data/products";
import type { Product } from "@/types";

/**
 * Stockage des produits de la boutique.
 *
 * - Source de vérité : un fichier `products.json` sur Vercel Blob (modifiable
 *   à chaud depuis l'admin).
 * - Repli : le catalogue statique `data/products.ts` tant que Blob n'est pas
 *   configuré (variable `BLOB_READ_WRITE_TOKEN` absente) ou vide.
 *   → le site fonctionne donc AVANT même l'activation de Blob.
 */

const BLOB_PATH = "products.json";

function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** Lit le catalogue depuis Blob, ou `null` si indisponible. */
async function readStore(): Promise<Product[] | null> {
  if (!blobConfigured()) return null;
  try {
    const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
    const found = blobs.find((b) => b.pathname === BLOB_PATH);
    if (!found) return null;
    const res = await fetch(found.url, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as Product[];
    return Array.isArray(data) ? data : null;
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

/** Écrit l'intégralité du catalogue sur Blob. */
export async function saveProducts(all: Product[]): Promise<void> {
  if (!blobConfigured()) {
    throw new Error("BLOB_READ_WRITE_TOKEN manquant");
  }
  await put(BLOB_PATH, JSON.stringify(all, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

/** Le seed statique (pour initialiser le store la première fois). */
export function seedProducts(): Product[] {
  return seed;
}
