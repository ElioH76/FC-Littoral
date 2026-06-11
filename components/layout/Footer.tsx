import Link from "next/link";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

import { club } from "@/data/club";
import { Logo } from "@/components/brand/Logo";

const nav = [
  { href: "/", label: "Accueil" },
  { href: "/club", label: "Le club" },
  { href: "/equipes", label: "Nos équipes" },
  { href: "/saison", label: "Saison" },
  { href: "/actualites", label: "Actualités" },
  { href: "/sponsors", label: "Partenaires" },
];

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-ink text-white/80">
      {/* Accent or en tête de footer */}
      <div
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"
        aria-hidden
      />
      {/* Filigrane géant */}
      <span
        className="watermark watermark-light -bottom-6 left-1/2 -translate-x-1/2 text-[7rem] sm:text-[12rem] md:text-[16rem]"
        aria-hidden
      >
        LITTORAL
      </span>

      <div className="container relative grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-3">
            <Logo size={56} />
            <span className="font-display text-xl uppercase tracking-tight text-white">
              F.C. <span className="text-gold">Littoral</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            {club.slogan}. {club.subSlogan}. Club de football amateur fondé en{" "}
            {club.founded}.
          </p>
          <div className="mt-5 flex gap-3">
            <SocialLink href={club.socials.facebook} label="Facebook">
              <Facebook className="h-5 w-5" />
            </SocialLink>
            <SocialLink href={club.socials.instagram} label="Instagram">
              <Instagram className="h-5 w-5" />
            </SocialLink>
            <SocialLink href={club.socials.youtube} label="YouTube">
              <Youtube className="h-5 w-5" />
            </SocialLink>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-widest text-gold">
            Navigation
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-widest text-gold">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-forest-300" />
              <span>{club.contact.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-forest-300" />
              <a
                href={`mailto:${club.contact.email}`}
                className="transition-colors hover:text-white"
              >
                {club.contact.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-forest-300" />
              <a
                href={`tel:${club.contact.phone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-white"
              >
                {club.contact.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 md:flex-row">
          <p>
            © {new Date().getFullYear()} {club.fullName}. Tous droits réservés.
          </p>
          <p>{club.slogan} · {club.subSlogan}</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-gold hover:bg-gold hover:text-ink"
    >
      {children}
    </a>
  );
}
