import Link from "next/link";

import { club } from "@/data/club";
import { getSeasonBoards } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { SeasonBoard } from "@/components/sections/SeasonBoard";

/**
 * Aperçu de la saison sur l'accueil : classement + calendrier, TOUTES les équipes
 * (onglets). Données de démonstration aujourd'hui ; PHASE 2 = API temps réel.
 */
export async function SeasonPreview() {
  const boards = await getSeasonBoards();

  return (
    <section className="section bg-muted/40">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Saison en cours"
            title="Classement & calendrier"
            description="Toutes nos équipes, classements et résultats au même endroit."
          />
          <Badge variant="forest" className="mb-2 gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
            Bientôt en direct
          </Badge>
        </div>

        <div className="mt-10">
          <SeasonBoard teams={boards} clubName={club.name} compact />
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="forest">
            <Link href="/saison">Voir la saison complète</Link>
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Données de démonstration · bientôt mises à jour automatiquement.
          </p>
        </div>
      </div>
    </section>
  );
}
