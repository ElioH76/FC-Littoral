import type { Sponsor } from "@/types";

/**
 * Partenaires du club.
 * 👉 Pour ajouter un sponsor : copier un bloc et changer les valeurs.
 * `tier` : "principal" (mis en avant), "officiel", ou "partenaire".
 * `logo` : chemin vers une image dans /public/sponsors ou une URL.
 */
export const sponsors: Sponsor[] = [
  {
    id: "jardins-de-victor",
    name: "Les Jardins de Victor",
    description:
      "Création et entretien d'espaces verts. Partenaire principal et fier supporter du F.C. Littoral depuis plusieurs saisons.",
    website: "https://example.com",
    logo: "/sponsors/jardins-de-victor.svg",
    tier: "principal",
  },
  {
    id: "boulangerie-du-port",
    name: "Boulangerie du Port",
    description:
      "Pains et viennoiseries artisanales. Le goût du fait-maison pour accompagner chaque jour de match.",
    website: "https://example.com",
    logo: "/sponsors/boulangerie-du-port.svg",
    tier: "officiel",
  },
  {
    id: "garage-central",
    name: "Garage Central Auto",
    description:
      "Entretien et réparation toutes marques. Au service des licenciés et supporters du club.",
    website: "https://example.com",
    logo: "/sponsors/garage-central.svg",
    tier: "officiel",
  },
  {
    id: "cafe-des-sports",
    name: "Le Café des Sports",
    description:
      "Le QG des supporters pour vibrer ensemble. Convivialité et bonne humeur garanties.",
    website: "https://example.com",
    logo: "/sponsors/cafe-des-sports.svg",
    tier: "partenaire",
  },
  {
    id: "assurances-littoral",
    name: "Assurances du Littoral",
    description:
      "Votre courtier de proximité. Des solutions sur-mesure pour les familles du club.",
    website: "https://example.com",
    logo: "/sponsors/assurances-littoral.svg",
    tier: "partenaire",
  },
  {
    id: "maki9sport",
    name: "MAKI9SPORT",
    description:
      "Équipementier officiel du F.C. Littoral. Maillots joueur et gardien, shorts et matériel sur-mesure aux couleurs du club.",
    website: "https://example.com",
    logo: "/sponsors/maki9sport.svg",
    tier: "officiel",
  },
];
