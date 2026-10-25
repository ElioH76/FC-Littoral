import { readdirSync } from "node:fs";

/**
 * Photos joueurs présentes au build (cf. `resolvePhoto` dans lib/data.ts).
 * Calculé ici plutôt qu'à l'exécution pour ne pas embarquer /public dans les
 * fonctions serveur. En dev : redémarrer `npm run dev` après ajout d'une photo.
 */
function listPlayerPhotos() {
  try {
    return readdirSync("public/players")
      .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
      .map((f) => `/players/${f}`);
  } catch {
    return [];
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PLAYER_PHOTOS: JSON.stringify(listPlayerPhotos()),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
