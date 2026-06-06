import Image from "next/image";
import Link from "next/link";

import { club } from "@/data/club";
import { Button } from "@/components/ui/button";

export function Hero() {
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

      <div className="container relative flex min-h-[88vh] flex-col justify-center py-20">
        <div className="max-w-3xl">
          <span className="reveal eyebrow text-gold">
            <span className="gold-rule !w-8" aria-hidden />
            {club.slogan} !
          </span>

          <h1 className="reveal mt-4 text-5xl leading-[0.92] sm:text-6xl md:text-7xl lg:text-8xl">
            F.C. <span className="text-gold">Littoral</span>
            <span className="mt-2 block font-script text-3xl normal-case tracking-normal text-white/90 sm:text-4xl">
              {club.subSlogan}
            </span>
          </h1>

          <p className="reveal mt-6 max-w-xl text-base text-white/80 md:text-lg">
            Club de football amateur fondé en {club.founded}. Du U15 aux
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
