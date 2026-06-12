import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getArticle, getArticleSlugs, getLatestNews } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NewsCard } from "@/components/cards/NewsCard";

interface Params {
  params: { slug: string };
}

/** Génère les pages statiques de chaque article (SEO + perf). */
export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return { title: "Article introuvable" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      images: [{ url: article.cover, alt: article.coverAlt }],
    },
  };
}

export default async function ArticlePage({ params }: Params) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const related = (await getLatestNews(4)).filter(
    (a) => a.slug !== article.slug,
  );

  return (
    <article>
      {/* En-tête article */}
      <header className="relative isolate overflow-hidden bg-ink text-white">
        <Image
          src={article.cover}
          alt={article.coverAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/50" />
        <div className="container relative py-16 md:py-24">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> Toutes les actualités
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <Badge variant="forest">{article.category}</Badge>
            <time
              dateTime={article.date}
              className="text-xs font-medium uppercase tracking-wider text-white/70"
            >
              {formatDate(article.date)}
            </time>
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl leading-tight md:text-5xl">
            {article.title}
          </h1>
        </div>
      </header>

      {/* Image de couverture */}
      <div className="container -mt-10 md:-mt-16">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border-4 border-background shadow-xl">
          <Image
            src={article.cover}
            alt={article.coverAlt}
            fill
            sizes="(max-width: 1280px) 100vw, 1100px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Contenu */}
      <div className="section">
        <div className="container max-w-3xl">
          <p className="text-lg font-medium leading-relaxed text-bone">
            {article.excerpt}
          </p>
          <div className="mt-6 space-y-5 leading-relaxed text-bone-dim">
            {article.content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {article.gallery && article.gallery.length > 0 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {article.gallery.map((img) => (
                <div
                  key={img.src}
                  className="overflow-hidden rounded-xl border bg-muted/40"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={800}
                    height={800}
                    className="h-auto w-full object-contain"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 border-t pt-8">
            <Button asChild variant="outline">
              <Link href="/actualites">
                <ArrowLeft className="h-4 w-4" /> Retour aux actualités
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Articles liés */}
      {related.length > 0 && (
        <section className="section border-t border-white/10 bg-ink-800">
          <div className="container">
            <h2 className="text-2xl text-bone md:text-3xl">À lire aussi</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.slice(0, 3).map((a) => (
                <NewsCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
