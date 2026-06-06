import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getNews } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { PageHeader } from "@/components/sections/PageHeader";
import { NewsCard } from "@/components/cards/NewsCard";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Toute l'actualité du F.C. Littoral : comptes-rendus de matchs, vie du club et temps forts de la saison.",
};

export default async function NewsPage() {
  const articles = await getNews();
  const [featured, ...rest] = articles;

  return (
    <>
      <PageHeader
        eyebrow="Vie du club"
        title="Actualités"
        description="Comptes-rendus, événements et temps forts : suivez toute l'actualité du F.C. Littoral."
      />

      <section className="section">
        <div className="container">
          {/* Article à la une */}
          {featured && (
            <Link
              href={`/actualites/${featured.slug}`}
              className="group grid overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-lg md:grid-cols-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto">
                <Image
                  src={featured.cover}
                  alt={featured.coverAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-7 md:p-10">
                <div className="flex items-center gap-3">
                  <Badge>À la une</Badge>
                  <Badge variant="muted">{featured.category}</Badge>
                </div>
                <time
                  dateTime={featured.date}
                  className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {formatDate(featured.date)}
                </time>
                <h2 className="mt-2 text-2xl leading-tight text-ink md:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-1 font-display text-sm uppercase tracking-wide text-forest transition-colors group-hover:text-gold-600">
                  Lire l&apos;article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          )}

          {/* Reste des articles */}
          {rest.length > 0 && (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((article, i) => (
                <Reveal key={article.slug} delay={(i % 3) * 120}>
                  <NewsCard article={article} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
