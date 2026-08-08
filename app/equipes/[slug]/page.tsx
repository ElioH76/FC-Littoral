import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, MapPin, Star, Target, Users } from "lucide-react";

import { club } from "@/data/club";
import { getSeasonBoard, getTeam, getTeamStatsBundle } from "@/lib/data";
import type { TeamSeason, TeamSlug } from "@/types";
import { Badge } from "@/components/ui/badge";
import { PlayerStatCard } from "@/components/cards/PlayerStatCard";
import { Reveal } from "@/components/ui/reveal";
import { TeamTabs } from "@/components/sections/TeamTabs";
import { JoinCTA } from "@/components/sections/JoinCTA";

// Rendu à chaque requête : reflète immédiatement les matchs/stats saisis en
// admin (matchs manuels, feuilles de match). Les slugs inconnus → notFound().
export const dynamic = "force-dynamic";

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
  const [bundle, board] = await Promise.all([
    getTeamStatsBundle(slug),
    getSeasonBoard(slug),
  ]);
  const team = bundle.team;
  if (!team) notFound();

  const players = bundle.players;
  const totalGoals = players.reduce((sum, p) => sum + (p.goals ?? 0), 0);
  const scorer = players
    .filter((p) => (p.goals ?? 0) > 0)
    .sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0))[0];

  // Meilleur buteur / passeur du CHAMPIONNAT uniquement (cartes joueur).
  const playerByName = new Map(players.map((p) => [p.name, p]));
  const topChampionnat = (kind: "goals" | "assists") => {
    const best = bundle.seasonStats
      .map((s) => ({ name: s.name, v: s.byType.championnat[kind] }))
      .filter((x) => x.v > 0)
      .sort((a, b) => b.v - a.v)[0];
    if (!best) return undefined;
    const player = playerByName.get(best.name);
    return player ? { player, value: best.v } : undefined;
  };
  const topScorerChamp = topChampionnat("goals");
  const topAssisterChamp = topChampionnat("assists");

  const safeBoard: TeamSeason = board ?? {
    slug,
    name: team.name,
    standings: [],
    results: [],
    upcoming: [],
  };

  const keyStats = [
    { value: String(players.length), label: "Joueurs" },
    { value: String(team.staff.length), label: "Encadrants" },
    { value: String(totalGoals), label: "Buts marqués" },
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

          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-end">
            {/* Colonne texte */}
            <div>
              <div>
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
              <p className="mt-4 max-w-xl text-white/80 md:text-lg">
                {team.description}
              </p>

              <div className="mt-10 grid max-w-sm grid-cols-3 gap-x-6">
                {keyStats.map((s) => (
                  <div key={s.label} className="min-w-0">
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

            {/* Colonne cartes : meilleur buteur & passeur (championnat) */}
            <div className="grid gap-4 sm:grid-cols-2">
              <PlayerStatCard
                label="Meilleur buteur"
                unit={(topScorerChamp?.value ?? 0) > 1 ? "buts" : "but"}
                value={topScorerChamp?.value ?? 0}
                player={topScorerChamp?.player}
                emptyText="Aucun buteur en championnat pour le moment."
              />
              <PlayerStatCard
                label="Meilleur passeur"
                unit={(topAssisterChamp?.value ?? 0) > 1 ? "passes" : "passe"}
                value={topAssisterChamp?.value ?? 0}
                player={topAssisterChamp?.player}
                emptyText="Aucun passeur en championnat pour le moment."
              />
            </div>
          </div>
        </div>
      </section>

      <div className="section-light">
      {/* Détail en onglets (Classement · Calendrier · Stats · Effectif) */}
      <section className="section">
        <div className="container">
          <TeamTabs
            players={players}
            board={safeBoard}
            clubName={club.name}
            topScorerName={scorer?.name}
            seasonStats={bundle.seasonStats}
            hasMatchData={bundle.hasMatchData}
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
