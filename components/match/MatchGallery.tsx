"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Galerie photo d'un match : grille en mosaïque + visionneuse plein écran
 * (flèches clavier, fermeture par Échap ou clic sur le fond).
 */
export function MatchGallery({
  photos,
  caption,
  title,
}: {
  photos: string[];
  caption?: string;
  title: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const go = useCallback(
    (dir: 1 | -1) =>
      setOpen((i) =>
        i === null ? i : (i + dir + photos.length) % photos.length,
      ),
    [photos.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    // Empêche le scroll de l'arrière-plan quand la visionneuse est ouverte.
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, go]);

  if (photos.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-1.5 flex items-center gap-2 font-display text-lg uppercase tracking-wide text-ink">
        <Camera className="h-5 w-5 text-forest" /> En images
      </h2>
      {caption && (
        <p className="mb-5 text-sm text-muted-foreground">{caption}</p>
      )}

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3">
        {photos.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Agrandir la photo ${i + 1}`}
            className={cn(
              "group relative overflow-hidden rounded-xl bg-muted",
              // La 1re photo (équipe) occupe une grande tuile.
              i === 0 && "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2",
            )}
          >
            <div
              className={cn(
                "relative",
                i === 0 ? "aspect-[3/2]" : "aspect-square",
              )}
            >
              <Image
                src={src}
                alt={`${title} — photo ${i + 1}`}
                fill
                sizes={i === 0 ? "(max-width: 768px) 92vw, 62vw" : "(max-width: 768px) 46vw, 31vw"}
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — photo ${open + 1} sur ${photos.length}`}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Fermer"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Photo précédente"
            className="absolute left-3 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 md:left-6"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          <div
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[open]}
              alt={`${title} — photo ${open + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Photo suivante"
            className="absolute right-3 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 md:right-6"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3.5 py-1.5 font-display text-sm text-white">
            {open + 1} / {photos.length}
          </div>
        </div>
      )}
    </section>
  );
}
