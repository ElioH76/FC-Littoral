import Link from "next/link";
import { CalendarDays, Trophy, MapPin } from "lucide-react";

import { club } from "@/data/club";
import { getSplitFixtures, getStandings } from "@/lib/data";
import type { Fixture } from "@/types";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/sections/SectionHeading";

/**
 * Aperçu de la saison : classement + calendrier.
 * Données de DÉMONSTRATION aujourd'hui (cf. data/standings.ts, data/fixtures.ts).
 * PHASE 2 : `getStandings()` / `getFixtures()` pointeront vers une API temps réel.
 */
export async function SeasonPreview() {
  const [standings, { results, upcoming }] = await Promise.all([
    getStandings(),
    getSplitFixtures(),
  ]);

  const top = standings.slice(0, 6);

  return (
    <section className="section bg-muted/40">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Saison en cours"
            title="Classement & calendrier"
            description="Suivez la progression de l'équipe fanion en championnat."
          />
          <Badge variant="forest" className="mb-2 gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
            Bientôt en direct
          </Badge>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          {/* Classement */}
          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm lg:col-span-3">
            <div className="flex items-center gap-2 border-b bg-ink px-5 py-4 text-white">
              <Trophy className="h-5 w-5 text-gold" />
              <h3 className="text-lg">Classement</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-2 py-3 font-medium">Équipe</th>
                  <th className="px-2 py-3 text-center font-medium">J</th>
                  <th className="hidden px-2 py-3 text-center font-medium sm:table-cell">
                    G
                  </th>
                  <th className="hidden px-2 py-3 text-center font-medium sm:table-cell">
                    N
                  </th>
                  <th className="hidden px-2 py-3 text-center font-medium sm:table-cell">
                    P
                  </th>
                  <th className="px-3 py-3 text-center font-medium">Pts</th>
                </tr>
              </thead>
              <tbody>
                {top.map((row) => {
                  const isClub = row.team === club.name;
                  return (
                    <tr
                      key={row.rank}
                      className={cn(
                        "border-b last:border-0 transition-colors",
                        isClub
                          ? "bg-gold/15 font-semibold"
                          : "hover:bg-muted/50",
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
                            <Badge className="hidden h-5 px-1.5 text-[10px] sm:inline-flex">
                              Nous
                            </Badge>
                          )}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-center text-muted-foreground">
                        {row.played}
                      </td>
                      <td className="hidden px-2 py-3 text-center sm:table-cell">
                        {row.won}
                      </td>
                      <td className="hidden px-2 py-3 text-center sm:table-cell">
                        {row.drawn}
                      </td>
                      <td className="hidden px-2 py-3 text-center sm:table-cell">
                        {row.lost}
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

          {/* Calendrier */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <div className="flex items-center gap-2 border-b bg-forest px-5 py-4 text-white">
                <CalendarDays className="h-5 w-5 text-gold" />
                <h3 className="text-lg">Prochains matchs</h3>
              </div>
              <ul className="divide-y">
                {upcoming.slice(0, 3).map((f) => (
                  <FixtureRow key={f.id} fixture={f} />
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <div className="border-b px-5 py-3">
                <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground">
                  Derniers résultats
                </h3>
              </div>
              <ul className="divide-y">
                {results.slice(0, 2).map((f) => (
                  <FixtureRow key={f.id} fixture={f} showScore />
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Données de démonstration · le classement et les résultats seront
          prochainement mis à jour automatiquement.{" "}
          <Link href="/#rejoindre" className="text-forest underline-offset-2 hover:underline">
            En savoir plus
          </Link>
        </p>
      </div>
    </section>
  );
}

function FixtureRow({
  fixture,
  showScore = false,
}: {
  fixture: Fixture;
  showScore?: boolean;
}) {
  const isClubHome = fixture.home === club.name;
  return (
    <li className="px-5 py-3">
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{fixture.competition}</span>
        <span>{formatDate(fixture.date)}</span>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span
          className={cn(
            "flex-1 truncate text-sm",
            isClubHome && "font-semibold text-ink",
          )}
        >
          {fixture.home}
        </span>
        {showScore ? (
          <span className="rounded-md bg-ink px-2 py-0.5 font-display text-sm text-white">
            {fixture.homeScore} – {fixture.awayScore}
          </span>
        ) : (
          <span className="font-display text-xs text-muted-foreground">VS</span>
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
        <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
          <MapPin className="h-3 w-3" /> {fixture.venue}
        </div>
      )}
    </li>
  );
}
