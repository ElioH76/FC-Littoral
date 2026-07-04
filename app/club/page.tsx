import type { Metadata } from "next";
import Image from "next/image";
import { Users } from "lucide-react";

import { club } from "@/data/club";
import { Reveal } from "@/components/ui/reveal";
import { PageHeader } from "@/components/sections/PageHeader";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { JoinCTA } from "@/components/sections/JoinCTA";

export const metadata: Metadata = {
  title: "Le club",
  description:
    "Histoire, valeurs, bureau et infos pratiques du F.C. Littoral, club de football amateur fondé en 2002.",
};

export default function ClubPage() {
  return (
    <>
      <PageHeader
        eyebrow="Depuis 2002"
        title="Le club"
        description="Une grande famille du football amateur, ancrée dans son territoire et fière de ses couleurs."
      />

      <div className="section-light">
      {/* Histoire */}
      <section className="section">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="Notre histoire" title="Plus de 20 ans de passion" />
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              {club.history.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {club.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-3xl text-forest">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal direction="left">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/teams/groupe-02-06-26.jpeg"
                alt="L'équipe du F.C. Littoral au grand complet"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Valeurs */}
      <section className="section bg-muted/40">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="Ce qui nous anime"
            title="Nos valeurs"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {club.values.map((value, i) => (
              <Reveal key={value.title} delay={i * 120}>
                <div className="h-full rounded-xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-gold/50 hover:shadow-md">
                  <div className="font-display text-4xl text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-3 text-lg text-forest">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {value.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Le bureau */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Les dirigeants"
            title="Le bureau"
            description="Les bénévoles qui font tourner le club au quotidien."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {club.bureau.map((member, i) => (
              <Reveal key={member.name} delay={(i % 3) * 100}>
                <div className="flex items-center gap-4 rounded-xl border bg-card p-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest text-white">
                    <Users className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="font-display uppercase tracking-tight text-ink">
                      {member.name}
                    </div>
                    <div className="text-sm text-forest">{member.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Infos pratiques */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {club.pratique.map((info) => (
              <div
                key={info.label}
                className="rounded-xl border border-dashed border-forest/40 bg-forest-50/50 p-5"
              >
                <div className="font-display text-xs uppercase tracking-widest text-forest">
                  {info.label}
                </div>
                <div className="mt-1 text-sm text-ink/80">{info.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      </div>

      {/* Contact / rejoindre */}
      <JoinCTA />
    </>
  );
}
