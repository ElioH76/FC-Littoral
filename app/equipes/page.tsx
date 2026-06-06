import type { Metadata } from "next";
import Link from "next/link";

import { getTeams } from "@/lib/data";
import { PageHeader } from "@/components/sections/PageHeader";
import { TeamDetail } from "@/components/sections/TeamDetail";
import { JoinCTA } from "@/components/sections/JoinCTA";

export const metadata: Metadata = {
  title: "Nos équipes",
  description:
    "Découvrez les 3 équipes du F.C. Littoral : U15, Seniors Après-Midi (équipe fanion) et Vétérans. Présentation, entraînements et encadrement.",
};

export default async function TeamsPage() {
  const teams = await getTeams();

  return (
    <>
      <PageHeader
        eyebrow="Le club sur le terrain"
        title="Nos équipes"
        description="Du plus jeune au plus expérimenté, trois équipes font vivre les couleurs or et vert du F.C. Littoral."
      />

      {/* Navigation rapide entre équipes */}
      <nav
        className="sticky top-16 z-30 border-b bg-background/95 backdrop-blur md:top-20"
        aria-label="Navigation entre les équipes"
      >
        <div className="container flex gap-2 overflow-x-auto py-3">
          {teams.map((team) => (
            <Link
              key={team.slug}
              href={`#${team.slug}`}
              className="whitespace-nowrap rounded-full border px-4 py-1.5 font-display text-sm uppercase tracking-wide text-ink/80 transition-colors hover:border-gold hover:text-forest"
            >
              {team.name}
            </Link>
          ))}
        </div>
      </nav>

      {teams.map((team, i) => (
        <TeamDetail key={team.slug} team={team} reverse={i % 2 === 1} />
      ))}

      <JoinCTA />
    </>
  );
}
