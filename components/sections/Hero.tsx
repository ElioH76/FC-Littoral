import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Target } from "lucide-react";

import { club } from "@/data/club";
import { getTopScorer } from "@/lib/data";
import { Button } from "@/components/ui/button";

export async function Hero() {
  const scorer = await getTopScorer();

  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      {/* Image de fond stade */}
      <Image
        src="/images/hero.jpg"
        alt="Stade de football au coucher du soleil"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-40"
      />
      {/* Dégradés / poussière dorée façon visuels Instagram */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
      <div className="absolute inset-0 bg-gold-grain" aria-hidden />
      <div className="absolute inset-0 bg-pinstripe opacity-40" aria-hidden />

      {/* Étiquette verticale façon club pro */}
      <span className="pointer-events-none absolute left-6 top-1/2 hidden -translate-y-1/2 -rotate-90 font-display text-xs uppercase tracking-[0.4em] text-white/40 xl:block">
        Saison 2025 — 2026
      </span>

      <div className="container relative flex min-h-[88vh] items-center py-20">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2">
          {/* Colonne texte */}
          <div>
            <span className="reveal eyebrow text-gold">
              <span className="gold-rule !w-8" aria-hidden />
              {club.slogan} !
            </span>

            <h1 className="reveal mt-4 text-5xl leading-[0.92] sm:text-6xl md:text-7xl">
              F.C. <span className="text-gradient-gold">Littoral</span>
              <span className="mt-2 block font-script text-3xl normal-case tracking-normal text-white/90 sm:text-4xl">
                {club.subSlogan}
              </span>
            </h1>

            <p className="reveal mt-6 max-w-xl text-base text-white/80 md:text-lg">
              Club de football amateur fondé en {club.founded}. Du U13 aux
              Vétérans, nous faisons vivre la passion du ballon rond au cœur de
              notre territoire.
            </p>

            <div className="reveal mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/#rejoindre">Rejoindre le club</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-white">
                <Link href="/equipes">Découvrir nos équipes</Link>
              </Button>
            </div>
          </div>

          {/* Colonne droite : meilleur buteur de l'équipe fanion */}
          {scorer && (
            <div className="reveal flex justify-center lg:justify-end">
              <TopScorerCard scorer={scorer} />
            </div>
          )}
        </div>
      </div>

      {/* Indice de défilement */}
      <div className="pointer-events-none absolute bottom-28 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-white/45 md:flex">
        <span className="font-display text-[0.65rem] uppercase tracking-[0.3em]">
          Découvrir
        </span>
        <ChevronDown className="h-4 w-4" />
      </div>

      {/* Bandeau stats en bas du hero */}
      <div className="relative border-t border-white/10 bg-ink/60 backdrop-blur">
        <div className="container grid grid-cols-2 gap-px py-6 md:grid-cols-4">
          {club.stats.map((stat) => (
            <div key={stat.label} className="px-2 text-center md:text-left">
              <div className="font-display text-3xl text-gold md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-white/60">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface Scorer {
  name: string;
  position: string;
  goals?: number;
  number?: number;
  photo?: string;
  teamName: string;
}

function TopScorerCard({ scorer }: { scorer: Scorer }) {
  return scorer.photo ? (
    <TopScorerPhotoCard scorer={scorer} />
  ) : (
    <TopScorerTextCard scorer={scorer} />
  );
}

/** Carte avec photo du joueur (rendu "carte de joueur"). */
function TopScorerPhotoCard({ scorer }: { scorer: Scorer }) {
  return (
    <article className="relative w-full max-w-[20rem]">
      <div className="absolute -inset-4 rounded-[2rem] bg-gold/20 blur-3xl" aria-hidden />
      <div className="relative overflow-hidden rounded-3xl border border-gold/30 shadow-2xl">
        {/* Fond dégradé club */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-700 via-ink to-black" />
        <div className="absolute inset-0 bg-gold-grain opacity-40" aria-hidden />
        {scorer.number != null && (
          <span
            className="pointer-events-none absolute right-3 top-2 z-10 select-none font-display text-[7rem] leading-none text-white/10"
            aria-hidden
          >
            {scorer.number}
          </span>
        )}

        <div className="relative aspect-[4/5]">
          <Image
            src={scorer.photo as string}
            alt={`${scorer.name}, ${scorer.position}`}
            fill
            sizes="320px"
            priority
            className="object-cover object-top"
          />
          {/* Voile bas pour lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />

          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 font-display text-xs uppercase tracking-widest text-ink shadow-md">
            <Target className="h-3.5 w-3.5" /> Meilleur buteur
          </span>

          <div className="absolute inset-x-0 bottom-0 p-5">
            <div className="flex items-end gap-2">
              <span className="font-display text-5xl leading-none text-gold drop-shadow">
                {scorer.goals}
              </span>
              <span className="mb-1 text-xs uppercase tracking-widest text-white/80">
                buts
              </span>
            </div>
            <div className="mt-2 font-display text-3xl uppercase leading-none text-white">
              {scorer.name}
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-sm text-white/80">
              {scorer.number != null && (
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gold font-display text-xs text-ink">
                  {scorer.number}
                </span>
              )}
              <span>
                {scorer.position} · {scorer.teamName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Carte typographique (repli si pas de photo). */
function TopScorerTextCard({ scorer }: { scorer: Scorer }) {
  return (
    <article className="relative w-full max-w-sm">
      <div className="absolute -inset-4 rounded-[2rem] bg-gold/20 blur-3xl" aria-hidden />
      <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-md">
        {scorer.number != null && (
          <span
            className="pointer-events-none absolute -right-3 -top-6 select-none font-display text-[9rem] leading-none text-gold/10"
            aria-hidden
          >
            {scorer.number}
          </span>
        )}

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1 font-display text-xs uppercase tracking-widest text-gold">
            <Target className="h-3.5 w-3.5" /> Meilleur buteur
          </span>

          <div className="mt-6 flex items-end gap-3">
            <span className="font-display text-7xl leading-none text-gold">
              {scorer.goals}
            </span>
            <span className="mb-2 text-sm uppercase tracking-widest text-white/60">
              buts
              <br />
              cette saison
            </span>
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="font-display text-3xl uppercase leading-none text-white sm:text-4xl">
              {scorer.name}
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-white/70">
              {scorer.number != null && (
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gold font-display text-xs text-ink">
                  {scorer.number}
                </span>
              )}
              <span>
                {scorer.position} · {scorer.teamName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
