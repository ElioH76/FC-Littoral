import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

import type { Team } from "@/types";
import { Badge } from "@/components/ui/badge";

export function TeamCard({ team }: { team: Team }) {
  return (
    <Link
      href={`/equipes#${team.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={team.image}
          alt={team.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
        {team.flagship && (
          <Badge className="absolute left-3 top-3 gap-1">
            <Star className="h-3 w-3" /> Équipe fanion
          </Badge>
        )}
        <div className="absolute bottom-0 left-0 p-5">
          <p className="font-display text-xs uppercase tracking-widest text-gold">
            {team.category}
          </p>
          <h3 className="text-2xl text-white">{team.name}</h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex-1 text-sm text-muted-foreground">{team.highlight}</p>
        <span className="mt-4 inline-flex items-center gap-1 font-display text-sm uppercase tracking-wide text-forest transition-colors group-hover:text-gold-600">
          Découvrir l&apos;équipe
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
