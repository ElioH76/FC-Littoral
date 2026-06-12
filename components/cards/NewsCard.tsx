import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Article } from "@/types";
import { formatDate } from "@/lib/utils";

export function NewsCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/actualites/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-800 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={article.cover}
          alt={article.coverAlt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <span className="font-heading text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-gold">
          {formatDate(article.date)} · {article.category}
        </span>
        <h3 className="font-heading text-lg font-extrabold leading-snug text-bone">
          {article.title}
        </h3>
        <p className="line-clamp-3 flex-1 text-sm text-bone-dim">
          {article.excerpt}
        </p>
        <span className="mt-auto inline-flex items-center gap-2 pt-1 font-heading text-xs font-extrabold uppercase tracking-wide text-bone transition-colors group-hover:text-gold-bright">
          Lire l&apos;article
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
