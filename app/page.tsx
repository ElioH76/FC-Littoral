import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Instagram, Users } from "lucide-react";

import { club } from "@/data/club";
import { getFlagshipTeam, getLatestNews, getSponsors } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/sections/Hero";
import { KitStripe } from "@/components/sections/KitStripe";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { NewsCard } from "@/components/cards/NewsCard";
import { SeasonPreview } from "@/components/sections/SeasonPreview";

export default async function HomePage() {
  const [flagship, recentNews, sponsors] = await Promise.all([
    getFlagshipTeam(),
    getLatestNews(6),
    getSponsors(),
  ]);

  const latestNews = recentNews.filter((a) => !a.featured).slice(0, 3);

  return (
    <>
      <Hero />

      {/* ===== STATS ===== */}
      <div className="border-b border-white/10 bg-ink-800">
        <div className="container grid grid-cols-2 md:grid-cols-4">
          {club.stats.map((stat, i) => (
            <div
              key={stat.label}
              className="border-white/10 px-6 py-11 text-center [&:not(:last-child)]:md:border-r"
            >
              <b
                className={`block font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-none ${
                  i % 2 === 0 ? "text-gold" : "text-bone"
                }`}
              >
                {stat.value}
              </b>
              <span className="mt-2.5 block font-heading text-[0.72rem] font-bold uppercase tracking-[0.16em] text-bone-dim">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <KitStripe />

      {/* ===== FEATURE : MAILLOTS (clair) ===== */}
      <section className="section section-light">
        <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="eyebrow mb-5">À ne pas rater</span>
            <h2 className="font-heading text-[clamp(1.9rem,4.4vw,3.1rem)] font-black uppercase leading-[1.05]">
              Les nouveaux maillots 2024 / 2025
            </h2>
            <p className="mt-5 max-w-lg text-base text-muted-foreground md:text-lg">
              L&apos;équipe Seniors Après-Midi dévoile ses nouvelles tuniques,
              joueur et gardien, signées MAKI9SPORT. Or et vert pour le terrain,
              violet camo pour les cages.
            </p>
            <Button asChild className="mt-7">
              <Link
                href="/actualites/nouveaux-maillots-2024-2025"
                className="group"
              >
                Découvrir le maillot
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                src: "/mockup-maillot-joueur.jpeg",
                alt: "Maillot joueur 2024/2025",
                cap: "Joueur · Or & Vert",
              },
              {
                src: "/mockup-maillot-gardien.jpeg",
                alt: "Maillot gardien 2024/2025",
                cap: "Gardien · Violet camo",
              },
            ].map((kit) => (
              <figure
                key={kit.src}
                className="overflow-hidden rounded-2xl border border-border bg-paper-card transition-transform duration-300 hover:-translate-y-1.5 hover:border-gold"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={kit.src}
                    alt={kit.alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="px-4 py-3 font-heading text-[0.72rem] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                  {kit.cap}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWS (sombre) ===== */}
      <section className="section">
        <div className="container">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Actualités" title="Les dernières news" />
            <Link
              href="/actualites"
              className="group inline-flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wide text-gold hover:text-gold-bright"
            >
              Toutes les actus
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((article) => (
              <NewsCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      <KitStripe />

      {/* ===== CLUB (clair) ===== */}
      <section className="section section-light border-y border-border">
        <div className="container grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <span className="eyebrow mb-4">Le club</span>
            <h2 className="font-heading text-[clamp(1.9rem,4.4vw,3rem)] font-black uppercase leading-[1.05]">
              Une grande famille depuis {club.founded}
            </h2>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              {club.description}
            </p>
            <div className="mt-8">
              {club.values.map((value, i) => (
                <div
                  key={value.title}
                  className="flex gap-5 border-t border-border py-5 last:border-b"
                >
                  <span className="font-display text-2xl text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="font-heading text-base font-extrabold uppercase tracking-wide">
                      {value.title}
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {value.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-border">
            <div className="relative aspect-[4/5]">
              <Image
                src="/images/photos/vestaire.jpeg"
                alt="Le club-house du F.C. Littoral, « depuis 2002 », aux couleurs or et vert"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-5 left-5 rounded-2xl bg-gold px-5 py-3.5 text-ink">
              <div className="font-display text-3xl leading-none">
                {club.founded}
              </div>
              <div className="mt-1 font-heading text-[0.62rem] font-extrabold uppercase tracking-[0.16em]">
                Année de création
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SENIORS (sombre, image) ===== */}
      {flagship && (
        <section className="relative isolate overflow-hidden border-b border-white/10">
          <Image
            src={flagship.image}
            alt={flagship.imageAlt}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,10,7,.94)_0%,rgba(11,30,18,.7)_55%,rgba(7,10,7,.4)_100%)]" />
          <div className="container relative z-10 section">
            <div className="max-w-xl">
              <span className="eyebrow mb-5">Équipe fanion</span>
              <h2 className="font-heading text-[clamp(2rem,5vw,3.2rem)] font-black uppercase leading-[1.04]">
                {flagship.name}
              </h2>
              <p className="mt-5 text-base text-bone-dim md:text-lg">
                {flagship.description}
              </p>
              <ul className="mt-7 grid gap-3">
                {flagship.objectives?.map((obj) => (
                  <li key={obj} className="flex items-start gap-3 text-bone">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-sm bg-gold" />
                    {obj}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Button asChild>
                  <Link href="/equipes#seniors" className="group">
                    Voir l&apos;équipe
                    <ArrowRight className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <span className="inline-flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-wide text-bone-dim">
                  <Users className="h-4 w-4 text-gold" />
                  {flagship.players?.length ?? 0} joueurs ·{" "}
                  {flagship.staff.length} encadrants
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== SAISON (clair, données réelles) ===== */}
      <SeasonPreview />

      {/* ===== SUIVEZ-NOUS (feed Instagram, sombre) ===== */}
      <section className="section border-t border-white/10 bg-ink">
        <div className="container">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Sur les réseaux"
              title="Suivez-nous"
            />
            <a
              href={club.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wide text-gold hover:text-gold-bright"
            >
              <Instagram className="h-4 w-4" />
              @fclittoral
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
            {[
              { src: "/images/social/match-day.png", alt: "Affiche du match FC Littoral contre AS Cauville, journée 12" },
              { src: "/images/social/joueurs-convoques.png", alt: "Le groupe convoqué pour le match contre AS Cauville" },
              { src: "/images/social/resultat.png", alt: "Résultat : victoire du FC Littoral 3-1 contre AS Cauville" },
              { src: "/images/social/homme-du-match.png", alt: "Homme du match : Elio Hardouin" },
              { src: "/images/social/calendrier.png", alt: "Calendrier du FC Littoral pour le mois d'octobre" },
              { src: "/images/social/sponsors.png", alt: "Un club, une famille — merci à nos partenaires" },
            ].map((post) => (
              <a
                key={post.src}
                href={club.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-2xl border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-gold"
              >
                <Image
                  src={post.src}
                  alt={post.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-ink/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Instagram className="h-7 w-7 text-bone" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PARTENAIRES (sombre) ===== */}
      <section className="section border-t border-white/10 bg-ink-800">
        <div className="container">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Ils nous soutiennent"
              title="Nos partenaires"
            />
            <Link
              href="/sponsors"
              className="group inline-flex items-center gap-2 font-heading text-sm font-extrabold uppercase tracking-wide text-gold hover:text-gold-bright"
            >
              Tous nos partenaires
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {sponsors.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={sponsor.name}
                className="flex aspect-[3/2] items-center justify-center rounded-2xl border border-white/10 bg-ink p-5 transition-all duration-200 hover:-translate-y-1 hover:border-gold"
              >
                <Image
                  src={sponsor.logo}
                  alt={`Logo ${sponsor.name}`}
                  width={160}
                  height={80}
                  className="max-h-10 w-auto object-contain opacity-80 brightness-0 invert transition-opacity hover:opacity-100"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      <KitStripe />

      {/* ===== JOIN (sombre) ===== */}
      <section
        id="rejoindre"
        className="section bg-gradient-to-br from-ink-700 to-ink"
      >
        <div className="container grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <span className="eyebrow mb-4">Ensemble, plus forts</span>
            <h2 className="font-heading text-[clamp(2rem,5vw,3.4rem)] font-black uppercase leading-[1.04]">
              Envie de rejoindre le club ?
            </h2>
            <p className="mt-5 max-w-lg text-base text-bone-dim md:text-lg">
              Joueurs, joueuses, bénévoles ou supporters : il y a une place pour
              vous au F.C. Littoral. Contactez-nous, nous serons ravis de vous
              accueillir.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Button asChild>
                <a href={`mailto:${club.contact.email}`} className="group">
                  Nous écrire
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={`tel:${club.contact.phone.replace(/\s/g, "")}`}>
                  Nous appeler
                </a>
              </Button>
            </div>
          </div>
          <div className="rounded-3xl border border-white/15 bg-black/30 p-2">
            {[
              { k: "Adresse", v: club.contact.address },
              { k: "Email", v: club.contact.email },
              { k: "Téléphone", v: club.contact.phone },
            ].map((row) => (
              <div
                key={row.k}
                className="flex flex-col gap-1 border-b border-white/10 p-5 last:border-0 sm:flex-row sm:gap-4"
              >
                <span className="min-w-[96px] font-heading text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-gold">
                  {row.k}
                </span>
                <span className="font-medium text-bone">{row.v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
