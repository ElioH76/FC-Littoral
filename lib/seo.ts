import type { Metadata } from "next";

import { club } from "@/data/club";

/** Domaine de production (les URLs vercel.app y sont redirigées). */
export const SITE_URL = "https://www.fc-littoral.fr";

type PageMeta = {
  title: string;
  description: string;
  /** Chemin de la page, ex. "/club" → URL canonique. */
  path: string;
  images?: { url: string; alt?: string }[];
};

// Image de partage par défaut (app/opengraph-image.jpg) : une page qui
// définit son propre `openGraph` n'hérite pas de celle de la racine.
const DEFAULT_IMAGES = [
  {
    url: "/opengraph-image.jpg",
    width: 1200,
    height: 630,
    alt: `Équipe du ${club.name}, club de football amateur à Heuqueville`,
  },
];

/**
 * Métadonnées d'une page : titre, description, URL canonique et aperçus de
 * partage (Open Graph / Twitter) cohérents avec la page — sinon les réseaux
 * reprennent le titre de l'accueil.
 */
export function pageMetadata({
  title,
  description,
  path,
  images = DEFAULT_IMAGES,
}: PageMeta): Metadata {
  const fullTitle = `${title} | ${club.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      type: "website",
      locale: "fr_FR",
      siteName: club.name,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: images.map((i) => i.url),
    },
  };
}
