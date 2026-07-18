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
      className="group fixed right-0 top-1/2 z-40 flex -translate-y-1/2 items-center gap-2 rounded-l-xl bg-gold py-3 pl-4 pr-4 font-heading text-sm font-extrabold uppercase tracking-wide text-ink shadow-xl shadow-black/40 transition-[padding,background-color] duration-200 hover:bg-gold-bright hover:pl-6 focus-visible:pl-6"
    >
      <ShoppingBag className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
      Boutique
    </Link>
  );
}
