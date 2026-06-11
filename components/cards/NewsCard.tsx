import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Article } from "@/types";
import { formatDate } from "@/lib/utils";

export function NewsCard({ article }: { article: Article }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <Link
        href={`/actualites/${article.slug}`}
        className="relative block aspect-[16/10] overflow-hidden"
      >
        <Image
          src={article.cover}
          alt={article.coverAlt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {/* Étiquette catégorie inclinée */}
        <span className="clip-tag absolute left-0 top-4 bg-gold px-4 py-1 font-display text-xs uppercase tracking-wider text-ink shadow-md">
          {article.category}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <time
          dateTime={article.date}
          className="font-display text-xs uppercase tracking-[0.2em] text-forest"
        >
          {formatDate(article.date)}
        </time>
        <h3 className="mt-2.5 text-lg leading-snug">
          <Link
            href={`/actualites/${article.slug}`}
            className="transition-colors hover:text-forest"
          >
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
          {article.excerpt}
        </p>
        <Link
          href={`/actualites/${article.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 font-display text-sm uppercase tracking-wide text-forest transition-colors hover:text-gold-600"
        >
          Lire l&apos;article
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <span className="accent-bar" aria-hidden />
    </article>
  );
}
