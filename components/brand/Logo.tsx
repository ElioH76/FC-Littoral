"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Écusson F.C. Littoral.
 *
 * 👉 Dépose le vrai logo dans `public/logo.png`.
 *    Tant qu'il n'existe pas, un écusson de secours s'affiche automatiquement.
 *    Idéalement fournir un PNG à fond transparent ; sinon utiliser `framed`
 *    pour l'afficher dans une pastille blanche sur les fonds sombres.
 */
export function Logo({
  size = 48,
  framed = false,
  className,
}: {
  size?: number;
  framed?: boolean;
  className?: string;
}) {
  const [error, setError] = useState(false);

  const inner = error ? (
    <CrestFallback size={size} className={className} />
  ) : (
    <Image
      src="/logo.png"
      alt="Écusson F.C. Littoral"
      width={size}
      height={size}
      priority
      onError={() => setError(true)}
      className={cn("object-contain", className)}
      style={{ width: size, height: size }}
    />
  );

  if (!framed) return inner;

  return (
    <span
      className="inline-flex items-center justify-center rounded-lg bg-white p-1 shadow-sm ring-1 ring-black/5"
      style={{ width: size + 8, height: size + 8 }}
    >
      {inner}
    </span>
  );
}

/** Écusson de secours (vectoriel) affiché si /logo.png est absent. */
function CrestFallback({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 110"
      fill="none"
      role="img"
      aria-label="Écusson F.C. Littoral"
      className={cn("shrink-0", className)}
    >
      <path
        d="M50 2 L96 14 V58 C96 84 76 100 50 108 C24 100 4 84 4 58 V14 Z"
        fill="#0B0B0B"
      />
      <path
        d="M50 7 L91 18 V57 C91 80 73 95 50 102 C27 95 9 80 9 57 V18 Z"
        fill="#1F7A3D"
      />
      <path
        d="M50 13 L85 22 V56 C85 76 69 89 50 95 C31 89 15 76 15 56 V22 Z"
        fill="#F5C518"
      />
      <path d="M15 22 L50 13 L85 22 V31 H15 Z" fill="#1F7A3D" />
      <text
        x="50"
        y="28"
        textAnchor="middle"
        fontFamily="Arial Narrow, Arial, sans-serif"
        fontWeight="700"
        fontSize="9"
        fill="#FFFFFF"
        letterSpacing="0.5"
      >
        F.C. LITTORAL
      </text>
      <path
        d="M50 40 C42 40 36 45 33 52 C30 47 24 45 20 47 C26 49 28 53 30 57 C25 56 21 58 19 61 C25 61 29 62 33 64 C37 70 43 73 50 73 C57 73 63 70 67 64 C71 62 75 61 81 61 C79 58 75 56 70 57 C72 53 74 49 80 47 C76 45 70 47 67 52 C64 45 58 40 50 40 Z"
        fill="#0B0B0B"
      />
      <circle cx="54" cy="46" r="1.6" fill="#F5C518" />
      <text x="33" y="86" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="9" fill="#0B0B0B">20</text>
      <circle cx="50" cy="83" r="5" fill="#FFFFFF" stroke="#0B0B0B" strokeWidth="1" />
      <path d="M50 79 L52.5 81 L51.5 84 L48.5 84 L47.5 81 Z" fill="#0B0B0B" />
      <text x="67" y="86" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="9" fill="#0B0B0B">02</text>
    </svg>
  );
}
