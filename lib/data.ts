/**
 * COUCHE D'ACCÈS AUX DONNÉES.
 *
 * ⚠️ Les pages/composants n'importent JAMAIS les fichiers `data/*` directement.
 * Ils passent toujours par ces fonctions async.
 *
 * Aujourd'hui : elles renvoient les données mock.
 * Demain (phase 2/3) : remplacer l'intérieur par un `fetch` d'API foot ou une
 * requête base de données — la signature ne change pas, donc AUCUN composant
 * à modifier.
 *
 * Exemple futur :
 *   export async function getStandings(): Promise<Standing[]> {
 *     const res = await fetch(`${API_URL}/standings`, { next: { revalidate: 3600 } });
 *     return res.json();
 *   }
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import { club } from "@/data/club";
import { news } from "@/data/news";
import { getActiveProducts, getAllProducts } from "@/lib/products-store";
import { getManualFixtures } from "@/lib/manual-fixtures-store";
import { getMatchStats } from "@/lib/match-stats-store";
import { sponsors } from "@/data/sponsors";
import { teams } from "@/data/teams";
import { resolveFixtures, resolveStandings } from "@/lib/sources";
import type {
  Article,
  Fixture,
  MatchType,
  Player,
  PlayerSeasonStats,
  PlayerStatTotals,
  Product,
  Sponsor,
  Standing,
  Team,
  TeamSeason,
  TeamSlug,
} from "@/types";

/* ----------------------------- ÉQUIPES ----------------------------- */

/** Ne garde la photo que si le fichier existe vraiment dans /public (sinon undefined). */
function resolvePhoto(photo?: string): string | undefined {
  return photo && existsSync(join(process.cwd(), "public", photo))
    ? photo
    : undefined;
}

/** Renvoie une copie de l'équipe avec les photos joueurs résolues. */
function withResolvedPhotos(team: Team): Team {
  if (!team.players) return team;
  return {
    ...team,
    players: team.players.map((p) => ({ ...p, photo: resolvePhoto(p.photo) })),
  };
}

/**
 * Rang de catégorie (du plus senior au plus jeune) pour l'ordre d'affichage.
 * Plus le nombre est élevé, plus la catégorie est « haute ».
 */
const CATEGORY_RANK: Record<TeamSlug, number> = {
  seniors: 3,
  u13: 1,
};

/**
 * Ordre canonique d'affichage des équipes, appliqué partout où l'on liste
 * « toutes les équipes » : l'équipe fanion TOUJOURS en premier, puis les
 * autres par catégorie décroissante.
 */
function orderTeams(list: Team[]): Team[] {
  return [...list].sort((a, b) => {
    if (Boolean(a.flagship) !== Boolean(b.flagship)) return a.flagship ? -1 : 1;
    return (CATEGORY_RANK[b.slug] ?? 0) - (CATEGORY_RANK[a.slug] ?? 0);
  });
}

export async function getTeams(): Promise<Team[]> {
  return orderTeams(teams.map(withResolvedPhotos));
}

export async function getTeam(slug: TeamSlug): Promise<Team | undefined> {
  const team = teams.find((t) => t.slug === slug);
  return team ? withResolvedPhotos(team) : undefined;
}

export async function getFlagshipTeam(): Promise<Team | undefined> {
  const team = teams.find((t) => t.flagship);
  return team ? withResolvedPhotos(team) : undefined;
}

/* ------------------------- STATS PAR MATCH ------------------------- */

/**
 * Agrège les stats d'une équipe (buts/passes/matchs joués) depuis les feuilles
 * de match (`match-stats`), ventilées par type de compétition + total.
 *
 * `hasData` = au moins une feuille de match saisie pour cette équipe. Tant que
 * c'est faux, l'affichage retombe sur les buts « statiques » de `data/teams.ts`
 * (repli), pour ne pas afficher un effectif à 0 avant toute saisie.
 */
async function computeSeasonStats(
  slug: TeamSlug,
): Promise<{ stats: PlayerSeasonStats[]; hasData: boolean }> {
  const team = teams.find((t) => t.slug === slug);
  const roster = team?.players ?? [];
  if (roster.length === 0) return { stats: [], hasData: false };

  const [fixtures, store] = await Promise.all([getFixtures(slug), getMatchStats()]);

  const blank = (): PlayerStatTotals => ({ goals: 0, assists: 0, matches: 0 });
  const map = new Map<string, PlayerSeasonStats>();
  for (const p of roster) {
    map.set(p.name, {
      name: p.name,
      byType: { championnat: blank(), coupe: blank(), amical: blank() },
      total: blank(),
    });
  }

  let hasData = false;
  for (const fixture of fixtures) {
    const sheet = store[fixture.id];
    if (!sheet || sheet.players.length === 0) continue;
    hasData = true;
    const type: MatchType = fixture.type ?? "championnat";
    for (const line of sheet.players) {
      const agg = map.get(line.name);
      if (!agg) continue; // joueur hors effectif → ignoré
      const goals = Number(line.goals) || 0;
      const assists = Number(line.assists) || 0;
      agg.byType[type].goals += goals;
      agg.byType[type].assists += assists;
      agg.byType[type].matches += 1;
      agg.total.goals += goals;
      agg.total.assists += assists;
      agg.total.matches += 1;
    }
  }

  return { stats: roster.map((p) => map.get(p.name)!), hasData };
}

/**
 * Effectif + stats d'une équipe, prêt à afficher :
 * - `players` : l'effectif avec buts/passes/matchs CALCULÉS (ou repli statique).
 * - `seasonStats` : le détail par type de match (pour le filtre de l'onglet Stats).
 * - `hasMatchData` : des feuilles de match ont-elles été saisies ?
 */
export async function getTeamStatsBundle(slug: TeamSlug): Promise<{
  team: Team | undefined;
  players: Player[];
  seasonStats: PlayerSeasonStats[];
  hasMatchData: boolean;
}> {
  const team = await getTeam(slug);
  const roster = team?.players ?? [];
  const { stats, hasData } = await computeSeasonStats(slug);

  if (!hasData) {
    // Repli : on garde les buts statiques de data/teams.ts.
    return { team, players: roster, seasonStats: stats, hasMatchData: false };
  }

  const byName = new Map(stats.map((s) => [s.name, s.total]));
  const players = roster.map((p) => {
    const t = byName.get(p.name);
    return { ...p, goals: t?.goals ?? 0, assists: t?.assists ?? 0, matches: t?.matches ?? 0 };
  });
  return { team, players, seasonStats: stats, hasMatchData: true };
}

/** Statistiques rapides d'une équipe (effectif, total de buts). */
export async function getTeamStats(
  slug: TeamSlug,
): Promise<{ squad: number; goals: number } | undefined> {
  const { team, players } = await getTeamStatsBundle(slug);
  if (!team) return undefined;
  return {
    squad: players.length,
    goals: players.reduce((sum, p) => sum + (p.goals ?? 0), 0),
  };
}

/** Meilleur buteur d'une équipe (joueur ayant le plus de buts), avec le nom de l'équipe. */
export async function getTopScorer(
  slug?: TeamSlug,
): Promise<(Player & { teamName: string }) | undefined> {
  const targetSlug = slug ?? (await getFlagshipTeam())?.slug;
  if (!targetSlug) return undefined;
  const { team, players } = await getTeamStatsBundle(targetSlug);
  if (!team) return undefined;
  const scorers = players
    .filter((p) => (p.goals ?? 0) > 0)
    .sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0));
  if (scorers.length === 0) return undefined;
  // `photo` est déjà résolue par getTeam.
  return { ...scorers[0], teamName: team.name };
}

/** Aperçu de saison (classement + matchs) d'une seule équipe. */
export async function getSeasonBoard(
  slug: TeamSlug,
): Promise<TeamSeason | undefined> {
  return (await getSeasonBoards()).find((b) => b.slug === slug);
}

/* ---------------------------- ACTUALITÉS --------------------------- */

export async function getNews(): Promise<Article[]> {
  return [...news].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export async function getLatestNews(limit = 3): Promise<Article[]> {
  return (await getNews()).slice(0, limit);
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  return news.find((a) => a.slug === slug);
}

/** Articles mis en avant ("à ne pas rater"), triés du plus récent au plus ancien. */
export async function getFeaturedArticles(): Promise<Article[]> {
  return (await getNews()).filter((a) => a.featured);
}

export async function getArticleSlugs(): Promise<string[]> {
  return news.map((a) => a.slug);
}

/* ----------------------------- SPONSORS ---------------------------- */

export async function getSponsors(): Promise<Sponsor[]> {
  return sponsors;
}

export async function getMainSponsors(): Promise<Sponsor[]> {
  return sponsors.filter((s) => s.tier === "principal" || s.tier === "officiel");
}

/* ----------------------------- BOUTIQUE ---------------------------- */

export async function getProducts(): Promise<Product[]> {
  return getActiveProducts();
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getAllProducts()).find((p) => p.slug === slug);
}

/* ----------------------------- PHASE 2 ----------------------------- */
/* Ces fonctions passent par la couche `lib/sources` : source mock        */
/* aujourd'hui, API FFF/DOFA demain — sans toucher aux composants.        */

export async function getStandings(team: TeamSlug = "seniors"): Promise<Standing[]> {
  return resolveStandings(team);
}

export async function getFixtures(
  team: TeamSlug = "seniors",
  opts: { fresh?: boolean } = {},
): Promise<Fixture[]> {
  const [official, manual] = await Promise.all([
    resolveFixtures(team),
    getManualFixtures(opts.fresh),
  ]);

  // Matchs FFF : type "championnat" par défaut.
  const officialFixtures: Fixture[] = official.map((f) => ({
    ...f,
    type: f.type ?? "championnat",
  }));

  // Matchs ajoutés à la main (amicaux, coupes hors FFF…) pour cette équipe.
  const manualFixtures: Fixture[] = manual
    .filter((m) => m.slug === team)
    .map((m) => ({
      id: m.id,
      date: m.date,
      time: m.time,
      home: m.home,
      away: m.away,
      homeLogo: m.home === club.name ? "/logo.png" : undefined,
      awayLogo: m.away === club.name ? "/logo.png" : undefined,
      competition: m.competition,
      homeScore: m.homeScore ?? undefined,
      awayScore: m.awayScore ?? undefined,
      venue: m.venue,
      type: m.type,
      manual: true,
    }));

  return [...officialFixtures, ...manualFixtures].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

/** Un match précis d'une équipe (par identifiant). */
export async function getFixture(
  team: TeamSlug,
  id: string,
): Promise<Fixture | undefined> {
  return (await getFixtures(team)).find((f) => f.id === id);
}

/** Tous les matchs (toutes équipes) — pour la génération des pages match. */
export async function getAllFixtureRefs(): Promise<
  { slug: TeamSlug; id: string }[]
> {
  const all = await getTeams();
  const lists = await Promise.all(
    all.map(async (t) =>
      (await getFixtures(t.slug)).map((f) => ({ slug: t.slug, id: f.id })),
    ),
  );
  return lists.flat();
}

/** Sépare résultats passés et matchs à venir pour une équipe. */
export async function getSplitFixtures(team: TeamSlug = "seniors"): Promise<{
  results: Fixture[];
  upcoming: Fixture[];
}> {
  const all = await getFixtures(team);
  const hasScore = (f: Fixture) => f.homeScore != null && f.awayScore != null;
  return {
    results: all.filter(hasScore).reverse(),
    upcoming: all.filter((f) => !hasScore(f)),
  };
}

/** Agrège classement + matchs pour TOUTES les équipes (pour la page Saison). */
export async function getSeasonBoards(): Promise<TeamSeason[]> {
  const all = await getTeams();
  return Promise.all(
    all.map(async (t) => {
      const [standings, { results, upcoming }] = await Promise.all([
        getStandings(t.slug),
        getSplitFixtures(t.slug),
      ]);
      return {
        slug: t.slug,
        name: t.name,
        standings,
        results,
        upcoming,
        noStandingsNote:
          standings.length === 0
            ? "Le classement officiel n'est pas encore disponible : il apparaîtra dès les premières journées de championnat jouées."
            : undefined,
      };
    }),
  );
}
