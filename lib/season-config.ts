import type { TeamSlug } from "@/types";
import type { TeamSourceConfig } from "@/lib/sources/types";

/**
 * CONFIGURATION DE LA SOURCE DE DONNÉES « SAISON » (classements/calendriers).
 *
 * 👉 Aujourd'hui : `ACTIVE_SOURCE = "mock"` → données de démonstration.
 * 👉 Phase 2 : passer à `"fff-dofa"` une fois les ids de poule remplis
 *    ci-dessous et l'adaptateur DOFA branché (lib/sources/fff-dofa-source.ts).
 *
 * En cas d'échec de la source externe, le site retombe automatiquement
 * sur les données de démo (aucune page ne casse).
 */
export const ACTIVE_SOURCE: "mock" | "fff-dofa" = "mock";

/**
 * Ids par équipe pour la source externe.
 * Laissés vides tant qu'on est en mock. Exemple de remplissage (FFF) :
 *   seniors: { pouleId: "XXXX", clubId: "501550", sourceTeamName: "F.C. Littoral" }
 */
export const teamSourceConfig: Record<TeamSlug, TeamSourceConfig> = {
  u15: {},
  seniors: {},
  veterans: {},
};
