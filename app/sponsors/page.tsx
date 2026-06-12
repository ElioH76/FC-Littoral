import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink, Handshake, Star } from "lucide-react";

import { club } from "@/data/club";
import { getSponsors } from "@/lib/data";
import type { Sponsor } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { SponsorCard } from "@/components/cards/SponsorCard";

export const metadata: Metadata = {
  title: "Sponsors & partenaires",
  description:
    "Les partenaires qui soutiennent le F.C. Littoral. Découvrez les entreprises locales engagées aux côtés du club.",
};

export default async function SponsorsPage() {
  const sponsors = await getSponsors();
  const principal = sponsors.filter((s) => s.tier === "principal");
  const officiel = sponsors.filter((s) => s.tier === "officiel");
  const partenaire = sponsors.filter((s) => s.tier === "partenaire");

  return (
    <>
      <PageHeader
        eyebrow="Ils nous soutiennent"
        title="Sponsors & partenaires"
        description="Sans nos partenaires, rien ne serait possible. Merci aux entreprises qui font vivre le club et le football amateur sur notre territoire."
      />

      <div className="section-light">
      {/* Partenaire principal — bloc vedette */}
      {principal.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Partenaire principal"
              title="Notre soutien majeur"
            />
            <div className="mt-10 space-y-6">
              {principal.map((sponsor) => (
                <Reveal key={sponsor.id}>
                  <FeaturedSponsor sponsor={sponsor} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partenaires officiels */}
      {officiel.length > 0 && (
        <section className="section bg-muted/40">
          <div className="container">
            <SectionHeading
              eyebrow="Partenaires officiels"
              title="Engagés durablement à nos côtés"
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {officiel.map((sponsor, i) => (
                <Reveal key={sponsor.id} delay={i * 100}>
                  <SponsorCard sponsor={sponsor} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partenaires */}
      {partenaire.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Nos partenaires"
              title="Ils contribuent à faire vivre le club"
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {partenaire.map((sponsor, i) => (
                <Reveal key={sponsor.id} delay={i * 100}>
                  <SponsorCard sponsor={sponsor} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      </div>

      {/* Devenir partenaire */}
      <section className="bg-ink text-white">
        <div className="container section">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-forest-700 via-forest to-forest-700 p-8 md:p-14">
            <div className="absolute inset-0 bg-gold-grain opacity-60" aria-hidden />
            <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold text-ink">
                <Handshake className="h-7 w-7" />
              </span>
              <h2 className="mt-6 text-3xl text-white md:text-4xl">
                Devenez partenaire du club
              </h2>
              <p className="mt-4 text-white/80">
                Associez votre image à un club dynamique et ancré dans son
                territoire. Visibilité sur nos supports, au stade et sur nos
                réseaux : construisons ensemble un partenariat à votre mesure.
              </p>
              <Button asChild size="lg" className="mt-8">
                <a href={`mailto:${club.contact.email}`}>Nous contacter</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/** Bloc vedette pour le partenaire principal (pleine largeur). */
function FeaturedSponsor({ sponsor }: { sponsor: Sponsor }) {
  return (
    <div className="grid overflow-hidden rounded-2xl border bg-card shadow-sm md:grid-cols-2">
      <div className="flex items-center justify-center border-b bg-muted/40 p-10 md:border-b-0 md:border-r">
        <Image
          src={sponsor.logo}
          alt={`Logo ${sponsor.name}`}
          width={320}
          height={160}
          className="max-h-40 w-auto object-contain"
        />
      </div>
      <div className="flex flex-col justify-center p-8 md:p-10">
        <Badge className="w-fit gap-1">
          <Star className="h-3 w-3" /> Partenaire principal
        </Badge>
        <h3 className="mt-4 text-2xl md:text-3xl">{sponsor.name}</h3>
        <p className="mt-3 text-muted-foreground">{sponsor.description}</p>
        <Button asChild variant="forest" className="mt-6 w-fit">
          <a href={sponsor.website} target="_blank" rel="noopener noreferrer">
            Visiter le site
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
