import { cn } from "@/lib/utils";

/**
 * Pastille rouge « Reporté » affichée à la place du « VS » / du score quand la
 * FFF a reporté un match (cf. `Fixture.status`).
 */
export function PostponedPill({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "shrink-0 bg-red-600 font-display uppercase tracking-wide text-white",
        size === "sm" && "rounded-md px-2 py-1 text-[11px]",
        size === "md" && "rounded-lg px-3 py-1.5 text-sm md:text-base",
        size === "lg" && "rounded-xl px-4 py-2 text-xl md:text-2xl",
        className,
      )}
    >
      Reporté
    </span>
  );
}
