import type { Fixture, Standing, TeamSlug } from "@/types";
import { ACTIVE_SOURCE, teamSourceConfig } from "@/lib/season-config";
import { fffDofaSource } from "./fff-dofa-source";
import { mockSource } from "./mock-source";
import type { SeasonSource } from "./types";

/**
 * Orchestrateur des sources de données « saison ».
 * - Choisit la source active (cf. season-config).
 * - Filet de sécurité : si la source externe est EN PANNE (exception), on
 *   retombe sur les données de démonstration (mock).
 *
 * ⚠️ Une réponse VIDE de la vraie source n'est PAS une panne : en pré-saison,
 * le classement officiel n'existe pas encore. Dans ce cas on renvoie une liste
 * vide (la page affiche « classement à venir ») plutôt que de masquer ce vide
 * derrière un faux classement de démo.
 *
 * Une équipe sans config réelle (pas de `clubId`) utilise directement le mock.
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
  const config = teamSourceConfig[team];
  if (src.name !== "mock" && config.clubId) {
    try {
      // La vraie source fait autorité, même si elle renvoie un classement vide
      // (pré-saison : pas encore de journées jouées).
      return await src.getStandings(team, config);
    } catch (error) {
      console.error(
        `[saison] classement "${team}" via ${src.name} en panne → repli démo`,
        error,
      );
    }
  }
  return mockSource.getStandings(team, config);
}

export async function resolveFixtures(team: TeamSlug): Promise<Fixture[]> {
  const src = activeSource();
  const config = teamSourceConfig[team];
  if (src.name !== "mock" && config.clubId) {
    try {
      // La vraie source fait autorité, même si le calendrier est vide.
      return await src.getFixtures(team, config);
    } catch (error) {
      console.error(
        `[saison] calendrier "${team}" via ${src.name} en panne → repli démo`,
        error,
      );
    }
  }
  return mockSource.getFixtures(team, config);
}
