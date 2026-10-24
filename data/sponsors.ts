import type { Sponsor } from "@/types";

/**
 * Partenaires du club.
 * 👉 Pour ajouter un sponsor : copier un bloc et changer les valeurs.
 * `tier` : "equipementier" (fournisseur des maillots, mis en avant),
 *          "principal", "officiel", ou "partenaire".
 * `logo` : chemin vers une image dans /public/sponsors ou une URL.
 */
export const sponsors: Sponsor[] = [
  {
    id: "lemnos",
    name: "LEMNOS",
    description:
      "Équipementier officiel du F.C. Littoral. Maillots joueur et gardien, shorts et matériel sur-mesure aux couleurs du club.",
    website: "https://lemnos-sportswear.fr/",
    logo: "/sponsors/LEMNOS/LEMNOS.svg",
    tier: "equipementier",
  },
  {
    id: "ets-francois-materiaux",
    name: "Ets François Matériaux",
    website: "https://francoismateriaux.fr/",
    logo: "/sponsors/ETS Materiaux/logo-ETS.png",
    rawLogo: true,
    tier: "partenaire",
  },
  {
    id: "lmo",
    name: "LMO Expertise & Conseil",
    website:
      "https://www.ixi-groupe.com/nos-expertises/ixi-france/annuaire-ixi-france/les-experts-rc/528-cabinet-lmo-expertise",
    logo: "/sponsors/LMO/logo-LMO.jpeg",
    rawLogo: true,
    tier: "partenaire",
  },
];
