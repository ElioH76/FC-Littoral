import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, MapPin, Star, Target, Users } from "lucide-react";

import { club } from "@/data/club";
import {
  getSeasonBoard,
  getTeam,
  getTeamStats,
  getTeams,
  getTopScorer,
} from "@/lib/data";
import type { TeamSeason, TeamSlug } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { TeamTabs } from "@/components/sections/TeamTabs";
import { JoinCTA } from "@/components/sections/JoinCTA";

export const dynamicParams = false;

export async function generateStaticParams() {
  const teams = await getTeams();
  return teams.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const team = await getTeam(params.slug as TeamSlug);
  if (!team) return { title: "Équipe" };
  return {
    title: team.name,
    description: team.description,
    openGraph: {
      title: `${team.name} — ${club.name}`,
      description: team.description,
      images: [{ url: team.banner ?? team.image, alt: team.imageAlt }],
    },
  };
}

export default async function TeamPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug as TeamSlug;
  const team = await getTeam(slug);
  if (!team) notFound();

  const [stats, scorer, board] = await Promise.all([
    getTeamStats(slug),
    getTopScorer(slug),
    getSeasonBoard(slug),
  ]);

  const safeBoard: TeamSeason = board ?? {
    slug,
    name: team.name,
    standings: [],
    results: [],
    upcoming: [],
  };

  const keyStats = [
    { value: String(stats?.squad ?? 0), label: "Joueurs" },
    { value: String(team.staff.length), label: "Encadrants" },
    { value: String(stats?.goals ?? 0), label: "Buts marqués" },
    scorer
      ? { value: scorer.name.split(" ")[0], label: "Meilleur buteur" }
      : { value: "—", label: "Meilleur buteur" },
  ];

  return (
    <>
      {/* En-tête équipe — bannière = photo d'équipe (banner) si dispo, sinon image */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <Image
          src={team.banner ?? team.image}
          alt={team.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/50" />
        <div className="absolute inset-0 bg-gold-grain" aria-hidden />

        <div className="container relative py-14 md:py-20">
          <Link
            href="/equipes"
            className="inline-flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> Toutes les équipes
          </Link>

          <div className="mt-6">
            {team.flagship ? (
              <Badge className="gap-1">
                <Star className="h-3 w-3" /> Équipe fanion
              </Badge>
            ) : (
              <span className="font-display text-xs uppercase tracking-widest text-gold">
                {team.category}
              </span>
            )}
          </div>

          <h1 className="mt-3 text-4xl leading-[1.02] md:text-6xl">{team.name}</h1>
          <p className="mt-4 max-w-2xl text-white/80 md:text-lg">
            {team.description}
          </p>

          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-px sm:grid-cols-4">
            {keyStats.map((s) => (
              <div key={s.label} className="px-2">
                <div className="truncate font-display text-2xl text-gold md:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-white/60">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-light">
      {/* Détail en onglets (Classement · Calendrier · Stats · Effectif) */}
      <section className="section">
        <div className="container">
          <TeamTabs
            players={team.players ?? []}
            board={safeBoard}
            clubName={club.name}
            topScorerName={scorer?.name}
          />
        </div>
      </section>

      {/* Objectifs · Entraînements · Staff */}
      <section className="section bg-muted/40">
        <div className="container grid gap-6 lg:grid-cols-3">
          {team.objectives && team.objectives.length > 0 && (
            <Reveal className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg text-ink">
                <Target className="h-5 w-5 text-forest" /> Objectifs
              </h3>
              <ul className="mt-4 space-y-2">
                {team.objectives.map((o) => (
                  <li key={o} className="flex items-start gap-2 text-sm text-ink/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {o}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          <Reveal delay={100} className="rounded-2xl border bg-card p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg text-ink">
              <CalendarClock className="h-5 w-5 text-forest" /> Entraînements
            </h3>
            <ul className="mt-4 space-y-3">
              {team.trainings.map((t, i) => (
                <li key={i} className="text-sm">
                  <div className="font-medium text-ink">
                    {t.day} · {t.time}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {t.location}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={200} className="rounded-2xl border bg-card p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg text-ink">
              <Users className="h-5 w-5 text-forest" /> Le staff
            </h3>
            <ul className="mt-4 space-y-3">
              {team.staff.map((s) => (
                <li key={s.name} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest text-xs font-display text-white">
                    {s.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-ink">{s.name}</div>
                    <div className="text-xs text-forest">{s.role}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
      </div>

      <JoinCTA />
    </>
  );
}
