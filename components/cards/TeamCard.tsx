import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

import type { Team } from "@/types";

export function TeamCard({ team }: { team: Team }) {
  return (
    <Link
      href={`/equipes#${team.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={team.image}
          alt={team.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        {team.flagship && (
          <span className="clip-tag absolute left-0 top-4 inline-flex items-center gap-1.5 bg-gold px-4 py-1 font-display text-xs uppercase tracking-wider text-ink shadow-md">
            <Star className="h-3 w-3" /> Équipe fanion
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="font-display text-xs uppercase tracking-[0.25em] text-gold">
            {team.category}
          </p>
          <h3 className="mt-1 text-2xl text-white transition-transform duration-300 group-hover:translate-x-1">
            {team.name}
          </h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex-1 text-sm text-muted-foreground">{team.highlight}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 font-display text-sm uppercase tracking-wide text-forest transition-colors group-hover:text-gold-600">
          Découvrir l&apos;équipe
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
      <span className="accent-bar" aria-hidden />
    </Link>
  );
}
