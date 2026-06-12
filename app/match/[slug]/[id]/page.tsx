import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, MapPin, Trophy } from "lucide-react";

import { club } from "@/data/club";
import { getAllFixtureRefs, getFixture, getTeam } from "@/lib/data";
import type { TeamSlug } from "@/types";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TeamCrest } from "@/components/match/TeamCrest";

export async function generateStaticParams() {
  const refs = await getAllFixtureRefs();
  return refs.map(({ slug, id }) => ({ slug, id }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; id: string };
}): Promise<Metadata> {
  const fixture = await getFixture(params.slug as TeamSlug, params.id);
  if (!fixture) return { title: "Match" };
  return {
    title: `${fixture.home} – ${fixture.away}`,
    description: `${fixture.competition} · ${formatDate(fixture.date)}`,
  };
}

export default async function MatchPage({
  params,
}: {
  params: { slug: string; id: string };
}) {
  const slug = params.slug as TeamSlug;
  const [team, fixture] = await Promise.all([
    getTeam(slug),
    getFixture(slug, params.id),
  ]);
  if (!fixture) notFound();

  const played = fixture.homeScore != null && fixture.awayScore != null;
  const homeUs = fixture.home === club.name;
  const awayUs = fixture.away === club.name;

  let result: { label: string; variant: "default" | "forest" | "dark" } | null =
    null;
  if (played && (homeUs || awayUs)) {
    const us = (homeUs ? fixture.homeScore : fixture.awayScore) as number;
    const them = (homeUs ? fixture.awayScore : fixture.homeScore) as number;
    result =
      us > them
        ? { label: "Victoire", variant: "default" }
        : us < them
          ? { label: "Défaite", variant: "dark" }
          : { label: "Match nul", variant: "forest" };
  }

  const details = [
    { icon: <Trophy className="h-5 w-5" />, label: "Compétition", value: fixture.competition },
    { icon: <CalendarDays className="h-5 w-5" />, label: "Date", value: formatDate(fixture.date) },
    ...(fixture.time
      ? [{ icon: <Clock className="h-5 w-5" />, label: "Coup d'envoi", value: fixture.time }]
      : []),
    ...(fixture.venue
      ? [{ icon: <MapPin className="h-5 w-5" />, label: "Lieu", value: fixture.venue }]
      : []),
  ];

  return (
    <>
      {/* Scoreboard */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 bg-gold-grain" aria-hidden />
        <div className="container relative py-10 md:py-14">
          <Link
            href={`/equipes/${slug}`}
            className="inline-flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> {team?.name ?? "Retour à l'équipe"}
          </Link>

          <p className="mt-6 text-center font-display text-xs uppercase tracking-widest text-gold">
            {fixture.competition}
          </p>

          {/* Équipes + score */}
          <div className="mx-auto mt-6 grid max-w-2xl grid-cols-[1fr_auto_1fr] items-start gap-3 md:gap-8">
            <TeamSide name={fixture.home} logo={fixture.homeLogo} highlight={homeUs} />

            <div className="flex flex-col items-center pt-3">
              {played ? (
                <div className="rounded-xl bg-white/10 px-4 py-2 font-display text-4xl tabular-nums md:text-5xl">
                  {fixture.homeScore}
                  <span className="mx-2 text-white/40">-</span>
                  {fixture.awayScore}
                </div>
              ) : (
                <div className="font-display text-3xl text-white/50 md:text-4xl">
                  VS
                </div>
              )}
              <div className="mt-3 text-center text-xs text-white/60">
                {formatDate(fixture.date)}
                {fixture.time ? ` · ${fixture.time}` : ""}
              </div>
            </div>

            <TeamSide name={fixture.away} logo={fixture.awayLogo} highlight={awayUs} />
          </div>

          {/* Statut / résultat */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <Badge variant={played ? "muted" : "forest"}>
              {played ? "Terminé" : "À venir"}
            </Badge>
            {result && <Badge variant={result.variant}>{result.label}</Badge>}
          </div>
        </div>
      </section>

      <div className="section-light">
      {/* Détails */}
      <section className="section">
        <div className="container max-w-3xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {details.map((d) => (
              <div
                key={d.label}
                className="flex items-start gap-3 rounded-xl border bg-card p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest text-white">
                  {d.icon}
                </span>
                <div>
                  <div className="font-display text-xs uppercase tracking-widest text-muted-foreground">
                    {d.label}
                  </div>
                  <div className="mt-0.5 text-ink">{d.value}</div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Compositions, buteurs et cartons ne sont pas diffusés publiquement
            par la FFF pour le football amateur.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="outline">
              <Link href={`/equipes/${slug}`}>
                <ArrowLeft className="h-4 w-4" /> Retour à l&apos;équipe
              </Link>
            </Button>
            <Button asChild variant="ghost" className="text-forest">
              <Link href="/saison">Toute la saison</Link>
            </Button>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}

function TeamSide({
  name,
  logo,
  highlight,
}: {
  name: string;
  logo?: string;
  highlight: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 p-2 md:h-20 md:w-20">
        <TeamCrest src={logo} name={name} size={56} />
      </span>
      <span
        className={cn(
          "font-display text-base uppercase leading-tight md:text-xl",
          highlight ? "text-gold" : "text-white",
        )}
      >
        {name}
      </span>
    </div>
  );
}
