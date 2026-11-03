import type { MetadataRoute } from "next";

import { getAllFixtureRefs, getTeams } from "@/lib/data";
import { SITE_URL as BASE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [teams, fixtures] = await Promise.all([getTeams(), getAllFixtureRefs()]);

  const staticRoutes = [
    "",
    "/club",
    "/equipes",
    "/saison",
    "/boutique",
    "/sponsors",
  ].map(
    (route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    }),
  );

  const teamRoutes = teams.map((t) => ({
    url: `${BASE_URL}/equipes/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const matchRoutes = fixtures.map((f) => ({
    url: `${BASE_URL}/match/${f.slug}/${encodeURIComponent(f.id)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...teamRoutes, ...matchRoutes];
}
