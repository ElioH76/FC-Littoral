import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

import type { Team } from "@/types";

export function TeamCard({ team }: { team: Team }) {
  return (
    <Link
      href={`/equipes#${team.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-800 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={team.image}
          alt={team.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        {team.flagship && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-md bg-gold px-3 py-1 font-heading text-[0.66rem] font-extrabold uppercase tracking-wider text-ink">
            <Star className="h-3 w-3" /> Équipe fanion
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="font-heading text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-gold">
            {team.category}
          </p>
          <h3 className="mt-1 font-heading text-2xl font-black uppercase text-bone">
            {team.name}
          </h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex-1 text-sm text-bone-dim">{team.highlight}</p>
        <span className="mt-4 inline-flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wide text-bone transition-colors group-hover:text-gold-bright">
          Découvrir l&apos;équipe
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
