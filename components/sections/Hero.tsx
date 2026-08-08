import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { club } from "@/data/club";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[clamp(600px,90vh,880px)] items-end overflow-hidden border-b border-white/10 bg-ink text-bone">
      {/* Image de fond */}
      <Image
        src="/images/photos/stade.jpeg"
        alt="Le stade du F.C. Littoral à Heuqueville au coucher du soleil"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Voiles cinématographiques */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,7,.55)_0%,rgba(7,10,7,.15)_35%,rgba(7,10,7,.85)_88%,#070A07_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,10,7,.85)_0%,rgba(7,10,7,.1)_55%)]" />

      <div className="container relative z-10 py-12 md:py-16 lg:py-20">
        {/* Colonne texte */}
        <div className="max-w-2xl">
          <span className="eyebrow mb-5">{club.slogan}</span>
          <h1 className="display text-[clamp(3rem,10vw,7.5rem)] leading-[0.92]">
            F.C. Littoral
            <span className="block text-gold">{club.subSlogan}</span>
          </h1>
          <p className="mt-6 max-w-lg text-base text-bone-dim md:text-lg">
            Club de football amateur fondé en {club.founded}. Des U13 aux
            Seniors, nous faisons vivre la passion du ballon rond au cœur de
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
      </div>
    </section>
  );
}
