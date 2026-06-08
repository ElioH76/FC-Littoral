import Image from "next/image";
import { Shield, Star } from "lucide-react";

import type { Player } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Carte d'un joueur pour l'effectif.
 * Affiche la photo si disponible, sinon un placeholder avec le numéro.
 */
export function PlayerCard({
  player,
  topScorer = false,
}: {
  player: Player;
  topScorer?: boolean;
}) {
  const goals = player.goals ?? 0;
  const initials = player.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg",
        topScorer && "ring-2 ring-gold",
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-forest-600 to-ink">
        {player.photo ? (
          <Image
            src={player.photo}
            alt={player.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center font-display text-white/15",
              player.number != null ? "text-8xl" : "text-6xl",
            )}
            aria-hidden
          >
            {player.number ?? initials}
          </span>
        )}

        {/* Numéro */}
        {player.number != null && (
          <span className="absolute left-2 top-2 inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-md bg-ink/80 px-1.5 font-display text-sm text-gold backdrop-blur">
            {player.number}
          </span>
        )}

        {/* Buts */}
        {goals > 0 && (
          <span className="absolute right-2 top-2 rounded-full bg-gold px-2 py-0.5 font-display text-xs text-ink shadow">
            {goals} {goals > 1 ? "buts" : "but"}
          </span>
        )}

        {/* Badges (capitaine / meilleur buteur) */}
        <div className="absolute bottom-2 left-2 flex flex-col items-start gap-1">
          {player.captain && (
            <span className="inline-flex items-center gap-1 rounded-full bg-forest px-2 py-0.5 font-display text-[10px] uppercase tracking-wider text-white shadow">
              <Shield className="h-3 w-3" /> Capitaine
            </span>
          )}
          {topScorer && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 font-display text-[10px] uppercase tracking-wider text-ink shadow">
              <Star className="h-3 w-3" /> Top buteur
            </span>
          )}
        </div>
      </div>

      <div className="p-3">
        <div className="truncate font-display text-base uppercase leading-tight text-ink">
          {player.name}
        </div>
        <div className="text-xs text-muted-foreground">{player.position}</div>
      </div>
    </div>
  );
}
