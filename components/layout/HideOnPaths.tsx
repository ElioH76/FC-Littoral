"use client";

import { usePathname } from "next/navigation";

/** Masque son contenu (rendu côté serveur) sur les chemins donnés et leurs sous-pages. */
export function HideOnPaths({
  paths,
  children,
}: {
  paths: string[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hidden = paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  return hidden ? null : <>{children}</>;
}
