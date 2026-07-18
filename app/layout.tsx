import type { Metadata } from "next";
import { Anton, Archivo, Manrope, Caveat } from "next/font/google";

import "./globals.css";
import { club } from "@/data/club";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BoutiqueTab } from "@/components/layout/BoutiqueTab";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://fclittoral.fr"),
  title: {
    default: `${club.name} — ${club.slogan}`,
    template: `%s | ${club.name}`,
  },
  description: club.description,
  keywords: [
    "F.C. Littoral",
    "football amateur",
    "club de football",
    "U13",
    "seniors",
    "vétérans",
  ],
  openGraph: {
    title: `${club.name} — ${club.slogan}`,
    description: club.description,
    type: "website",
    locale: "fr_FR",
    siteName: club.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${club.name} — ${club.slogan}`,
    description: club.description,
  },
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <BoutiqueTab />
      </body>
    </html>
  );
}
