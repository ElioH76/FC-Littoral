import type { Metadata } from "next";

import { club } from "@/data/club";
import { getSeasonBoards } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/sections/PageHeader";
import { SeasonBoard } from "@/components/sections/SeasonBoard";

export const metadata: Metadata = {
  title: "Saison — Classements & calendriers",
  description:
    "Classements, calendriers et résultats de toutes les équipes du F.C. Littoral : U13, Seniors Après-Midi et Vétérans.",
};

export default async function SaisonPage() {
  const boards = await getSeasonBoards();

  return (
    <>
      <PageHeader
        eyebrow="Saison 2024 / 2025"
        title="Classements & calendriers"
        description="Toutes nos équipes réunies : sélectionne une équipe pour voir son classement, ses prochains matchs et ses derniers résultats."
      />

      {/* Bandeau d'information phase 2 */}
      <div className="border-b border-white/10 bg-ink-800">
        <div className="container flex flex-wrap items-center justify-center gap-3 py-3 text-center text-sm text-bone-dim">
          <Badge variant="forest" className="gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Bientôt en direct
          </Badge>
          <span>
            Données de démonstration — les classements et résultats seront
            prochainement synchronisés automatiquement.
          </span>
        </div>
      </div>

      <section className="section section-light">
        <div className="container">
          <SeasonBoard teams={boards} clubName={club.name} />
        </div>
      </section>
    </>
  );
}
