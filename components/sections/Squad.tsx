"use client";

import { useState } from "react";

import type { Player } from "@/types";
import { cn } from "@/lib/utils";
import { PlayerCard } from "@/components/cards/PlayerCard";
import { Reveal } from "@/components/ui/reveal";

/** Catégories de postes, dans l'ordre d'affichage. */
const GROUPS: { label: string; match: (pos: string) => boolean }[] = [
  { label: "Gardiens", match: (p) => /gardien/i.test(p) },
  {
    label: "Défenseurs",
    match: (p) =>
      /(défenseur|defenseur|latéral|lateral|piston|arrière|arriere)/i.test(p),
  },
  { label: "Milieux", match: (p) => /milieu/i.test(p) },
  {
    label: "Attaquants",
    match: (p) => /(ailier|attaquant|buteur|avant)/i.test(p),
  },
];

const byNumber = (a: Player, b: Player) => (a.number ?? 99) - (b.number ?? 99);

export function Squad({
  players,
  topScorerName,
}: {
  players: Player[];
  topScorerName?: string;
}) {
  // Répartition par poste (sans doublon), groupes non vides uniquement.
  const used = new Set<string>();
  const groups = GROUPS.map((g) => {
    const list = players
      .filter((p) => !used.has(p.name) && g.match(p.position))
      .sort(byNumber);
    list.forEach((p) => used.add(p.name));
    return { label: g.label, list };
  }).filter((g) => g.list.length > 0);

  const rest = players.filter((p) => !used.has(p.name)).sort(byNumber);
  if (rest.length) groups.push({ label: "Autres", list: rest });

  const [active, setActive] = useState(0);
  if (groups.length === 0) return null;
  const current = groups[Math.min(active, groups.length - 1)];

  return (
    <div>
      {/* Sous-onglets par poste */}
      <div
        role="tablist"
        aria-label="Filtrer par poste"
        className="flex flex-wrap gap-x-5 gap-y-1"
      >
        {groups.map((g, i) => (
          <button
            key={g.label}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn(
              "inline-flex items-center gap-2 border-b-2 py-2 font-display text-sm uppercase tracking-wide transition-colors",
              i === active
                ? "border-gold text-forest"
                : "border-transparent text-ink/50 hover:text-ink",
            )}
          >
            {g.label}
            <span
              className={cn(
                "rounded-full px-1.5 text-xs",
                i === active
                  ? "bg-forest text-white"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {g.list.length}
            </span>
          </button>
        ))}
      </div>

      {/* Cartes du poste sélectionné */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {current.list.map((p, i) => (
          <Reveal key={`${current.label}-${p.name}`} delay={(i % 5) * 60}>
            <PlayerCard player={p} topScorer={p.name === topScorerName} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
