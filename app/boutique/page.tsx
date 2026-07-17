import type { Metadata } from "next";

import { getProducts } from "@/lib/data";
import { PageHeader } from "@/components/sections/PageHeader";
import { KitStripe } from "@/components/sections/KitStripe";
import { Shop } from "@/components/boutique/Shop";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "La boutique officielle du F.C. Littoral : maillots, textile et accessoires aux couleurs du club. Commande en ligne, règlement au club.",
};

export default async function BoutiquePage() {
  const products = await getProducts();

  return (
    <>
      <PageHeader
        eyebrow="Les couleurs du club"
        title="Boutique"
        description="Maillots, textile et accessoires officiels du F.C. Littoral. Commande en quelques clics : tu choisis, tu personnalises, et le règlement se fait au club."
      />
      <KitStripe />
      <Shop products={products} />
    </>
  );
}
