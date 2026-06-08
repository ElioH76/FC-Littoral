import { club } from "@/data/club";
import type { Fixture, Standing } from "@/types";
import type { SeasonSource, TeamSourceConfig } from "./types";

/**
 * Source FFF — API « DOFA » (api-dofa.fff.fr), le flux JSON public du foot amateur.
 *
 * Pipeline (tout public) :
 *   1. /api/clubs/{clubId}/equipes  → trouve l'équipe (catégorie + numéro)
 *      et son engagement championnat → cp_no / phase / poule.
 *   2. /api/compets/{cp}/phases/{ph}/poules/{po}/classement_journees → classement.
 *   3. /api/compets/{cp}/phases/{ph}/poules/{po}/matchs → calendrier & résultats.
 *
 * Les lignes de NOTRE club (clubId) sont renommées avec le nom d'affichage du
 * site (club.name) pour la mise en avant « Nous ».
 *
 * Mise en cache : revalidation quotidienne (ISR). En cas d'échec, l'orchestrateur
 * (lib/sources/index.ts) retombe sur les données de démo.
 */

const BASE = "https://api-dofa.fff.fr/api";
const HEADERS = {
  "User-Agent": "Mozilla/5.0",
  Accept: "application/json",
  Referer: "https://www.fff.fr/",
};
const REVALIDATE = 86400; // 24 h

async function dofa<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: HEADERS,
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/* ----------------------------- Types DOFA ----------------------------- */

interface DofaEngagement {
  competition?: { cp_no?: number; type?: string };
  phase?: { number?: number };
  poule?: { stage_number?: number };
}
interface DofaEquipe {
  category_code?: string;
  number?: number;
  engagements?: DofaEngagement[];
}
interface DofaStandRow {
  rank: number;
  cj_no?: number;
  point_count?: number;
  total_games_count?: number;
  won_games_count?: number;
  draw_games_count?: number;
  lost_games_count?: number;
  goals_for_count?: number;
  goals_against_count?: number;
  equipe?: { short_name?: string; club?: { cl_no?: number } };
}
interface DofaMatch {
  ma_no: number;
  date?: string;
  time?: string;
  poule_journee?: { number?: number };
  competition?: { name?: string };
  home?: { short_name?: string; club?: { cl_no?: number; logo?: string } };
  away?: { short_name?: string; club?: { cl_no?: number; logo?: string } };
  home_score?: number | null;
  away_score?: number | null;
  terrain?: { name?: string; city?: string };
}

type Poule = { cp: number; phase: number; poule: number };

/** Trouve l'engagement championnat (cp/phase/poule) de l'équipe configurée. */
async function resolvePoule(config: TeamSourceConfig): Promise<Poule | null> {
  if (!config.clubId) return null;
  const equipes = await dofa<DofaEquipe[]>(`/clubs/${config.clubId}/equipes`);
  if (!equipes || equipes.length === 0) return null;

  const eq =
    equipes.find(
      (e) =>
        e.category_code === config.category && e.number === config.teamNumber,
    ) ??
    equipes.find((e) => e.category_code === config.category) ??
    equipes[0];

  const champ =
    (eq.engagements ?? []).find((en) => en.competition?.type === "CH") ??
    eq.engagements?.[0];

  const cp = champ?.competition?.cp_no;
  const phase = champ?.phase?.number;
  const poule = champ?.poule?.stage_number;
  if (cp == null || phase == null || poule == null) return null;
  return { cp, phase, poule };
}

/** Renomme la ligne avec le nom d'affichage du site si c'est notre club. */
function displayName(clNo: number | undefined, config: TeamSourceConfig, fallback: string) {
  return clNo != null && clNo === config.clubId ? club.name : fallback;
}

/** Logo : notre logo de site pour notre club, sinon le logo FFF. */
function logoFor(clNo: number | undefined, config: TeamSourceConfig, fallback?: string) {
  return clNo != null && clNo === config.clubId ? "/logo.png" : fallback;
}

export const fffDofaSource: SeasonSource = {
  name: "fff-dofa",

  async getStandings(_team, config): Promise<Standing[]> {
    const p = await resolvePoule(config);
    if (!p) return [];
    const rows = await dofa<DofaStandRow[]>(
      `/compets/${p.cp}/phases/${p.phase}/poules/${p.poule}/classement_journees`,
    );
    if (!rows || rows.length === 0) return [];

    // Garde la journée la plus récente (classement courant).
    const maxCj = Math.max(...rows.map((r) => r.cj_no ?? 0));
    return rows
      .filter((r) => (r.cj_no ?? 0) === maxCj)
      .sort((a, b) => a.rank - b.rank)
      .map((r) => ({
        rank: r.rank,
        team: displayName(r.equipe?.club?.cl_no, config, r.equipe?.short_name ?? "—"),
        played: r.total_games_count ?? 0,
        won: r.won_games_count ?? 0,
        drawn: r.draw_games_count ?? 0,
        lost: r.lost_games_count ?? 0,
        goalsFor: r.goals_for_count ?? 0,
        goalsAgainst: r.goals_against_count ?? 0,
        points: r.point_count ?? 0,
      }));
  },

  async getFixtures(_team, config): Promise<Fixture[]> {
    const p = await resolvePoule(config);
    if (!p) return [];
    const matchs = await dofa<DofaMatch[]>(
      `/compets/${p.cp}/phases/${p.phase}/poules/${p.poule}/matchs`,
    );
    if (!matchs) return [];

    // Uniquement les matchs de notre équipe.
    return matchs
      .filter(
        (m) =>
          m.home?.club?.cl_no === config.clubId ||
          m.away?.club?.cl_no === config.clubId,
      )
      .map((m) => {
        const played = m.home_score != null && m.away_score != null;
        const journee = m.poule_journee?.number;
        return {
          id: String(m.ma_no),
          date: (m.date ?? "").slice(0, 10),
          time: m.time ?? undefined,
          home: displayName(m.home?.club?.cl_no, config, m.home?.short_name ?? "—"),
          away: displayName(m.away?.club?.cl_no, config, m.away?.short_name ?? "—"),
          homeLogo: logoFor(m.home?.club?.cl_no, config, m.home?.club?.logo),
          awayLogo: logoFor(m.away?.club?.cl_no, config, m.away?.club?.logo),
          competition: `${m.competition?.name ?? "Championnat"}${
            journee ? ` • J${journee}` : ""
          }`,
          homeScore: played ? (m.home_score as number) : undefined,
          awayScore: played ? (m.away_score as number) : undefined,
          venue: m.terrain?.name
            ? `${m.terrain.name}${m.terrain.city ? `, ${m.terrain.city}` : ""}`
            : undefined,
        };
      });
  },
};
