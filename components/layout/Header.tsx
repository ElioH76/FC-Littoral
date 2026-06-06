"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/equipes", label: "Nos équipes" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/actualites", label: "Actualités" },
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
        "sticky top-0 z-50 w-full border-b text-white backdrop-blur transition-all duration-300 supports-[backdrop-filter]:bg-forest/85",
        scrolled
          ? "border-black/10 bg-forest shadow-lg shadow-black/25"
          : "border-white/10 bg-forest/80",
      )}
    >
      <div
        className={cn(
          "container flex items-center justify-between transition-all duration-300",
          scrolled ? "h-14 md:h-16" : "h-16 md:h-20",
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Logo size={48} />
          <span className="font-display text-lg uppercase leading-none tracking-tight md:text-xl">
            F.C. <span className="text-gold">Littoral</span>
          </span>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-4 py-2 font-display text-sm uppercase tracking-wide transition-colors",
                isActive(link.href)
                  ? "text-gold"
                  : "text-white/80 hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-2">
            <Link href="/#rejoindre">Nous rejoindre</Link>
          </Button>
        </nav>

        {/* Bouton menu mobile */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-white md:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav
          className="border-t border-white/10 bg-forest md:hidden"
          aria-label="Navigation mobile"
        >
          <div className="container flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-4 py-3 font-display text-base uppercase tracking-wide transition-colors",
                  isActive(link.href)
                    ? "bg-white/5 text-gold"
                    : "text-white/80 hover:bg-white/5 hover:text-white",
                )}
              >
                {link.label}
              </Link>
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
