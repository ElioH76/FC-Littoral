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
  { href: "/boutique", label: "Boutique" },
  { href: "/sponsors", label: "Partenaires" },
];

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-ink pt-16 text-bone-dim">
      {/* Filigrane géant */}
      <div className="watermark select-none text-center text-[clamp(5rem,22vw,16rem)] leading-[0.8]">
        LITTORAL
      </div>

      <div className="container relative -mt-5">
        <div className="grid gap-10 border-t border-white/10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Marque */}
          <div>
            <Link href="/" className="mb-4 flex items-center gap-3">
              <Logo size={38} />
              <span className="font-heading text-base font-black uppercase tracking-wide text-bone">
                F.C. <span className="text-gold">Littoral</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed">
              {club.slogan}. {club.subSlogan}. Club de football amateur fondé en{" "}
              {club.founded}.
            </p>
            <div className="mt-5 flex gap-2.5">
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

          {/* Navigation */}
          <div>
            <h4 className="mb-4 font-heading text-xs font-extrabold uppercase tracking-[0.16em] text-bone">
              Navigation
            </h4>
            <ul className="grid gap-3 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-gold-bright"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-heading text-xs font-extrabold uppercase tracking-[0.16em] text-bone">
              Contact
            </h4>
            <ul className="grid gap-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{club.contact.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <a
                  href={`mailto:${club.contact.email}`}
                  className="transition-colors hover:text-gold-bright"
                >
                  {club.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <a
                  href={`tel:${club.contact.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-gold-bright"
                >
                  {club.contact.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs md:flex-row">
          <p>
            © {new Date().getFullYear()} {club.fullName}. Tous droits réservés.
          </p>
          <p className="font-heading font-extrabold uppercase tracking-[0.08em] text-gold">
            {club.slogan} · {club.subSlogan}
          </p>
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
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-bone-dim transition-colors hover:border-gold hover:text-gold-bright"
    >
      {children}
    </a>
  );
}
