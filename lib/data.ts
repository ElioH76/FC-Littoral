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

import { fixtures } from "@/data/fixtures";
import { news } from "@/data/news";
import { sponsors } from "@/data/sponsors";
import { standings } from "@/data/standings";
import { teams } from "@/data/teams";
import type {
  Article,
  Fixture,
  Sponsor,
  Standing,
  Team,
  TeamSlug,
} from "@/types";

/* ----------------------------- ÉQUIPES ----------------------------- */

export async function getTeams(): Promise<Team[]> {
  return teams;
}

export async function getTeam(slug: TeamSlug): Promise<Team | undefined> {
  return teams.find((t) => t.slug === slug);
}

export async function getFlagshipTeam(): Promise<Team | undefined> {
  return teams.find((t) => t.flagship);
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
/* Données aujourd'hui mock — remplacer l'intérieur par un fetch d'API */
/* foot le moment venu (revalidation ISR recommandée).                 */

export async function getStandings(): Promise<Standing[]> {
  return standings;
}

export async function getFixtures(): Promise<Fixture[]> {
  return [...fixtures].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

/** Sépare résultats passés et matchs à venir (par rapport à aujourd'hui). */
export async function getSplitFixtures(): Promise<{
  results: Fixture[];
  upcoming: Fixture[];
}> {
  const all = await getFixtures();
  const hasScore = (f: Fixture) =>
    f.homeScore != null && f.awayScore != null;
  return {
    results: all.filter(hasScore).reverse(),
    upcoming: all.filter((f) => !hasScore(f)),
  };
}
