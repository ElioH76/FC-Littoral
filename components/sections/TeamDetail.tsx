import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarClock, MapPin, Star, Target, Users } from "lucide-react";

import type { Team } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

/**
 * Bloc de présentation détaillée d'une équipe.
 * `reverse` alterne le sens (photo gauche/droite).
 * L'équipe fanion est mise en avant sur fond sombre.
 */
export function TeamDetail({
  team,
  reverse = false,
}: {
  team: Team;
  reverse?: boolean;
}) {
  const flagship = team.flagship;

  return (
    <section
      id={team.slug}
      className={cn(
        "scroll-mt-20",
        flagship ? "bg-ink text-white" : "bg-background",
      )}
    >
      <div className="container section">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Photo */}
          <Reveal
            direction={reverse ? "left" : "right"}
            className={cn("relative", reverse && "lg:order-2")}
          >
            <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={team.image}
                alt={team.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {flagship && (
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              )}
            </div>
          </Reveal>

          {/* Contenu */}
          <Reveal
            direction={reverse ? "right" : "left"}
            delay={120}
            className={cn(reverse && "lg:order-1")}
          >
            {flagship ? (
              <Badge className="gap-1">
                <Star className="h-3 w-3" /> Équipe fanion
              </Badge>
            ) : (
              <span className="font-display text-xs uppercase tracking-widest text-forest">
                {team.category}
              </span>
            )}

            <h2
              className={cn(
                "mt-3 text-3xl md:text-4xl lg:text-5xl",
                flagship ? "text-white" : "text-ink",
              )}
            >
              {team.name}
            </h2>

            <p
              className={cn(
                "mt-4 leading-relaxed",
                flagship ? "text-white/80" : "text-muted-foreground",
              )}
            >
              {team.description}
            </p>

            {/* Objectifs */}
            {team.objectives && team.objectives.length > 0 && (
              <ul className="mt-6 space-y-2">
                {team.objectives.map((obj) => (
                  <li key={obj} className="flex items-start gap-3">
                    <Target
                      className={cn(
                        "mt-0.5 h-5 w-5 shrink-0",
                        flagship ? "text-gold" : "text-forest",
                      )}
                    />
                    <span className={flagship ? "text-white/90" : "text-ink/80"}>
                      {obj}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Entraînements + encadrement */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <InfoBlock title="Entraînements" light={flagship}>
                <ul className="space-y-2">
                  {team.trainings.map((t, i) => (
                    <li key={i} className="text-sm">
                      <div className="flex items-center gap-2 font-medium">
                        <CalendarClock
                          className={cn(
                            "h-4 w-4",
                            flagship ? "text-gold" : "text-forest",
                          )}
                        />
                        {t.day} · {t.time}
                      </div>
                      <div
                        className={cn(
                          "ml-6 flex items-center gap-1 text-xs",
                          flagship ? "text-white/60" : "text-muted-foreground",
                        )}
                      >
                        <MapPin className="h-3 w-3" /> {t.location}
                      </div>
                    </li>
                  ))}
                </ul>
              </InfoBlock>

              <InfoBlock title="Encadrement" light={flagship}>
                <ul className="space-y-2">
                  {team.staff.map((s) => (
                    <li key={s.name} className="text-sm">
                      <div className="font-medium">{s.name}</div>
                      <div
                        className={cn(
                          "text-xs",
                          flagship ? "text-white/60" : "text-muted-foreground",
                        )}
                      >
                        {s.role}
                      </div>
                    </li>
                  ))}
                </ul>
              </InfoBlock>
            </div>

            {/* Effectif (aperçu) */}
            {team.players && team.players.length > 0 && (
              <div className="mt-6">
                <div
                  className={cn(
                    "flex items-center gap-2 font-display text-sm uppercase tracking-widest",
                    flagship ? "text-gold" : "text-forest",
                  )}
                >
                  <Users className="h-4 w-4" /> Effectif
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {team.players.map((p) => (
                    <span
                      key={p.name}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs",
                        flagship
                          ? "border-white/20 text-white/85"
                          : "border-border text-ink/80",
                      )}
                    >
                      {p.number != null && (
                        <span
                          className={cn(
                            "font-display",
                            flagship ? "text-gold" : "text-forest",
                          )}
                        >
                          {p.number}
                        </span>
                      )}
                      {p.name}
                      <span
                        className={
                          flagship ? "text-white/50" : "text-muted-foreground"
                        }
                      >
                        · {p.position}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Button
              asChild
              variant={flagship ? "default" : "forest"}
              className="mt-8"
            >
              <Link href={`/equipes/${team.slug}`}>
                Voir la page de l&apos;équipe
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function InfoBlock({
  title,
  light,
  children,
}: {
  title: string;
  light?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        light ? "border-white/15 bg-white/5" : "border-border bg-muted/40",
      )}
    >
      <h3
        className={cn(
          "mb-3 text-sm",
          light ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}
