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

import { news } from "@/data/news";
import { sponsors } from "@/data/sponsors";
import { teams } from "@/data/teams";
import { resolveFixtures, resolveStandings } from "@/lib/sources";
import type {
  Article,
  Fixture,
  Player,
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

export async function getTeams(): Promise<Team[]> {
  return teams.map(withResolvedPhotos);
}

export async function getTeam(slug: TeamSlug): Promise<Team | undefined> {
  const team = teams.find((t) => t.slug === slug);
  return team ? withResolvedPhotos(team) : undefined;
}

export async function getFlagshipTeam(): Promise<Team | undefined> {
  const team = teams.find((t) => t.flagship);
  return team ? withResolvedPhotos(team) : undefined;
}

/** Statistiques rapides d'une équipe (effectif, total de buts). */
export async function getTeamStats(
  slug: TeamSlug,
): Promise<{ squad: number; goals: number } | undefined> {
  const team = await getTeam(slug);
  if (!team) return undefined;
  const players = team.players ?? [];
  return {
    squad: players.length,
    goals: players.reduce((sum, p) => sum + (p.goals ?? 0), 0),
  };
}

/** Meilleur buteur d'une équipe (joueur ayant le plus de buts), avec le nom de l'équipe. */
export async function getTopScorer(
  slug?: TeamSlug,
): Promise<(Player & { teamName: string }) | undefined> {
  const team = slug ? await getTeam(slug) : await getFlagshipTeam();
  const scorers = (team?.players ?? []).filter((p) => (p.goals ?? 0) > 0);
  if (!team || scorers.length === 0) return undefined;
  const top = scorers.reduce((best, p) =>
    (p.goals ?? 0) > (best.goals ?? 0) ? p : best,
  );
  // `top.photo` est déjà résolue par getTeam/getFlagshipTeam.
  return { ...top, teamName: team.name };
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

/* ----------------------------- PHASE 2 ----------------------------- */
/* Ces fonctions passent par la couche `lib/sources` : source mock        */
/* aujourd'hui, API FFF/DOFA demain — sans toucher aux composants.        */

export async function getStandings(team: TeamSlug = "seniors"): Promise<Standing[]> {
  return resolveStandings(team);
}

export async function getFixtures(team: TeamSlug = "seniors"): Promise<Fixture[]> {
  const all = await resolveFixtures(team);
  return [...all].sort(
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
            ? "Équipe loisir : pas de classement officiel. On joue avant tout pour le plaisir et la convivialité !"
            : undefined,
      };
    }),
  );
}
