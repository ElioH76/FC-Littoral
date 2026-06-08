"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";

type NavItem = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

const links: NavItem[] = [
  { href: "/", label: "Accueil" },
  { href: "/club", label: "Le club" },
  {
    href: "/equipes",
    label: "Équipes",
    children: [
      { href: "/equipes/u15", label: "U15" },
      { href: "/equipes/seniors", label: "Seniors Après-Midi" },
      { href: "/equipes/veterans", label: "Vétérans" },
      { href: "/equipes", label: "Toutes les équipes" },
    ],
  },
  {
    href: "/saison",
    label: "Saison",
    children: [
      { href: "/saison#classement", label: "Classement" },
      { href: "/saison#calendrier", label: "Calendrier & résultats" },
    ],
  },
  { href: "/actualites", label: "Actualités" },
  { href: "/sponsors", label: "Partenaires" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full text-white transition-all duration-300",
        "bg-gradient-to-b from-forest-600 to-forest-700",
        scrolled ? "shadow-xl shadow-black/30" : "shadow-md shadow-black/10",
      )}
    >
      <div
        className={cn(
          "container flex items-center justify-between transition-all duration-300",
          scrolled ? "h-14 md:h-16" : "h-16 md:h-20",
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Logo size={48} className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]" />
          <span className="font-display text-lg uppercase leading-none tracking-tight md:text-xl">
            F.C. <span className="text-gold">Littoral</span>
          </span>
        </Link>

        {/* Navigation desktop */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Navigation principale"
        >
          {links.map((link) =>
            link.children ? (
              <div key={link.label} className="group relative">
                <Link
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-1 px-3 py-2 font-display text-sm uppercase tracking-wide transition-colors",
                    isActive(link.href) ? "text-gold" : "text-white hover:text-gold",
                  )}
                >
                  {link.label}
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                  <NavUnderline active={isActive(link.href)} group />
                </Link>
                {/* Panneau déroulant */}
                <div className="invisible absolute left-0 top-full pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="min-w-[240px] overflow-hidden rounded-xl border-t-2 border-gold bg-white p-2 text-ink shadow-2xl">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-forest-50 hover:text-forest"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group/item relative px-3 py-2 font-display text-sm uppercase tracking-wide transition-colors",
                  isActive(link.href) ? "text-gold" : "text-white hover:text-gold",
                )}
              >
                {link.label}
                <NavUnderline active={isActive(link.href)} />
              </Link>
            ),
          )}
          <Button
            asChild
            size="sm"
            className="ml-3 shadow-md transition-transform hover:scale-105"
          >
            <Link href="/#rejoindre">Nous rejoindre</Link>
          </Button>
        </nav>

        {/* Bouton menu mobile */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-white transition-colors hover:bg-white/10 lg:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Liseré or décoratif en bas du header */}
      <div
        className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold to-transparent"
        aria-hidden
      />

      {/* Menu mobile */}
      {open && (
        <nav
          className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-white/10 bg-forest-700 lg:hidden"
          aria-label="Navigation mobile"
        >
          <div className="container flex flex-col gap-1 py-4">
            {links.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-md px-4 py-3 font-display text-base uppercase tracking-wide transition-colors",
                    isActive(link.href)
                      ? "bg-white/10 text-gold"
                      : "text-white/90 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="mb-1 ml-4 flex flex-col border-l-2 border-gold/40 pl-3">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="rounded-md px-3 py-2 text-sm text-white/75 transition-colors hover:text-gold"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Button asChild className="mt-2">
              <Link href="/#rejoindre" onClick={() => setOpen(false)}>
                Nous rejoindre
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}

/** Soulignement or animé sous un lien de navigation. */
function NavUnderline({
  active,
  group = false,
}: {
  active: boolean;
  group?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-3 bottom-1 h-0.5 origin-left rounded-full bg-gold transition-transform duration-300",
        active
          ? "scale-x-100"
          : group
            ? "scale-x-0 group-hover:scale-x-100"
            : "scale-x-0 group-hover/item:scale-x-100",
      )}
    />
  );
}
