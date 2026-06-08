import type { MetadataRoute } from "next";

import { getArticleSlugs, getTeams } from "@/lib/data";

const BASE_URL = "https://fclittoral.fr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, teams] = await Promise.all([getArticleSlugs(), getTeams()]);

  const staticRoutes = [
    "",
    "/club",
    "/equipes",
    "/saison",
    "/actualites",
    "/sponsors",
  ].map(
    (route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    }),
  );

  const articleRoutes = slugs.map((slug) => ({
    url: `${BASE_URL}/actualites/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const teamRoutes = teams.map((t) => ({
    url: `${BASE_URL}/equipes/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...teamRoutes, ...articleRoutes];
}
