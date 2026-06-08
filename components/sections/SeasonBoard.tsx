"use client";

import { useState } from "react";
import { CalendarDays, MapPin, PartyPopper, Trophy } from "lucide-react";

import type { Fixture, Standing, TeamSeason } from "@/types";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * Tableau de saison multi-équipes (onglets U15 / Seniors / Vétérans).
 * - `compact` : version réduite pour l'accueil (top 5 + quelques matchs).
 * - sinon : version complète pour la page /saison (avec ancres #classement / #calendrier).
 */
export function SeasonBoard({
  teams,
  clubName,
  compact = false,
}: {
  teams: TeamSeason[];
  clubName: string;
  compact?: boolean;
}) {
  const [active, setActive] = useState(0);
  if (teams.length === 0) return null;
  const team = teams[Math.min(active, teams.length - 1)];

  return (
    <div>
      {/* Onglets équipes (masqués s'il n'y a qu'une équipe) */}
      <div
        role="tablist"
        aria-label="Choisir une équipe"
        className={cn("flex flex-wrap gap-2", teams.length <= 1 && "hidden")}
      >
        {teams.map((t, i) => (
          <button
            key={t.slug}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn(
              "rounded-full border px-4 py-2 font-display text-sm uppercase tracking-wide transition-all",
              i === active
                ? "border-transparent bg-forest text-white shadow-sm"
                : "border-border bg-card text-ink/70 hover:border-gold hover:text-forest",
            )}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div
        className={cn(
          "mt-6 grid gap-6",
          compact ? "lg:grid-cols-5" : "lg:grid-cols-2",
        )}
      >
        {/* Classement */}
        <div
          id={compact ? undefined : "classement"}
          className={cn("scroll-mt-24", compact && "lg:col-span-3")}
        >
          {team.standings.length > 0 ? (
            <StandingsTable
              standings={team.standings}
              clubName={clubName}
              compact={compact}
            />
          ) : (
            <NoStandings note={team.noStandingsNote} />
          )}
        </div>

        {/* Calendrier & résultats */}
        <div
          id={compact ? undefined : "calendrier"}
          className={cn(
            "scroll-mt-24 flex flex-col gap-6",
            compact && "lg:col-span-2",
            !compact && "lg:grid lg:grid-cols-1",
          )}
        >
          <Panel
            icon={<CalendarDays className="h-5 w-5 text-gold" />}
            title="Prochains matchs"
            tone="forest"
          >
            {team.upcoming.length > 0 ? (
              (compact ? team.upcoming.slice(0, 3) : team.upcoming).map((f) => (
                <FixtureRow key={f.id} fixture={f} clubName={clubName} />
              ))
            ) : (
              <Empty>Aucun match à venir pour le moment.</Empty>
            )}
          </Panel>

          <Panel
            icon={<Trophy className="h-5 w-5 text-gold" />}
            title="Derniers résultats"
            tone="ink"
          >
            {team.results.length > 0 ? (
              (compact ? team.results.slice(0, 2) : team.results).map((f) => (
                <FixtureRow key={f.id} fixture={f} clubName={clubName} showScore />
              ))
            ) : (
              <Empty>Aucun résultat disponible.</Empty>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function StandingsTable({
  standings,
  clubName,
  compact,
}: {
  standings: Standing[];
  clubName: string;
  compact: boolean;
}) {
  const rows = compact ? standings.slice(0, 5) : standings;
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b bg-ink px-5 py-4 text-white">
        <Trophy className="h-5 w-5 text-gold" />
        <h3 className="text-lg">Classement</h3>
      </div>
      <div className="overflow-x-auto">
        <table className={cn("w-full text-sm", !compact && "min-w-[560px]")}>
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-2 py-3 font-medium">Équipe</th>
              <th className="px-2 py-3 text-center font-medium">J</th>
              {!compact && (
                <>
                  <th className="px-2 py-3 text-center font-medium">G</th>
                  <th className="px-2 py-3 text-center font-medium">N</th>
                  <th className="px-2 py-3 text-center font-medium">P</th>
                  <th className="px-2 py-3 text-center font-medium">BP</th>
                  <th className="px-2 py-3 text-center font-medium">BC</th>
                </>
              )}
              <th className="px-2 py-3 text-center font-medium">Diff</th>
              <th className="px-3 py-3 text-center font-medium">Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isClub = row.team === clubName;
              const diff = row.goalsFor - row.goalsAgainst;
              return (
                <tr
                  key={row.rank}
                  className={cn(
                    "border-b last:border-0 transition-colors",
                    isClub ? "bg-gold/15 font-semibold" : "hover:bg-muted/50",
                  )}
                >
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex h-6 w-6 items-center justify-center rounded-md text-xs",
                        row.rank <= 3
                          ? "bg-forest text-white"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {row.rank}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <span className="flex items-center gap-2">
                      {row.team}
                      {isClub && (
                        <Badge className="h-5 px-1.5 text-[10px]">Nous</Badge>
                      )}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-center text-muted-foreground">
                    {row.played}
                  </td>
                  {!compact && (
                    <>
                      <td className="px-2 py-3 text-center">{row.won}</td>
                      <td className="px-2 py-3 text-center">{row.drawn}</td>
                      <td className="px-2 py-3 text-center">{row.lost}</td>
                      <td className="px-2 py-3 text-center">{row.goalsFor}</td>
                      <td className="px-2 py-3 text-center">{row.goalsAgainst}</td>
                    </>
                  )}
                  <td
                    className={cn(
                      "px-2 py-3 text-center",
                      diff > 0
                        ? "text-forest"
                        : diff < 0
                          ? "text-red-600"
                          : "text-muted-foreground",
                    )}
                  >
                    {diff > 0 ? `+${diff}` : diff}
                  </td>
                  <td className="px-3 py-3 text-center font-display text-base">
                    {row.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NoStandings({ note }: { note?: string }) {
  return (
    <div className="flex h-full flex-col items-start gap-4 rounded-2xl border border-dashed border-forest/40 bg-forest-50/50 p-8">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest text-white">
        <PartyPopper className="h-6 w-6" />
      </span>
      <h3 className="text-2xl text-ink">Football plaisir</h3>
      <p className="max-w-sm text-muted-foreground">
        {note ??
          "Pas de classement officiel pour cette équipe — on joue avant tout pour le plaisir et la convivialité !"}
      </p>
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

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <li className="px-5 py-6 text-center text-sm text-muted-foreground">
      {children}
    </li>
  );
}

function FixtureRow({
  fixture,
  clubName,
  showScore = false,
}: {
  fixture: Fixture;
  clubName: string;
  showScore?: boolean;
}) {
  const isClubHome = fixture.home === clubName;
  return (
    <li className="px-5 py-4">
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{fixture.competition}</span>
        <span>{formatDate(fixture.date)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <span
          className={cn(
            "flex-1 truncate text-sm",
            isClubHome && "font-semibold text-ink",
          )}
        >
          {fixture.home}
        </span>
        {showScore ? (
          <span className="rounded-md bg-ink px-2.5 py-1 font-display text-sm text-white">
            {fixture.homeScore} – {fixture.awayScore}
          </span>
        ) : (
          <span className="rounded-md border px-2.5 py-1 font-display text-xs text-muted-foreground">
            VS
          </span>
        )}
        <span
          className={cn(
            "flex-1 truncate text-right text-sm",
            !isClubHome && "font-semibold text-ink",
          )}
        >
          {fixture.away}
        </span>
      </div>
      {fixture.venue && (
        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
          <MapPin className="h-3 w-3" /> {fixture.venue}
        </div>
      )}
    </li>
  );
}
