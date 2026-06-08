"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

/** Logo d'une équipe, avec repli sur ses initiales si l'image manque/échoue. */
export function TeamCrest({
  src,
  name,
  size = 64,
  className,
}: {
  src?: string;
  name: string;
  size?: number;
  className?: string;
}) {
  const [error, setError] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 3)
    .join("")
    .toUpperCase();

  if (src && !error) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        onError={() => setError(true)}
        className={cn("object-contain", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-forest font-display text-white",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.32 }}
      aria-label={name}
    >
      {initials}
    </span>
  );
}
