import type { Fixture } from "@/types";

/**
 * Calendrier / résultats de DÉMONSTRATION (données fictives).
 * 👉 PHASE 2 : sera remplacé par les données temps réel via `getFixtures()`.
 */
export const fixtures: Fixture[] = [
  // Résultats récents
  {
    id: "f-1",
    date: "2024-05-26",
    home: "F.C. Littoral",
    away: "US Rivière",
    competition: "Championnat • J18",
    homeScore: 2,
    awayScore: 1,
    venue: "Stade Municipal",
  },
  {
    id: "f-2",
    date: "2024-05-19",
    home: "Olympique Vallée",
    away: "F.C. Littoral",
    competition: "Championnat • J17",
    homeScore: 0,
    awayScore: 0,
    venue: "Stade de la Vallée",
  },
  // À venir
  {
    id: "f-3",
    date: "2024-06-02",
    home: "F.C. Littoral",
    away: "FC Coteaux",
    competition: "Championnat • J19",
    venue: "Stade Municipal",
  },
  {
    id: "f-4",
    date: "2024-06-09",
    home: "Étoile du Port",
    away: "F.C. Littoral",
    competition: "Championnat • J20",
    venue: "Stade du Port",
  },
  {
    id: "f-5",
    date: "2024-06-16",
    home: "F.C. Littoral",
    away: "AS Bord de Mer",
    competition: "Championnat • J21",
    venue: "Stade Municipal",
  },
];
