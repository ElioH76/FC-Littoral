import type { Fixture, Standing, TeamSlug } from "@/types";
import type { SeasonSource, TeamSourceConfig } from "./types";

/**
 * Source FFF — API « DOFA » (api-dofa.fff.fr), le flux JSON qui alimente les
 * widgets officiels du foot amateur.
 *
 * ⚠️ NON ENCORE BRANCHÉE. Il reste à capter les endpoints/ids exacts
 * (idéalement via les appels réseau de fff.fr). Une fois connus :
 *   1. Remplir `teamSourceConfig` (lib/season-config.ts) avec `pouleId`/`clubId`.
 *   2. Décommenter/compléter les `fetch` ci-dessous + les mappers.
 *   3. Passer `ACTIVE_SOURCE = "fff-dofa"` dans lib/season-config.ts.
 * Le reste du site ne change pas (fallback automatique sur les mocks en cas d'échec).
 *
 * Notes de repérage (déjà vérifiées) :
 *   - Base : https://api-dofa.fff.fr/api
 *   - Headers conseillés : User-Agent navigateur + Referer https://www.fff.fr/
 *   - Mettre en cache : fetch(..., { next: { revalidate: 86400 } })  // 1x/jour
 */

const BASE = "https://api-dofa.fff.fr/api";
const HEADERS = {
  "User-Agent": "Mozilla/5.0",
  Accept: "application/json",
  Referer: "https://www.fff.fr/",
};
const REVALIDATE = 86400; // 24 h

export const fffDofaSource: SeasonSource = {
  name: "fff-dofa",

  async getStandings(_team: TeamSlug, config: TeamSourceConfig): Promise<Standing[]> {
    if (!config.pouleId) return [];
    // TODO: endpoint exact à confirmer, ex :
    // const res = await fetch(`${BASE}/poules/${config.pouleId}/classement_journees`, {
    //   headers: HEADERS,
    //   next: { revalidate: REVALIDATE },
    // });
    // if (!res.ok) throw new Error(`DOFA classement ${res.status}`);
    // return mapStandings(await res.json());
    throw new Error("FFF DOFA: getStandings non encore implémenté");
  },

  async getFixtures(_team: TeamSlug, config: TeamSourceConfig): Promise<Fixture[]> {
    if (!config.pouleId) return [];
    // TODO: endpoint exact à confirmer (matchs/rencontres de la poule), ex :
    // const res = await fetch(`${BASE}/poules/${config.pouleId}/matchs`, {
    //   headers: HEADERS,
    //   next: { revalidate: REVALIDATE },
    // });
    // if (!res.ok) throw new Error(`DOFA calendrier ${res.status}`);
    // return mapFixtures(await res.json());
    throw new Error("FFF DOFA: getFixtures non encore implémenté");
  },
};

/* ----------------------- Mappers (à compléter) ----------------------- */
/* Convertissent la réponse DOFA vers nos types internes. Adapter les noms */
/* de champs une fois la structure JSON réelle observée.                   */

// function mapStandings(json: any): Standing[] {
//   return (json?.["hydra:member"] ?? json ?? []).map((r: any) => ({
//     rank: r.rank ?? r.classement,
//     team: r.equipe?.club?.nom ?? r.team,
//     played: r.total?.MJ ?? r.played,
//     won: r.total?.G, drawn: r.total?.N, lost: r.total?.P,
//     goalsFor: r.total?.BP, goalsAgainst: r.total?.BC,
//     points: r.point ?? r.points,
//   }));
// }

// function mapFixtures(json: any): Fixture[] {
//   return (json?.["hydra:member"] ?? json ?? []).map((m: any) => ({
//     id: String(m.ma_no ?? m.id),
//     date: m.date,
//     home: m.home?.short_name ?? m.equipe_dom,
//     away: m.away?.short_name ?? m.equipe_ext,
//     competition: m.competition?.name ?? "Championnat",
//     homeScore: m.home_score ?? undefined,
//     awayScore: m.away_score ?? undefined,
//     venue: m.terrain?.name,
//   }));
// }

export { BASE, HEADERS, REVALIDATE };
