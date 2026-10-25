import { versionedJsonStore } from "@/lib/blob-json-store";
import type { ManualFixture } from "@/types";

/**
 * Stockage des MATCHS MANUELS (amicaux, coupes hors FFF…) sur Vercel Blob.
 *
 * Fichier JSON versionné + cache serveur invalidé à chaque enregistrement
 * (cf. `blob-json-store`) : un ajout en admin apparaît immédiatement sur le
 * site, sans relire Blob à chaque affichage.
 *
 * Sans `BLOB_READ_WRITE_TOKEN` (ou store vide) → liste vide (le site n'affiche
 * alors que les matchs FFF).
 */

const store = versionedJsonStore<ManualFixture[]>({
  dir: "manual-fixtures/",
  parse: (data) => (Array.isArray(data) ? (data as ManualFixture[]) : null),
});

/**
 * Lit tous les matchs manuels (version la plus récente).
 * `fresh` : relit Blob sans cache (avant une modification en admin).
 */
export async function getManualFixtures(fresh = false): Promise<ManualFixture[]> {
  return (await store.read(fresh)) ?? [];
}

/** Écrit une nouvelle version de la liste et purge les anciennes. */
export async function saveManualFixtures(all: ManualFixture[]): Promise<void> {
  await store.write(all);
}
