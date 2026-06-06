import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Article } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function NewsCard({ article }: { article: Article }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/actualites/${article.slug}`}
        className="relative block aspect-[16/10] overflow-hidden"
      >
        <Image
          src={article.cover}
          alt={article.coverAlt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge variant="forest" className="absolute left-3 top-3">
          {article.category}
        </Badge>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <time
          dateTime={article.date}
          className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
        >
          {formatDate(article.date)}
        </time>
        <h3 className="mt-2 text-lg leading-snug">
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
          className="mt-4 inline-flex items-center gap-1 font-display text-sm uppercase tracking-wide text-forest transition-colors hover:text-gold-600"
        >
          Lire l&apos;article
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
