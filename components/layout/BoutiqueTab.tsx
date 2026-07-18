"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";

/**
 * Languette « Boutique » fixée au bord droit de la fenêtre, visible sur
 * toutes les pages (sauf la boutique elle-même et l'admin).
 */
export function BoutiqueTab() {
  const pathname = usePathname();
  if (pathname?.startsWith("/boutique") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <Link
      href="/boutique"
      aria-label="Accéder à la boutique du club"
      className="group fixed right-0 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-2.5 rounded-l-2xl border border-r-0 border-gold/40 bg-forest py-4 pl-3 pr-2.5 text-bone shadow-xl shadow-black/40 transition-[padding,filter] duration-200 hover:pr-4 hover:brightness-110 focus-visible:pr-4"
    >
      <ShoppingBag className="h-5 w-5 shrink-0 text-gold transition-transform duration-200 group-hover:scale-110" />
      <span className="font-heading text-xs font-extrabold uppercase tracking-[0.25em] [writing-mode:vertical-rl] rotate-180">
        Boutique
      </span>
    </Link>
  );
}
