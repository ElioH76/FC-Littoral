import { fixturesByTeam } from "@/data/fixtures";
import { standingsByTeam } from "@/data/standings";
import type { TeamSlug } from "@/types";
import type { SeasonSource } from "./types";

/**
 * Source de DÉMONSTRATION : lit les fichiers mock locaux.
 * C'est la source active aujourd'hui, et le filet de sécurité (fallback)
 * si une source externe échoue.
 */
export const mockSource: SeasonSource = {
  name: "mock",
  async getStandings(team: TeamSlug) {
    return standingsByTeam[team] ?? [];
  },
  async getFixtures(team: TeamSlug) {
    return fixturesByTeam[team] ?? [];
  },
};
