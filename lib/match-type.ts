import type { Fixture, MatchType } from "@/types";

/**
 * Déduit le type d'un match à partir de son libellé de compétition FFF.
 * La FFF ne renvoie pas de code fiable côté match : on s'appuie sur le nom
 * ("Coupe de …", "Match de préparation", "Championnat …").
 */
export function matchTypeFromCompetition(competition: string): MatchType {
  const c = competition.toLowerCase();
  if (/coupe|challenge|troph[ée]e/.test(c)) return "coupe";
  if (/pr[ée]paration|amic|tournoi|gala/.test(c)) return "amical";
  return "championnat";
}

/**
 * Type effectif d'un match : le type explicite s'il détecte autre chose que
 * du championnat, sinon on privilégie la déduction du libellé (le `type`
 * stocké côté FFF est figé à "championnat").
 */
export function resolveMatchType(
  fixture: Pick<Fixture, "competition" | "type">,
): MatchType {
  if (fixture.type && fixture.type !== "championnat") return fixture.type;
  return matchTypeFromCompetition(fixture.competition);
}

/** Libellé court + habillage couleur (DA or / vert / neutre) par type. */
export const MATCH_TYPE_META: Record<
  MatchType,
  { label: string; badge: string; dot: string }
> = {
  championnat: {
    label: "Championnat",
    badge: "border-forest/30 bg-forest/10 text-forest-600",
    dot: "bg-forest",
  },
  coupe: {
    label: "Coupe",
    badge: "border-gold/40 bg-gold-50 text-gold-700",
    dot: "bg-gold",
  },
  amical: {
    label: "Amical",
    badge: "border-border bg-muted text-muted-foreground",
    dot: "bg-muted-foreground/60",
  },
};
