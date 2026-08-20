import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, Goal, Handshake, MapPin, Trophy, Users } from "lucide-react";

import { club } from "@/data/club";
import { getFixture, getTeam } from "@/lib/data";
import { getMatchStat } from "@/lib/match-stats-store";
import { MATCH_TYPE_META, resolveMatchType } from "@/lib/match-type";
import type { TeamSlug } from "@/types";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TeamCrest } from "@/components/match/TeamCrest";

// Rendu à chaque requête : reflète immédiatement les matchs manuels ajoutés
// en admin et les feuilles de match (buteurs) saisies. Params inconnus → notFound().
export const dynamic = "force-dynamic";

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
  const [team, fixture, sheet] = await Promise.all([
    getTeam(slug),
    getFixture(slug, params.id),
    getMatchStat(params.id),
  ]);
  if (!fixture) notFound();

  const scorers = (sheet?.players ?? [])
    .filter((p) => p.goals > 0)
    .sort((a, b) => b.goals - a.goals);
  const assisters = (sheet?.players ?? [])
    .filter((p) => p.assists > 0)
    .sort((a, b) => b.assists - a.assists);
  const lineup = sheet?.players ?? [];
  const hasSheet = lineup.length > 0;

  const played = fixture.homeScore != null && fixture.awayScore != null;
  const homeUs = fixture.home === club.name;
  const awayUs = fixture.away === club.name;

  const matchType = resolveMatchType(fixture);
  const typeVariant = (
    { championnat: "forest", coupe: "default", amical: "muted" } as const
  )[matchType];

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
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <Badge variant={typeVariant}>{MATCH_TYPE_META[matchType].label}</Badge>
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

          {hasSheet ? (
            <div className="mt-8">
              <h2 className="mb-5 flex items-center gap-2 font-display text-lg uppercase tracking-wide text-ink">
                <Goal className="h-5 w-5 text-forest" /> Feuille de match
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <StatColumn
                  icon={<Goal className="h-4 w-4" />}
                  title="Buteurs"
                  rows={scorers.map((p) => ({ name: p.name, count: p.goals }))}
                  empty="Aucun buteur enregistré."
                />
                <StatColumn
                  icon={<Handshake className="h-4 w-4" />}
                  title="Passes décisives"
                  rows={assisters.map((p) => ({ name: p.name, count: p.assists }))}
                  empty="Aucune passe décisive enregistrée."
                />
              </div>

              {lineup.length > 0 && (
                <div className="mt-4 rounded-xl border bg-card p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-display text-xs uppercase tracking-widest text-muted-foreground">
                    <Users className="h-4 w-4 text-forest" /> Ont joué ({lineup.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {lineup.map((p) => (
                      <span
                        key={p.name}
                        className="rounded-full border bg-muted/40 px-3 py-1 text-xs text-ink"
                      >
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Buteurs et passeurs seront ajoutés prochainement (la FFF ne les
              diffuse pas pour le football amateur).
            </p>
          )}

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

function StatColumn({
  icon,
  title,
  rows,
  empty,
}: {
  icon: React.ReactNode;
  title: string;
  rows: { name: string; count: number }[];
  empty: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="flex items-center gap-2 font-display text-xs uppercase tracking-widest text-muted-foreground">
        <span className="text-forest">{icon}</span> {title}
      </h3>
      {rows.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {rows.map((r) => (
            <li key={r.name} className="flex items-center justify-between gap-2 text-sm">
              <span className="text-ink">{r.name}</span>
              {r.count > 1 && (
                <span className="rounded-md bg-forest/10 px-2 py-0.5 font-display text-xs text-forest">
                  ×{r.count}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">{empty}</p>
      )}
    </div>
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
