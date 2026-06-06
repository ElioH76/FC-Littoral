"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

import type { Article } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const AUTOPLAY_MS = 6000;

function cleanTitle(title: string) {
  return title.replace(/^À ne pas louper\s*:\s*/i, "");
}

/**
 * Carrousel des actualités "à ne pas rater" (articles `featured`).
 * Autoplay (pause au survol/focus), flèches, points, swipe tactile,
 * navigation clavier, et respect de prefers-reduced-motion.
 */
export function FeaturedSlider({ articles }: { articles: Article[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = articles.length;

  const go = useCallback(
    (i: number) => setIndex((i + count) % count),
    [count],
  );
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  // Autoplay
  useEffect(() => {
    if (count <= 1 || paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const id = setInterval(() => setIndex((v) => (v + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [count, paused]);

  if (count === 0) return null;

  return (
    <section className="container py-10 md:py-14">
      <div
        className="group relative overflow-hidden rounded-3xl border border-gold/30 bg-ink text-white shadow-lg"
        role="region"
        aria-roledescription="carrousel"
        aria-label="Actualités à ne pas rater"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (dx > 50) prev();
          else if (dx < -50) next();
          touchX.current = null;
        }}
      >
        <div className="absolute inset-0 bg-gold-grain opacity-50" aria-hidden />

        {/* Piste */}
        <div
          className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {articles.map((article, i) => (
            <Slide key={article.slug} article={article} active={i === index} />
          ))}
        </div>

        {/* Flèches */}
        {count > 1 && (
          <>
            <SliderButton side="left" onClick={prev} label="Précédent">
              <ChevronLeft className="h-5 w-5" />
            </SliderButton>
            <SliderButton side="right" onClick={next} label="Suivant">
              <ChevronRight className="h-5 w-5" />
            </SliderButton>
          </>
        )}

        {/* Points */}
        {count > 1 && (
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {articles.map((a, i) => (
              <button
                key={a.slug}
                type="button"
                onClick={() => go(i)}
                aria-label={`Aller à la diapositive ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index
                    ? "w-6 bg-gold"
                    : "w-2 bg-white/40 hover:bg-white/70",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Slide({ article, active }: { article: Article; active: boolean }) {
  const images = article.gallery?.length
    ? article.gallery.slice(0, 2)
    : [{ src: article.cover, alt: article.coverAlt }];
  const isGallery = (article.gallery?.length ?? 0) >= 2;

  return (
    <div
      className="relative flex w-full shrink-0 flex-col items-center gap-6 p-6 md:flex-row md:gap-10 md:p-10"
      aria-hidden={!active}
    >
      {/* Texte */}
      <div className="flex-1 text-center md:text-left">
        <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 font-display text-xs uppercase tracking-widest text-ink">
          <Sparkles className="h-3.5 w-3.5" /> À ne pas rater
        </span>
        <h2 className="mt-3 text-2xl leading-tight text-white md:text-3xl lg:text-4xl">
          {cleanTitle(article.title)}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/70 md:mx-0">
          {article.excerpt}
        </p>
        <Button asChild className="mt-5" tabIndex={active ? 0 : -1}>
          <Link href={`/actualites/${article.slug}`}>
            Découvrir
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Visuel(s) */}
      <Link
        href={`/actualites/${article.slug}`}
        tabIndex={active ? 0 : -1}
        className="relative flex shrink-0 gap-3"
        aria-label={article.title}
      >
        {isGallery ? (
          images.map((img, i) => (
            <span
              key={img.src}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-md transition-transform duration-300 hover:scale-105"
              style={{ rotate: i === 0 ? "-3deg" : "3deg" }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={170}
                height={170}
                className="h-28 w-28 object-cover sm:h-36 sm:w-36 md:h-40 md:w-40"
              />
            </span>
          ))
        ) : (
          <span className="overflow-hidden rounded-xl border border-white/10 shadow-md">
            <Image
              src={images[0].src}
              alt={images[0].alt}
              width={420}
              height={240}
              className="h-40 w-64 object-cover transition-transform duration-500 hover:scale-105 sm:w-80 md:h-48 md:w-96"
            />
          </span>
        )}
      </Link>
    </div>
  );
}

function SliderButton({
  side,
  onClick,
  label,
  children,
}: {
  side: "left" | "right";
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-ink/70 text-white backdrop-blur transition-all hover:border-gold hover:bg-gold hover:text-ink",
        side === "left" ? "left-3" : "right-3",
      )}
    >
      {children}
    </button>
  );
}
