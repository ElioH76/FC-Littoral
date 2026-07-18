"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";

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
      { href: "/equipes/seniors", label: "Seniors Après-Midi" },
      { href: "/equipes/veterans", label: "Vétérans" },
      { href: "/equipes/u13", label: "U13" },
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

  const linkBase =
    "flex items-center gap-1.5 rounded-lg px-3.5 py-2.5 font-heading text-[0.82rem] font-bold uppercase tracking-wide transition-colors";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full text-bone backdrop-blur-xl transition-shadow duration-300",
        "border-b border-white/10 bg-ink/75 supports-[backdrop-filter]:bg-ink/65",
        scrolled && "shadow-lg shadow-black/40",
      )}
    >
      <div className="container flex h-[68px] items-center gap-8 md:h-[74px]">
        {/* Marque */}
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Logo size={38} className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]" />
          <span className="font-heading text-base font-black uppercase tracking-wide">
            F.C. <span className="text-gold">Littoral</span>
          </span>
        </Link>

        {/* Navigation desktop */}
        <nav
          className="ml-auto hidden items-center gap-1 lg:flex"
          aria-label="Navigation principale"
        >
          {links.map((link) =>
            link.children ? (
              <div key={link.label} className="group relative">
                <Link
                  href={link.href}
                  className={cn(
                    linkBase,
                    isActive(link.href)
                      ? "text-gold-bright"
                      : "text-bone hover:bg-white/5 hover:text-gold-bright",
                  )}
                >
                  {link.label}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
                </Link>
                {/* Panneau déroulant */}
                <div className="invisible absolute left-0 top-full pt-2.5 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="min-w-[230px] rounded-2xl border border-white/15 bg-ink-800 p-2 shadow-xl shadow-black/50">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-xl px-3.5 py-2.5 text-sm font-semibold text-bone-dim transition-colors hover:bg-gold/10 hover:text-gold-bright"
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
                  linkBase,
                  isActive(link.href)
                    ? "text-gold-bright"
                    : "text-bone hover:bg-white/5 hover:text-gold-bright",
                )}
              >
                {link.label}
              </Link>
            ),
          )}
          <Link
            href="/#rejoindre"
            className="ml-2 rounded-lg bg-forest px-4 py-2.5 font-heading text-[0.82rem] font-extrabold uppercase tracking-wide text-bone transition-colors hover:brightness-110"
          >
            Nous rejoindre
          </Link>
        </nav>

        {/* Boutique — isolée, tout à droite de la barre */}
        <div className="hidden items-center gap-4 lg:flex">
          <span className="h-7 w-px bg-white/15" aria-hidden />
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 font-heading text-[0.82rem] font-extrabold uppercase tracking-wide text-ink shadow-sm transition-colors hover:bg-gold-bright"
          >
            <ShoppingBag className="h-4 w-4" />
            Boutique
          </Link>
        </div>

        {/* Bouton menu mobile */}
        <button
          type="button"
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 text-bone transition-colors hover:border-gold hover:text-gold-bright lg:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav
          className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-white/10 bg-ink-800 lg:hidden"
          aria-label="Navigation mobile"
        >
          <div className="container flex flex-col gap-1 py-4">
            {links.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-lg px-4 py-3 font-heading text-base font-bold uppercase tracking-wide transition-colors",
                    isActive(link.href)
                      ? "bg-white/5 text-gold-bright"
                      : "text-bone hover:bg-white/5 hover:text-gold-bright",
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
                        className="rounded-md px-3 py-2 text-sm font-semibold text-bone-dim transition-colors hover:text-gold-bright"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/boutique"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-4 py-3 text-center font-heading text-base font-extrabold uppercase tracking-wide text-ink"
            >
              <ShoppingBag className="h-5 w-5" />
              Boutique
            </Link>
            <Link
              href="/#rejoindre"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-forest px-4 py-3 text-center font-heading text-base font-extrabold uppercase tracking-wide text-bone"
            >
              Nous rejoindre
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
