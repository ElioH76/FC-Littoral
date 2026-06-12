import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { club } from "@/data/club";
import { getTopScorer } from "@/lib/data";
import { Button } from "@/components/ui/button";

export async function Hero() {
  const scorer = await getTopScorer();

  return (
    <section className="relative isolate flex min-h-[clamp(600px,90vh,880px)] items-end overflow-hidden border-b border-white/10 bg-ink text-bone">
      {/* Image de fond */}
      <Image
        src="/images/hero.jpg"
        alt="Stade de football au coucher du soleil"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Voiles cinématographiques */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,7,.55)_0%,rgba(7,10,7,.15)_35%,rgba(7,10,7,.85)_88%,#070A07_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,10,7,.85)_0%,rgba(7,10,7,.1)_55%)]" />

      <div className="container relative z-10 grid items-end gap-10 py-12 md:py-16 lg:grid-cols-[1.25fr_.9fr] lg:py-20">
        {/* Colonne texte */}
        <div className="max-w-2xl">
          <span className="eyebrow mb-5">{club.slogan}</span>
          <h1 className="display text-[clamp(3rem,10vw,7.5rem)] leading-[0.92]">
            F.C. Littoral
            <span className="block text-gold">{club.subSlogan}</span>
          </h1>
          <p className="mt-6 max-w-lg text-base text-bone-dim md:text-lg">
            Club de football amateur fondé en {club.founded}. Du U13 aux
            Vétérans, nous faisons vivre la passion du ballon rond au cœur de
            notre territoire.
          </p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <Button asChild size="lg">
              <Link href="/#rejoindre" className="group">
                Rejoindre le club
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/equipes" className="group">
                Découvrir nos équipes
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Module joueur vedette */}
        {scorer && (
          <aside className="reveal relative w-[min(360px,100%)] justify-self-start overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-forest/25 to-ink-800/60 p-6 backdrop-blur lg:justify-self-end">
            {scorer.number != null && (
              <span
                className="pointer-events-none absolute -top-5 right-3 font-display text-[9rem] leading-none text-white/[0.06]"
                aria-hidden
              >
                {scorer.number}
              </span>
            )}
            <span className="font-heading text-[0.7rem] font-extrabold uppercase tracking-[0.22em] text-gold">
              Meilleur buteur
            </span>

            {scorer.photo && (
              <div className="mt-1.5 flex h-[230px] items-end justify-center">
                <Image
                  src={scorer.photo}
                  alt={`${scorer.name}, ${scorer.position}`}
                  width={300}
                  height={360}
                  priority
                  className="h-full w-auto object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.5)]"
                />
              </div>
            )}

            <div className="mt-1 flex items-baseline gap-2">
              <b className="font-display text-5xl leading-none text-gold">
                {scorer.goals}
              </b>
              <span className="font-heading text-sm font-bold uppercase tracking-wider text-bone-dim">
                buts
              </span>
            </div>
            <div className="mt-0.5 font-heading text-xl font-black uppercase">
              {scorer.name}
            </div>
            <div className="text-sm text-bone-dim">
              {scorer.number != null && `N°${scorer.number} · `}
              {scorer.position} · {scorer.teamName}
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
