import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Target, Users } from "lucide-react";

import { club } from "@/data/club";
import {
  getFeaturedArticles,
  getFlagshipTeam,
  getLatestNews,
  getSponsors,
} from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Hero } from "@/components/sections/Hero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { NewsCard } from "@/components/cards/NewsCard";
import { SponsorStrip } from "@/components/sections/SponsorStrip";
import { SeasonPreview } from "@/components/sections/SeasonPreview";
import { FeaturedSlider } from "@/components/sections/FeaturedSlider";
import { JoinCTA } from "@/components/sections/JoinCTA";

export default async function HomePage() {
  const [flagship, recentNews, featured, sponsors] = await Promise.all([
    getFlagshipTeam(),
    getLatestNews(6),
    getFeaturedArticles(),
    getSponsors(),
  ]);

  // On exclut les articles vedette (déjà dans le slider) de la grille d'actus.
  const latestNews = recentNews.filter((a) => !a.featured).slice(0, 3);

  return (
    <>
      <Hero />

      {/* Slider "à ne pas rater" */}
      <FeaturedSlider articles={featured} />

      {/* Présentation rapide du club */}
      <section className="section">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="Le club"
                title="Une grande famille depuis 2002"
                description={club.description}
              />
            </Reveal>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {club.values.map((value, i) => (
                <Reveal key={value.title} delay={i * 120}>
                  <div className="h-full rounded-xl border bg-card p-5 transition-all hover:-translate-y-1 hover:border-gold/50 hover:shadow-md">
                    <h3 className="text-base text-forest">{value.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {value.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal direction="left">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src="/images/club-about.jpg"
                  alt="Joueurs du F.C. Littoral à l'entraînement"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 hidden rounded-xl bg-gold p-5 text-ink shadow-lg sm:block">
                <div className="font-display text-3xl">{club.founded}</div>
                <div className="text-xs uppercase tracking-wider">
                  Année de création
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mise en avant équipe fanion */}
      {flagship && (
        <section className="bg-ink text-white">
          <div className="container section">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <Reveal direction="right" className="order-2 lg:order-1">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={flagship.image}
                    alt={flagship.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                </div>
              </Reveal>

              <Reveal className="order-1 lg:order-2">
                <Badge className="gap-1">
                  <Star className="h-3 w-3" /> Équipe fanion
                </Badge>
                <h2 className="mt-4 text-4xl text-white md:text-5xl">
                  {flagship.name}
                </h2>
                <p className="mt-4 text-white/80">{flagship.description}</p>

                <ul className="mt-6 space-y-3">
                  {flagship.objectives?.map((obj) => (
                    <li key={obj} className="flex items-start gap-3">
                      <Target className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                      <span className="text-white/90">{obj}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex items-center gap-6">
                  <Button asChild>
                    <Link href="/equipes#seniors">
                      Voir l&apos;équipe
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <span className="flex items-center gap-2 text-sm text-white/70">
                    <Users className="h-4 w-4 text-gold" />
                    {flagship.players?.length ?? 0} joueurs ·{" "}
                    {flagship.staff.length} encadrants
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* Aperçu des dernières actualités */}
      <section className="section">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Actualités"
              title="Les dernières news"
              description="Comptes-rendus, vie du club et temps forts de la saison."
            />
            <Button asChild variant="ghost" className="text-forest">
              <Link href="/actualites">
                Toutes les actus
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((article, i) => (
              <Reveal key={article.slug} delay={i * 120}>
                <NewsCard article={article} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Aperçu de saison : classement & calendrier (mock, bientôt en direct) */}
      <SeasonPreview />

      {/* Sponsors */}
      <SponsorStrip sponsors={sponsors} />

      {/* Call to action */}
      <JoinCTA />
    </>
  );
}
