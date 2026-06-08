import type { TeamSlug } from "@/types";
import type { TeamSourceConfig } from "@/lib/sources/types";

/**
 * CONFIGURATION DE LA SOURCE DE DONNÉES « SAISON » (classements/calendriers).
 *
 * - `ACTIVE_SOURCE = "fff-dofa"` → données réelles via l'API FFF (DOFA).
 * - `ACTIVE_SOURCE = "mock"`     → données de démonstration.
 *
 * En cas d'échec de l'API (ou config vide pour une équipe), repli automatique
 * sur les données de démo — aucune page ne casse.
 */
export const ACTIVE_SOURCE: "mock" | "fff-dofa" = "fff-dofa";

/**
 * Ids par équipe pour l'API FFF.
 *   clubId     = cl_no DOFA (≠ n° d'affiliation). F.C. du Littoral = 100405.
 *   category   = code DOFA ("U13", "SEM"…).
 *   teamNumber = numéro de l'équipe dans la catégorie.
 *
 * F.C. du Littoral (affiliation 549990, cl_no DOFA 100405) :
 *   - U13 n°3       → « U13 DEPARTEMENTAL 4 »          (données réelles)
 *   - Vétérans = SEM n°1 → « SENIORS VÉTÉRANS D1 CRITÉRIUM » (données réelles)
 *   - Seniors Après-Midi : création de la saison prochaine, pas encore à la FFF
 *     → pas de config → repli sur les données de démo.
 */
export const teamSourceConfig: Record<TeamSlug, TeamSourceConfig> = {
  u13: { clubId: 100405, category: "U13", teamNumber: 3 },
  seniors: {},
  veterans: { clubId: 100405, category: "SEM", teamNumber: 1 },
};
