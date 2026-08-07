import { Instagram } from "lucide-react";

/**
 * Feed Instagram — alimenté par Behold (auto-actualisé).
 *
 * On n'utilise PAS le web-component `<behold-widget>` (script cassé/instable) :
 * on lit directement l'API de données publique de Behold
 * (https://feeds.behold.so/{feedId}) et on rend NOTRE propre grille, aux
 * couleurs du club. Avantages : rendu maîtrisé (aucun rognage au-delà du 4:5
 * réglé dans Behold), server-side (bon pour le SEO/perf), et toujours à jour
 * grâce à la revalidation horaire (ISR).
 *
 * 👉 Le format des vignettes (4:5), le nombre de posts, etc. se règlent CÔTÉ
 *    BEHOLD : https://app.behold.so/feeds
 */

const FEED_ENDPOINT = "https://feeds.behold.so";
const REVALIDATE = 3600; // 1 h

interface BeholdSize {
  width: number;
  height: number;
  mediaUrl: string;
}

interface BeholdPost {
  id: string;
  permalink: string;
  caption?: string;
  prunedCaption?: string;
  mediaType: string;
  mediaUrl: string;
  sizes?: Partial<Record<"small" | "medium" | "large" | "full", BeholdSize>>;
}

interface BeholdFeed {
  username?: string;
  posts?: BeholdPost[];
}

async function getFeed(feedId: string): Promise<BeholdFeed | null> {
  try {
    const res = await fetch(`${FEED_ENDPOINT}/${feedId}`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return (await res.json()) as BeholdFeed;
  } catch {
    return null;
  }
}

/** Vignette la plus adaptée (déjà recadrée en 4:5 par Behold). */
function thumbUrl(post: BeholdPost): string {
  return (
    post.sizes?.large?.mediaUrl ??
    post.sizes?.medium?.mediaUrl ??
    post.sizes?.full?.mediaUrl ??
    post.mediaUrl
  );
}

/** Texte alternatif à partir de la légende (nettoyée), pour l'accessibilité. */
function altFor(post: BeholdPost): string {
  const caption = (post.prunedCaption ?? post.caption ?? "")
    .replace(/\s+/g, " ")
    .trim();
  return caption
    ? `Publication Instagram du F.C. Littoral : ${caption.slice(0, 120)}`
    : "Publication Instagram du F.C. Littoral";
}

export async function InstagramFeed({ feedId }: { feedId: string }) {
  const feed = await getFeed(feedId);
  const posts = feed?.posts ?? [];

  // Si le feed est indisponible ou vide, on n'affiche pas de grille (le titre
  // et le lien vers Instagram restent gérés par la page).
  if (posts.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4">
      {posts.map((post) => (
        <a
          key={post.id}
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-gold"
        >
          {/* Images servies par le CDN Behold (déjà recadrées) → <img> simple
              pour éviter de gérer une allowlist de domaines next/image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbUrl(post)}
            alt={altFor(post)}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-ink/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Instagram className="h-7 w-7 text-bone" />
          </span>
        </a>
      ))}
    </div>
  );
}
