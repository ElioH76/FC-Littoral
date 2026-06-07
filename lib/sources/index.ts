import type { Fixture, Standing, TeamSlug } from "@/types";
import { ACTIVE_SOURCE, teamSourceConfig } from "@/lib/season-config";
import { fffDofaSource } from "./fff-dofa-source";
import { mockSource } from "./mock-source";
import type { SeasonSource } from "./types";

/**
 * Orchestrateur des sources de données « saison ».
 * - Choisit la source active (cf. season-config).
 * - Filet de sécurité : si la source externe échoue ou ne renvoie rien,
 *   on retombe sur les données de démonstration (mock).
 *
 * Les fonctions de `lib/data.ts` passent par ici, donc les composants ne
 * voient jamais d'où vient la donnée.
 */
const registry: Record<string, SeasonSource> = {
  mock: mockSource,
  "fff-dofa": fffDofaSource,
};

function activeSource(): SeasonSource {
  return registry[ACTIVE_SOURCE] ?? mockSource;
}

export async function resolveStandings(team: TeamSlug): Promise<Standing[]> {
  const src = activeSource();
  if (src.name !== "mock") {
    try {
      const data = await src.getStandings(team, teamSourceConfig[team]);
      if (data.length > 0) return data;
    } catch (error) {
      console.error(
        `[saison] classement "${team}" via ${src.name} indisponible → repli démo`,
        error,
      );
    }
  }
  return mockSource.getStandings(team, teamSourceConfig[team]);
}

export async function resolveFixtures(team: TeamSlug): Promise<Fixture[]> {
  const src = activeSource();
  if (src.name !== "mock") {
    try {
      const data = await src.getFixtures(team, teamSourceConfig[team]);
      if (data.length > 0) return data;
    } catch (error) {
      console.error(
        `[saison] calendrier "${team}" via ${src.name} indisponible → repli démo`,
        error,
      );
    }
  }
  return mockSource.getFixtures(team, teamSourceConfig[team]);
}
