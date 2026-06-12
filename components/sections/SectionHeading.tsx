import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** Conservé pour compatibilité — la couleur s'adapte désormais au contexte. */
  light?: boolean;
  className?: string;
}

/** En-tête de section : eyebrow (tiret + label) + titre Archivo + description. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <span className={cn("eyebrow", align === "center" && "justify-center")}>
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 font-heading text-[clamp(2rem,5vw,3.4rem)] font-black uppercase leading-[1.02]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
