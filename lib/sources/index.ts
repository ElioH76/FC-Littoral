import type { Fixture, Standing, TeamSlug } from "@/types";
import { teamSourceConfig } from "@/lib/season-config";
import { snapshotFixtures, snapshotStandings } from "@/lib/season-snapshot";
import { mockSource } from "./mock-source";

/**
 * Orchestrateur des sources « saison » (classements / calendriers).
 *
 * ⚠️ L'API FFF (DOFA) bloque les IP cloud (Vercel, GitHub Actions…) → la prod
 * ne peut PAS l'appeler. On lit donc un SNAPSHOT figé dans le repo
 * (`data/season-snapshot.json`), rafraîchi depuis une IP résidentielle via
 * `npm run sync:fff` (cf. `scripts/sync-fff.mjs`).
 *
 * - Équipe avec config réelle (clubId) → snapshot FFF (vide tant que pas
 *   synchronisé → le site affiche « à venir »).
 * - Équipe sans config → données de démonstration (mock).
 *
 * Les fonctions de `lib/data.ts` passent par ici, donc les composants ne voient
 * jamais d'où vient la donnée.
 */

export async function resolveStandings(team: TeamSlug): Promise<Standing[]> {
  const config = teamSourceConfig[team];
  if (config.clubId) return snapshotStandings(team);
  return mockSource.getStandings(team, config);
}

export async function resolveFixtures(team: TeamSlug): Promise<Fixture[]> {
  const config = teamSourceConfig[team];
  if (config.clubId) return snapshotFixtures(team);
  return mockSource.getFixtures(team, config);
}
