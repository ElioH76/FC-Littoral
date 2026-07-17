import type { Product } from "@/types";

/**
 * Catalogue de la boutique du club.
 *
 * 👉 À COMPLÉTER PAR TOI :
 *   - `price` : mets le tarif en euros (nombre). Laisse `null` si le prix
 *     n'est pas encore fixé → le site affichera « Tarif au club ».
 *   - `sizes` : ajuste les tailles proposées. Tableau vide `[]` = taille unique.
 *   - `flocage` : `true` si l'article peut être personnalisé aux initiales.
 *
 * Pas de paiement en ligne : la commande est enregistrée puis réglée en main
 * propre au club. Les commandes sont regroupées une fois par mois.
 */

// Tailles vêtements (enfant + adulte). À adapter selon ton fournisseur.
const APPAREL_SIZES = [
  "6 ans",
  "8 ans",
  "10 ans",
  "12 ans",
  "14 ans",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
];

export const products: Product[] = [
  {
    slug: "maillot-domicile",
    name: "Maillot domicile",
    category: "Maillots",
    description:
      "Le maillot officiel or et vert, floqué MAKI9SPORT. Short et chaussettes assortis. Personnalisable au dos.",
    image: "/boutique/maillot-domicile.webp",
    imageAlt: "Maillot domicile F.C. Littoral or et vert, face et dos",
    price: 45,
    sizes: APPAREL_SIZES,
    flocage: true,
    featured: true,
  },
  {
    slug: "maillot-gardien",
    name: "Maillot gardien",
    category: "Maillots",
    description:
      "La tunique des derniers remparts, dans un coloris distinctif aux couleurs du club.",
    image: "/boutique/maillot-gardien.webp",
    imageAlt: "Maillot gardien F.C. Littoral, face et dos",
    price: 45,
    sizes: APPAREL_SIZES,
    flocage: true,
  },
  {
    slug: "kit-training",
    name: "Ensemble training",
    category: "Maillots",
    description:
      "L'ensemble d'entraînement (maillot + short) aux couleurs du club, idéal pour les séances et les échauffements.",
    image: "/boutique/kit-training.webp",
    imageAlt: "Ensemble training F.C. Littoral blanc, vert et or",
    price: 45,
    sizes: APPAREL_SIZES,
    flocage: true,
    featured: true,
  },
  {
    slug: "survetement",
    name: "Survêtement",
    category: "Textile",
    description:
      "Le survêtement du club (veste + pantalon), pour représenter le Littoral avant et après les matchs.",
    image: "/boutique/survetement.webp",
    imageAlt: "Survêtement F.C. Littoral",
    price: 55,
    sizes: APPAREL_SIZES,
    flocage: true,
  },
  {
    slug: "coupe-vent",
    name: "Coupe-vent",
    category: "Textile",
    description:
      "Le K-way coupe-vent léger et imperméable, parfait pour les bords de terrain les jours de pluie.",
    image: "/boutique/coupe-vent.webp",
    imageAlt: "Coupe-vent F.C. Littoral",
    price: 55,
    sizes: APPAREL_SIZES,
    flocage: true,
  },
  {
    slug: "polo",
    name: "Polo",
    category: "Textile",
    description:
      "Le polo du club, élégant et confortable, aux couleurs et à l'écusson du F.C. Littoral.",
    image: "/boutique/polo.webp",
    imageAlt: "Polo F.C. Littoral",
    price: 25,
    sizes: APPAREL_SIZES,
    flocage: true,
  },
  {
    slug: "sac-de-sport",
    name: "Sac de sport",
    category: "Accessoires",
    description:
      "Le sac de sport floqué de l'écusson, assez grand pour tout l'équipement de match.",
    image: "/boutique/sac-de-sport.webp",
    imageAlt: "Sac de sport F.C. Littoral",
    price: 30,
    sizes: [],
    flocage: false,
  },
  {
    slug: "bonnet",
    name: "Bonnet",
    category: "Accessoires",
    description:
      "Le bonnet du club pour affronter l'hiver au bord du terrain, aux couleurs du Littoral.",
    image: "/boutique/bonnet.webp",
    imageAlt: "Bonnet F.C. Littoral",
    price: 15,
    sizes: [],
    flocage: false,
  },
  {
    slug: "casquette",
    name: "Casquette",
    category: "Accessoires",
    description:
      "La casquette brodée de l'écusson, pour les journées ensoleillées de match.",
    image: "/boutique/casquette.webp",
    imageAlt: "Casquette F.C. Littoral",
    price: 15,
    sizes: [],
    flocage: false,
  },
];
