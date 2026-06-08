import type { Fixture, Standing, TeamSlug } from "@/types";

/**
 * Identifiants pour interroger l'API FFF (DOFA) pour une équipe.
 * L'équipe est résolue dynamiquement : club (cl_no DOFA) + catégorie + numéro
 * → l'adaptateur retrouve l'engagement championnat (cp/phase/poule) tout seul,
 * donc ça suit automatiquement les changements de poule d'une saison à l'autre.
 */
export interface TeamSourceConfig {
  /** Identifiant interne DOFA du club (cl_no), ex. 1030 pour FC Rollevillais. */
  clubId?: number;
  /** Code catégorie DOFA, ex. "SEM" (senior masculin). */
  category?: string;
  /** Numéro de l'équipe dans cette catégorie, ex. 5. */
  teamNumber?: number;
}

/**
 * Contrat d'une source de données de saison.
 * Implémentations : `mockSource` (démo) et `fffDofaSource` (API FFF).
 */
export interface SeasonSource {
  readonly name: string;
  getStandings(team: TeamSlug, config: TeamSourceConfig): Promise<Standing[]>;
  getFixtures(team: TeamSlug, config: TeamSourceConfig): Promise<Fixture[]>;
}
