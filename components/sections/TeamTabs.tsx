"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ListOrdered,
  MapPin,
  PartyPopper,
  Target,
  Trophy,
  Users,
} from "lucide-react";

import type { Fixture, Player, Standing, TeamSeason, TeamSlug } from "@/types";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Squad } from "@/components/sections/Squad";
import { TeamCrest } from "@/components/match/TeamCrest";

type TabKey = "effectif" | "classement" | "calendrier" | "stats";

export function TeamTabs({
  players,
  board,
  clubName,
  topScorerName,
}: {
  players: Player[];
  board: TeamSeason;
  clubName: string;
  topScorerName?: string;
}) {
  const [tab, setTab] = useState<TabKey>("classement");

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "classement", label: "Classement", icon: <ListOrdered className="h-4 w-4" /> },
    { key: "calendrier", label: "Calendrier", icon: <CalendarDays className="h-4 w-4" /> },
    { key: "stats", label: "Stats", icon: <Target className="h-4 w-4" /> },
    { key: "effectif", label: "Effectif", icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div>
      {/* Onglets */}
      <div
        role="tablist"
        aria-label="Sections de l'équipe"
        className="flex flex-wrap gap-2 border-b pb-4"
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 font-display text-sm uppercase tracking-wide transition-all",
              tab === t.key
                ? "border-transparent bg-forest text-white shadow-sm"
                : "border-border bg-card text-ink/70 hover:border-gold hover:text-forest",
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "effectif" &&
          (players.length > 0 ? (
            <Squad players={players} topScorerName={topScorerName} />
          ) : (
            <EmptyInfo />
          ))}
        {tab === "classement" && (
          <StandingsTable standings={board.standings} clubName={clubName} note={board.noStandingsNote} />
        )}
        {tab === "calendrier" && (
          <FixturesGrid
            results={board.results}
            upcoming={board.upcoming}
            clubName={clubName}
            slug={board.slug}
          />
        )}
        {tab === "stats" && (
          <StatsPanel players={players} board={board} clubName={clubName} />
        )}
      </div>
    </div>
  );
}

/* ----------------------------- Classement ----------------------------- */

function StandingsTable({
  standings,
  clubName,
  note,
}: {
  standings: Standing[];
  clubName: string;
  note?: string;
}) {
  if (standings.length === 0) return <LoisirNote note={note} />;
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b bg-ink px-5 py-4 text-white">
        <Trophy className="h-5 w-5 text-gold" />
        <h3 className="text-lg">Classement</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-2 py-3 font-medium">Équipe</th>
              <th className="px-2 py-3 text-center font-medium">J</th>
              <th className="px-2 py-3 text-center font-medium">G</th>
              <th className="px-2 py-3 text-center font-medium">N</th>
              <th className="px-2 py-3 text-center font-medium">P</th>
              <th className="px-2 py-3 text-center font-medium">Diff</th>
              <th className="px-3 py-3 text-center font-medium">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row) => {
              const isClub = row.team === clubName;
              const diff = row.goalsFor - row.goalsAgainst;
              return (
                <tr
                  key={row.rank}
                  className={cn(
                    "border-b last:border-0",
                    isClub ? "bg-gold/15 font-semibold" : "hover:bg-muted/50",
                  )}
                >
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex h-6 w-6 items-center justify-center rounded-md text-xs",
                        row.rank <= 3 ? "bg-forest text-white" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {row.rank}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <span className="flex items-center gap-2">
                      {row.team}
                      {isClub && <Badge className="h-5 px-1.5 text-[10px]">Nous</Badge>}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-center text-muted-foreground">{row.played}</td>
                  <td className="px-2 py-3 text-center">{row.won}</td>
                  <td className="px-2 py-3 text-center">{row.drawn}</td>
                  <td className="px-2 py-3 text-center">{row.lost}</td>
                  <td
                    className={cn(
                      "px-2 py-3 text-center",
                      diff > 0 ? "text-forest" : diff < 0 ? "text-red-600" : "text-muted-foreground",
                    )}
                  >
                    {diff > 0 ? `+${diff}` : diff}
                  </td>
                  <td className="px-3 py-3 text-center font-display text-base">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ----------------------------- Calendrier ----------------------------- */

function FixturesGrid({
  results,
  upcoming,
  clubName,
  slug,
}: {
  results: Fixture[];
  upcoming: Fixture[];
  clubName: string;
  slug: TeamSlug;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel icon={<CalendarDays className="h-5 w-5 text-gold" />} title="Prochains matchs" tone="forest">
        {upcoming.length > 0 ? (
          upcoming.map((f) => <FixtureRow key={f.id} fixture={f} slug={slug} clubName={clubName} />)
        ) : (
          <Empty>Aucun match à venir.</Empty>
        )}
      </Panel>
      <Panel icon={<Trophy className="h-5 w-5 text-gold" />} title="Derniers résultats" tone="ink">
        {results.length > 0 ? (
          results.map((f) => <FixtureRow key={f.id} fixture={f} slug={slug} clubName={clubName} showScore />)
        ) : (
          <Empty>Aucun résultat disponible.</Empty>
        )}
      </Panel>
    </div>
  );
}

function Panel({
  icon,
  title,
  tone,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  tone: "forest" | "ink";
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div
        className={cn(
          "flex items-center gap-2 border-b px-5 py-4 text-white",
          tone === "forest" ? "bg-forest" : "bg-ink",
        )}
      >
        {icon}
        <h3 className="text-lg">{title}</h3>
      </div>
      <ul className="divide-y">{children}</ul>
    </div>
  );
}

function FixtureRow({
  fixture,
  slug,
  clubName,
  showScore = false,
}: {
  fixture: Fixture;
  slug: TeamSlug;
  clubName: string;
  showScore?: boolean;
}) {
  const isClubHome = fixture.home === clubName;
  return (
    <li>
      <Link
        href={`/match/${slug}/${fixture.id}`}
        className="block px-5 py-4 transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{fixture.competition}</span>
          <span>{formatDate(fixture.date)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className={cn("flex min-w-0 flex-1 items-center gap-2 text-sm", isClubHome && "font-semibold text-ink")}>
            <TeamCrest src={fixture.homeLogo} name={fixture.home} size={22} className="shrink-0" />
            <span className="truncate">{fixture.home}</span>
          </span>
          {showScore ? (
            <span className="shrink-0 rounded-md bg-ink px-2.5 py-1 font-display text-sm text-white">
              {fixture.homeScore} – {fixture.awayScore}
            </span>
          ) : (
            <span className="shrink-0 rounded-md border px-2.5 py-1 font-display text-xs text-muted-foreground">VS</span>
          )}
          <span className={cn("flex min-w-0 flex-1 items-center justify-end gap-2 text-right text-sm", !isClubHome && "font-semibold text-ink")}>
            <span className="truncate">{fixture.away}</span>
            <TeamCrest src={fixture.awayLogo} name={fixture.away} size={22} className="shrink-0" />
          </span>
        </div>
        {fixture.venue && (
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
            <MapPin className="h-3 w-3" /> {fixture.venue}
          </div>
        )}
      </Link>
    </li>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <li className="px-5 py-6 text-center text-sm text-muted-foreground">{children}</li>;
}

/** Affiché dans l'onglet Effectif quand aucun joueur n'est renseigné. */
function EmptyInfo() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-dashed border-forest/40 bg-muted/40 p-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest text-white">
        <Users className="h-7 w-7" />
      </span>
      <h3 className="mt-5 text-xl text-ink">Pas d&apos;infos pour le moment</h3>
      <p className="mt-2 text-muted-foreground">
        L&apos;effectif de cette équipe n&apos;est pas encore renseigné. Reviens
        vite&nbsp;!
      </p>
    </div>
  );
}

function LoisirNote({ note }: { note?: string }) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl border border-dashed border-forest/40 bg-forest-50/50 p-8">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest text-white">
        <PartyPopper className="h-6 w-6" />
      </span>
      <h3 className="text-2xl text-ink">Football plaisir</h3>
      <p className="max-w-md text-muted-foreground">
        {note ?? "Pas de classement officiel pour cette équipe — on joue avant tout pour le plaisir et la convivialité !"}
      </p>
    </div>
  );
}

/* ------------------------------- Stats -------------------------------- */

function StatsPanel({
  players,
  board,
  clubName,
}: {
  players: Player[];
  board: TeamSeason;
  clubName: string;
}) {
  const totalGoals = players.reduce((s, p) => s + (p.goals ?? 0), 0);
  const scorers = players
    .filter((p) => (p.goals ?? 0) > 0)
    .sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0));
  const topGoals = scorers[0]?.goals ?? 0;
  const me = board.standings.find((r) => r.team === clubName);

  const cards = [
    { value: String(players.length), label: "Joueurs" },
    { value: String(totalGoals), label: "Buts marqués" },
    { value: scorers.length ? String(scorers.length) : "—", label: "Buteurs" },
    me
      ? { value: `${me.rank}ᵉ`, label: "Au classement" }
      : { value: "—", label: "Au classement" },
  ];

  return (
    <div className="space-y-8">
      {/* Cartes chiffres */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border bg-card p-5 text-center shadow-sm">
            <div className="font-display text-3xl text-forest">{c.value}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              {c.label}
            </div>
          </div>
        ))}
      </div>

      {/* Top buteurs */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg text-ink">
          <Target className="h-5 w-5 text-forest" /> Meilleurs buteurs
        </h3>
        {scorers.length > 0 ? (
          <ul className="mt-5 space-y-3">
            {scorers.slice(0, 6).map((p, i) => (
              <li key={p.name} className="flex items-center gap-3">
                <span className="w-5 text-center font-display text-sm text-muted-foreground">
                  {i + 1}
                </span>
                <span className="w-40 shrink-0 truncate text-sm font-medium text-ink">
                  {p.name}
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${topGoals ? ((p.goals ?? 0) / topGoals) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-14 text-right font-display text-sm text-forest">
                  {p.goals} {p.goals === 1 ? "but" : "buts"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Pas encore de buteur enregistré cette saison.
          </p>
        )}
      </div>
    </div>
  );
}
