import type { Standing, TeamSlug } from "@/types";

/**
 * Classements de DÉMONSTRATION (données fictives), par équipe.
 * 👉 PHASE 2 : seront remplacés par les données temps réel d'une API foot
 *    via `getStandings(team)` dans `lib/data.ts` (aucun composant à modifier).
 *
 * Les Vétérans (loisir) n'ont pas de classement officiel → pas d'entrée ici.
 */
export const standingsByTeam: Partial<Record<TeamSlug, Standing[]>> = {
  seniors: [
    { rank: 1, team: "AS Bord de Mer", played: 18, won: 13, drawn: 3, lost: 2, goalsFor: 41, goalsAgainst: 16, points: 42 },
    { rank: 2, team: "F.C. Littoral", played: 18, won: 12, drawn: 4, lost: 2, goalsFor: 38, goalsAgainst: 17, points: 40 },
    { rank: 3, team: "US Rivière", played: 18, won: 11, drawn: 4, lost: 3, goalsFor: 35, goalsAgainst: 19, points: 37 },
    { rank: 4, team: "Olympique Vallée", played: 18, won: 9, drawn: 5, lost: 4, goalsFor: 30, goalsAgainst: 22, points: 32 },
    { rank: 5, team: "FC Coteaux", played: 18, won: 8, drawn: 4, lost: 6, goalsFor: 27, goalsAgainst: 25, points: 28 },
    { rank: 6, team: "Étoile du Port", played: 18, won: 7, drawn: 5, lost: 6, goalsFor: 24, goalsAgainst: 24, points: 26 },
    { rank: 7, team: "AC Falaises", played: 18, won: 6, drawn: 4, lost: 8, goalsFor: 22, goalsAgainst: 28, points: 22 },
    { rank: 8, team: "Sporting Dunes", played: 18, won: 4, drawn: 5, lost: 9, goalsFor: 19, goalsAgainst: 31, points: 17 },
    { rank: 9, team: "US Marais", played: 18, won: 3, drawn: 4, lost: 11, goalsFor: 16, goalsAgainst: 36, points: 13 },
    { rank: 10, team: "FC Estuaire", played: 18, won: 2, drawn: 4, lost: 12, goalsFor: 14, goalsAgainst: 42, points: 10 },
  ],
  u15: [
    { rank: 1, team: "F.C. Littoral", played: 12, won: 9, drawn: 2, lost: 1, goalsFor: 34, goalsAgainst: 12, points: 29 },
    { rank: 2, team: "Olympique Vallée", played: 12, won: 8, drawn: 2, lost: 2, goalsFor: 30, goalsAgainst: 15, points: 26 },
    { rank: 3, team: "AS Bord de Mer", played: 12, won: 7, drawn: 3, lost: 2, goalsFor: 28, goalsAgainst: 16, points: 24 },
    { rank: 4, team: "US Rivière", played: 12, won: 6, drawn: 2, lost: 4, goalsFor: 24, goalsAgainst: 20, points: 20 },
    { rank: 5, team: "Étoile du Port", played: 12, won: 4, drawn: 3, lost: 5, goalsFor: 19, goalsAgainst: 22, points: 15 },
    { rank: 6, team: "FC Coteaux", played: 12, won: 3, drawn: 2, lost: 7, goalsFor: 15, goalsAgainst: 27, points: 11 },
    { rank: 7, team: "AC Falaises", played: 12, won: 2, drawn: 2, lost: 8, goalsFor: 13, goalsAgainst: 30, points: 8 },
    { rank: 8, team: "US Marais", played: 12, won: 1, drawn: 2, lost: 9, goalsFor: 10, goalsAgainst: 31, points: 5 },
  ],
};
