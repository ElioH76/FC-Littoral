import Image from "next/image";
import { ExternalLink } from "lucide-react";

import type { Sponsor } from "@/types";
import { Badge } from "@/components/ui/badge";

const tierLabel: Record<Sponsor["tier"], string> = {
  principal: "Partenaire principal",
  officiel: "Partenaire officiel",
  partenaire: "Partenaire",
};

export function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative flex aspect-[2/1] items-center justify-center border-b bg-muted/40 p-6">
        <Image
          src={sponsor.logo}
          alt={`Logo ${sponsor.name}`}
          width={220}
          height={110}
          className="max-h-full w-auto object-contain"
        />
        <Badge
          variant={sponsor.tier === "principal" ? "default" : "muted"}
          className="absolute left-3 top-3"
        >
          {tierLabel[sponsor.tier]}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg">{sponsor.name}</h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">
          {sponsor.description}
        </p>
        <a
          href={sponsor.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 font-display text-sm uppercase tracking-wide text-forest transition-colors hover:text-gold-600"
        >
          Visiter le site
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
