import { del, list, put } from "@vercel/blob";

import type { ManualFixture } from "@/types";

/**
 * Stockage des MATCHS MANUELS (amicaux, coupes hors FFF…) sur Vercel Blob.
 *
 * Même approche versionnée que `products-store` : chaque enregistrement écrit
 * un fichier `manual-fixtures/<timestamp>.json` (URL neuve, jamais en cache CDN)
 * et la lecture prend le plus récent ; les anciennes versions sont purgées.
 *
 * Sans `BLOB_READ_WRITE_TOKEN` (ou store vide) → liste vide (le site n'affiche
 * alors que les matchs FFF).
 */

const DIR = "manual-fixtures/";

function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function fetchJson(url: string): Promise<ManualFixture[] | null> {
  // Toujours frais : les pages publiques doivent refléter immédiatement les
  // ajouts faits en admin (comme la boutique). Ces pages deviennent dynamiques.
  const res = await fetch(`${url}?ts=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = (await res.json()) as unknown;
  return Array.isArray(data) ? (data as ManualFixture[]) : null;
}

/** Lit tous les matchs manuels (version la plus récente). */
export async function getManualFixtures(_fresh = false): Promise<ManualFixture[]> {
  if (!blobConfigured()) return [];
  try {
    const { blobs } = await list({ prefix: DIR });
    if (blobs.length === 0) return [];
    const latest = blobs.reduce((a, b) =>
      new Date(a.uploadedAt).getTime() >= new Date(b.uploadedAt).getTime() ? a : b,
    );
    return (await fetchJson(latest.url)) ?? [];
  } catch {
    return [];
  }
}

/** Écrit une nouvelle version de la liste et purge les anciennes. */
export async function saveManualFixtures(all: ManualFixture[]): Promise<void> {
  if (!blobConfigured()) {
    throw new Error("BLOB_READ_WRITE_TOKEN manquant");
  }
  const { url } = await put(`${DIR}${Date.now()}.json`, JSON.stringify(all, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: true,
    cacheControlMaxAge: 0,
  });
  try {
    const { blobs } = await list({ prefix: DIR });
    const toDelete = blobs.filter((b) => b.url !== url).map((b) => b.url);
    if (toDelete.length > 0) await del(toDelete);
  } catch {
    // purge best-effort
  }
}
