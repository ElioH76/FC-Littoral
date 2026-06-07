import type { Fixture, Standing, TeamSlug } from "@/types";

/**
 * Identifiants nécessaires pour interroger une source externe (FFF, etc.)
 * pour une équipe donnée. À remplir dans `lib/season-config.ts` le jour où
 * on connaît les ids de la poule/du club côté source.
 */
export interface TeamSourceConfig {
  /** Id de la poule/compétition côté source (ex. FFF/DOFA). */
  pouleId?: string;
  /** Id du club côté source. */
  clubId?: string;
  /** Nom de l'équipe tel qu'il apparaît dans la source (pour repérer "nous"). */
  sourceTeamName?: string;
}

/**
 * Contrat d'une source de données de saison.
 * Implémentations : `mockSource` (données de démo) et `fffDofaSource` (FFF, à brancher).
 * Pour ajouter une source : créer un objet conforme à cette interface.
 */
export interface SeasonSource {
  readonly name: string;
  getStandings(team: TeamSlug, config: TeamSourceConfig): Promise<Standing[]>;
  getFixtures(team: TeamSlug, config: TeamSourceConfig): Promise<Fixture[]>;
}
