import type { Fixture } from "@/types";
import { cn } from "@/lib/utils";
import { MATCH_TYPE_META, resolveMatchType } from "@/lib/match-type";

/**
 * Pastille colorée indiquant le type de match (championnat / coupe / amical).
 * Le type est déduit du libellé de compétition quand la FFF ne le fournit pas.
 */
export function MatchTypeBadge({
  fixture,
  size = "md",
  className,
}: {
  fixture: Pick<Fixture, "competition" | "type">;
  size?: "sm" | "md";
  className?: string;
}) {
  const meta = MATCH_TYPE_META[resolveMatchType(fixture)];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-display uppercase tracking-wider",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        meta.badge,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} aria-hidden />
      {meta.label}
    </span>
  );
}
