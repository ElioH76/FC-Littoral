import Image from "next/image";
import Link from "next/link";

import type { Sponsor } from "@/types";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";

/** Bandeau d'aperçu des sponsors pour la page d'accueil. */
export function SponsorStrip({ sponsors }: { sponsors: Sponsor[] }) {
  return (
    <section className="section bg-muted/40">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Ils nous soutiennent"
          title="Nos partenaires"
          description="Le F.C. Littoral remercie chaleureusement les entreprises locales qui rendent l'aventure possible."
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {sponsors.map((sponsor, i) => (
            <Reveal key={sponsor.id} delay={i * 80}>
              <a
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={sponsor.name}
                className="flex h-full items-center justify-center rounded-xl border bg-card p-6 grayscale transition-all hover:-translate-y-1 hover:grayscale-0 hover:shadow-md"
              >
                <Image
                  src={sponsor.logo}
                  alt={`Logo ${sponsor.name}`}
                  width={200}
                  height={100}
                  className="h-16 w-auto object-contain"
                />
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="forest">
            <Link href="/sponsors">Tous nos partenaires</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
