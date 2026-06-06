import { Mail, Phone, MapPin } from "lucide-react";

import { club } from "@/data/club";
import { Button } from "@/components/ui/button";

/** Appel à l'action : rejoindre / contacter le club. */
export function JoinCTA() {
  return (
    <section id="rejoindre" className="scroll-mt-24 bg-ink text-white">
      <div className="container section">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-forest-700 via-forest to-forest-700 p-8 md:p-14">
          <div className="absolute inset-0 bg-gold-grain opacity-60" aria-hidden />
          <div className="relative grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="eyebrow text-gold">
                <span className="gold-rule !w-8" aria-hidden />
                Ensemble, plus forts
              </span>
              <h2 className="mt-3 text-3xl text-white md:text-4xl lg:text-5xl">
                Envie de rejoindre le club&nbsp;?
              </h2>
              <p className="mt-4 max-w-md text-white/80">
                Joueurs, joueuses, bénévoles ou supporters : il y a une place
                pour vous au F.C. Littoral. Contactez-nous, nous serons ravis de
                vous accueillir.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href={`mailto:${club.contact.email}`}>Nous écrire</a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-ink"
                >
                  <a href={`tel:${club.contact.phone.replace(/\s/g, "")}`}>
                    Nous appeler
                  </a>
                </Button>
              </div>
            </div>

            <ul className="relative space-y-4 rounded-2xl bg-ink/30 p-6 backdrop-blur">
              <ContactRow icon={<MapPin className="h-5 w-5" />} label="Adresse">
                {club.contact.address}
              </ContactRow>
              <ContactRow icon={<Mail className="h-5 w-5" />} label="Email">
                <a className="hover:text-gold" href={`mailto:${club.contact.email}`}>
                  {club.contact.email}
                </a>
              </ContactRow>
              <ContactRow icon={<Phone className="h-5 w-5" />} label="Téléphone">
                <a
                  className="hover:text-gold"
                  href={`tel:${club.contact.phone.replace(/\s/g, "")}`}
                >
                  {club.contact.phone}
                </a>
              </ContactRow>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
        {icon}
      </span>
      <div>
        <div className="font-display text-xs uppercase tracking-widest text-gold">
          {label}
        </div>
        <div className="text-white/90">{children}</div>
      </div>
    </li>
  );
}
