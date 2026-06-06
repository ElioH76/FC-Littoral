import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <section className="bg-ink text-white">
      <div className="container flex min-h-[70vh] flex-col items-center justify-center text-center">
        <Logo size={80} />
        <p className="mt-8 font-display text-7xl text-gold">404</p>
        <h1 className="mt-2 text-3xl">Page introuvable</h1>
        <p className="mt-3 max-w-md text-white/70">
          La page que vous cherchez a peut-être été déplacée ou n&apos;existe
          plus. Retournons sur le terrain !
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    </section>
  );
}
