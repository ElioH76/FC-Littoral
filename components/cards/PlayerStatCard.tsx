import Image from "next/image";

/**
 * Grande carte « joueur vedette » (meilleur buteur / passeur…), avec photo
 * détourée, gros chiffre et infos joueur. Style repris de l'ancien module du
 * hero — réutilisée sur la page équipe.
 */

export interface StatCardPlayer {
  name: string;
  number?: number;
  position: string;
  photo?: string;
  /** Optionnel : nom de l'équipe (affiché après le poste). */
  teamName?: string;
}

export function PlayerStatCard({
  label,
  value,
  unit,
  player,
  emptyText,
}: {
  label: string;
  value: number;
  unit: string;
  player?: StatCardPlayer;
  emptyText?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-forest/25 to-ink-800/60 p-6 text-bone backdrop-blur">
      {player?.number != null && (
        <span
          className="pointer-events-none absolute -top-5 right-3 font-display text-[9rem] leading-none text-white/[0.06]"
          aria-hidden
        >
          {player.number}
        </span>
      )}

      <span className="font-heading text-[0.7rem] font-extrabold uppercase tracking-[0.22em] text-gold">
        {label}
      </span>

      {player ? (
        <>
          {player.photo && (
            <div className="-mx-6 -mb-2 mt-2 overflow-hidden">
              <Image
                src={player.photo}
                alt={`${player.name}, ${player.position}`}
                width={480}
                height={640}
                className="mx-auto h-auto w-full max-w-[420px] object-contain object-bottom drop-shadow-[0_20px_34px_rgba(0,0,0,0.55)] [mask-image:linear-gradient(to_bottom,#000_76%,transparent_99%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_76%,transparent_99%)]"
              />
            </div>
          )}

          <div className={player.photo ? "mt-1 flex items-baseline gap-2" : "mt-6 flex items-baseline gap-2"}>
            <b className="font-display text-5xl leading-none text-gold">{value}</b>
            <span className="font-heading text-sm font-bold uppercase tracking-wider text-bone-dim">
              {unit}
            </span>
          </div>
          <div className="mt-0.5 font-heading text-xl font-black uppercase">{player.name}</div>
          <div className="text-sm text-bone-dim">
            {player.number != null && `N°${player.number} · `}
            {player.position}
            {player.teamName ? ` · ${player.teamName}` : ""}
          </div>
        </>
      ) : (
        <p className="mt-6 text-sm text-bone-dim">
          {emptyText ?? "Pas encore de données — à saisir via les feuilles de match."}
        </p>
      )}
    </div>
  );
}
