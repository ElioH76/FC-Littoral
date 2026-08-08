"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const tabs = [
  { href: "/admin", label: "Commandes" },
  { href: "/admin/produits", label: "Produits" },
  { href: "/admin/saison", label: "Matchs & Stats" },
];

/** Onglets de navigation entre les sections de l'admin. */
export function AdminTabs() {
  const pathname = usePathname();
  return (
    <div className="flex gap-2">
      {tabs.map((t) => {
        const active =
          t.href === "/admin" ? pathname === "/admin" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "rounded-full px-4 py-2 font-heading text-xs font-bold uppercase tracking-wide transition-colors",
              active
                ? "bg-gold text-ink"
                : "border border-white/15 text-bone-dim hover:border-gold/50 hover:text-bone",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
