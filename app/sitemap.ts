import type { MetadataRoute } from "next";

import { getArticleSlugs } from "@/lib/data";

const BASE_URL = "https://fclittoral.fr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getArticleSlugs();

  const staticRoutes = ["", "/equipes", "/sponsors", "/actualites"].map(
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

  return [...staticRoutes, ...articleRoutes];
}
