import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import type { Sponsor } from "@/types";
import { getSponsors } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/sections/SectionHeading";

/**
 * Carte partenaire. Tous les sponsors sont présentés à l'identique (pas de
 * hiérarchie visuelle) : logo en couleurs sur fond clair, nom, lien vers le site.
 */
export function PartnerCard({ sponsor }: { sponsor: Sponsor }) {
  const content = (
    <>
      <div className="flex aspect-[16/10] items-center justify-center p-8">
        <Image
          src={sponsor.logo}
          alt={`Logo ${sponsor.name}`}
          width={320}
          height={200}
          className={cn(
            "h-full max-h-36 w-auto object-contain transition-transform duration-300 group-hover:scale-105",
            // Logo vectoriel blanc/noir → passé en noir sur fond clair.
            !sponsor.rawLogo && "max-h-28 brightness-0",
          )}
        />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-ink/10 px-6 py-4">
        <div className="truncate font-heading text-base font-black uppercase tracking-wide text-ink">
          {sponsor.name}
        </div>
        {sponsor.website && (
          <ArrowUpRight className="h-5 w-5 shrink-0 text-ink/40 transition-colors group-hover:text-gold-600" />
        )}
      </div>
    </>
  );
  const card = cn(
    "group flex flex-col overflow-hidden rounded-2xl bg-bone shadow-lg ring-1 ring-ink/10 transition-all duration-300",
    sponsor.website && "hover:-translate-y-1 hover:shadow-gold",
  );
  return sponsor.website ? (
    <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className={card}>
      {content}
    </a>
  ) : (
    <div className={card}>{content}</div>
  );
}

/** Grille de cartes partenaires, toutes de même taille. */
export function PartnersGrid({ sponsors }: { sponsors: Sponsor[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {sponsors.map((sponsor) => (
        <PartnerCard key={sponsor.id} sponsor={sponsor} />
      ))}
    </div>
  );
}

/**
 * Bandeau « Nos partenaires » affiché en bas de toutes les pages (cf. layout).
 */
export async function PartnersSection() {
  const sponsors = await getSponsors();
  if (sponsors.length === 0) return null;

  return (
    <section className="section border-t border-white/10 bg-ink-800">
      <div className="container">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Ils nous soutiennent"
            title="Nos partenaires"
          />
          <Link
            href="/sponsors"
            className="group inline-flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wide text-gold hover:text-gold-bright"
          >
            Tous nos partenaires
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <PartnersGrid sponsors={sponsors} />
      </div>
    </section>
  );
}
