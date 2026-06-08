import type { Fixture, TeamSlug } from "@/types";

/**
 * Calendrier / résultats de DÉMONSTRATION (données fictives), par équipe.
 * 👉 PHASE 2 : seront remplacés par les données temps réel via `getFixtures(team)`.
 */
export const fixturesByTeam: Record<TeamSlug, Fixture[]> = {
  seniors: [
    { id: "s-1", date: "2024-05-26", home: "F.C. Littoral", away: "US Rivière", competition: "Championnat • J18", homeScore: 2, awayScore: 1, venue: "Stade Municipal" },
    { id: "s-2", date: "2024-05-19", home: "Olympique Vallée", away: "F.C. Littoral", competition: "Championnat • J17", homeScore: 0, awayScore: 0, venue: "Stade de la Vallée" },
    { id: "s-3", date: "2024-06-02", home: "F.C. Littoral", away: "FC Coteaux", competition: "Championnat • J19", venue: "Stade Municipal" },
    { id: "s-4", date: "2024-06-09", home: "Étoile du Port", away: "F.C. Littoral", competition: "Championnat • J20", venue: "Stade du Port" },
    { id: "s-5", date: "2024-06-16", home: "F.C. Littoral", away: "AS Bord de Mer", competition: "Championnat • J21", venue: "Stade Municipal" },
  ],
  u13: [
    { id: "u-1", date: "2024-05-25", home: "F.C. Littoral", away: "AC Falaises", competition: "Championnat U13 • J12", homeScore: 4, awayScore: 1, venue: "Stade Municipal" },
    { id: "u-2", date: "2024-05-18", home: "US Rivière", away: "F.C. Littoral", competition: "Championnat U13 • J11", homeScore: 1, awayScore: 3, venue: "Stade de la Rivière" },
    { id: "u-3", date: "2024-06-01", home: "F.C. Littoral", away: "Olympique Vallée", competition: "Championnat U13 • J13", venue: "Stade Municipal" },
    { id: "u-4", date: "2024-06-08", home: "US Marais", away: "F.C. Littoral", competition: "Championnat U13 • J14", venue: "Stade du Marais" },
  ],
  veterans: [
    { id: "v-1", date: "2024-05-24", home: "F.C. Littoral", away: "Anciens du Port", competition: "Match amical", homeScore: 3, awayScore: 3, venue: "Terrain annexe" },
    { id: "v-2", date: "2024-06-07", home: "Vétérans Vallée", away: "F.C. Littoral", competition: "Match amical", venue: "Stade de la Vallée" },
    { id: "v-3", date: "2024-06-21", home: "F.C. Littoral", away: "AS Bord de Mer Vét.", competition: "Tournoi loisir", venue: "Stade Municipal" },
  ],
};
