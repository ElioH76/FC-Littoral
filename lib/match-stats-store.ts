import { versionedJsonStore } from "@/lib/blob-json-store";
import type { MatchStat, MatchStatsStore } from "@/types";

/**
 * Stockage des FEUILLES DE MATCH (buteurs / passeurs / joueurs ayant joué) sur
 * Vercel Blob, indexées par identifiant de match (FFF `ma_no` OU id manuel).
 *
 * La FFF publie les scores mais pas les buteurs : cet overlay permet de les
 * saisir à la main, aussi bien pour les matchs de championnat que pour les
 * matchs amicaux ajoutés manuellement.
 *
 * Fichier JSON versionné + cache serveur invalidé à chaque enregistrement
 * (cf. `blob-json-store`). Store vide / Blob non configuré → objet vide.
 */

const store = versionedJsonStore<MatchStatsStore>({
  dir: "match-stats/",
  parse: (data) =>
    data && typeof data === "object" && !Array.isArray(data)
      ? (data as MatchStatsStore)
      : null,
});

/**
 * Lit toutes les feuilles de match (version la plus récente).
 * `fresh` : relit Blob sans cache (avant une modification en admin).
 */
export async function getMatchStats(fresh = false): Promise<MatchStatsStore> {
  return (await store.read(fresh)) ?? {};
}

/** Feuille d'un match précis (ou undefined). */
export async function getMatchStat(
  id: string,
  fresh = false,
): Promise<MatchStat | undefined> {
  return (await getMatchStats(fresh))[id];
}

/** Écrit une nouvelle version de l'ensemble des feuilles et purge les anciennes. */
export async function saveMatchStats(stats: MatchStatsStore): Promise<void> {
  await store.write(stats);
}
