import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { getSponsors } from "@/lib/data";
import { cn } from "@/lib/utils";
import { sponsorTierLabel } from "@/components/cards/SponsorCard";
import { SectionHeading } from "@/components/sections/SectionHeading";

/**
 * Bandeau « Nos partenaires » affiché en bas de toutes les pages (cf. layout).
 * Grandes cartes claires : logo en couleurs, nom + statut, lien vers le site.
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sponsors.map((sponsor) => {
            const content = (
              <>
                {/* Logo en grand, en couleurs, sur fond clair */}
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
                  <div className="min-w-0">
                    <div className="truncate font-heading text-base font-black uppercase tracking-wide text-ink">
                      {sponsor.name}
                    </div>
                    <div className="mt-0.5 font-heading text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-forest-600">
                      {sponsorTierLabel[sponsor.tier]}
                    </div>
                  </div>
                  {sponsor.website && (
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-ink/40 transition-colors group-hover:text-gold-600" />
                  )}
                </div>
              </>
            );
            const card = cn(
              "group flex flex-col overflow-hidden rounded-2xl bg-bone shadow-lg ring-1 ring-white/10 transition-all duration-300",
              sponsor.tier === "equipementier" && "ring-2 ring-gold",
              sponsor.website && "hover:-translate-y-1 hover:shadow-gold",
            );
            return sponsor.website ? (
              <a
                key={sponsor.id}
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className={card}
              >
                {content}
              </a>
            ) : (
              <div key={sponsor.id} className={card}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
