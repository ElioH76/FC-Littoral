import type { MetadataRoute } from "next";

import { getTeams } from "@/lib/data";

const BASE_URL = "https://www.fc-littoral.fr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const teams = await getTeams();

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

  return [...staticRoutes, ...teamRoutes];
}
