import type { Metadata } from "next";
import { Anton, Archivo, Manrope, Caveat } from "next/font/google";

import "./globals.css";
import { club } from "@/data/club";
import { SITE_URL } from "@/lib/seo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HideOnPaths } from "@/components/layout/HideOnPaths";
import { PartnersSection } from "@/components/sections/PartnersSection";

const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const heading = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-heading",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const script = Caveat({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-script",
  display: "swap",
});

const SITE_TITLE = `${club.name} — Club de football à Heuqueville (76)`;
const SITE_DESCRIPTION =
  "Club de football amateur du littoral cauchois (Heuqueville, Saint-Jouin-Bruneval, Cauville-sur-Mer) : U13, Seniors, résultats, calendriers et boutique.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${club.name}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "F.C. Littoral",
    "FC Littoral",
    "club de football",
    "football amateur",
    "Heuqueville",
    "Saint-Jouin-Bruneval",
    "Cauville-sur-Mer",
    "Seine-Maritime",
    "Normandie",
    "U13",
    "seniors",
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "fr_FR",
    siteName: club.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

// Données structurées (schema.org) : aide Google à identifier le club,
// son stade et ses réseaux sociaux.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsClub",
  name: club.name,
  alternateName: club.fullName,
  sport: "Football",
  foundingDate: String(club.founded),
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/opengraph-image.jpg`,
  description: SITE_DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Stade François Maillot",
    postalCode: "76280",
    addressLocality: "Heuqueville",
    addressRegion: "Normandie",
    addressCountry: "FR",
  },
  sameAs: Object.values(club.socials),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${display.variable} ${heading.variable} ${sans.variable} ${script.variable} scroll-smooth`}
    >
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        {/* Partenaires sur toutes les pages (sauf la page dédiée et l'admin) */}
        <HideOnPaths paths={["/sponsors", "/admin"]}>
          <PartnersSection />
        </HideOnPaths>
        <Footer />
      </body>
    </html>
  );
}
