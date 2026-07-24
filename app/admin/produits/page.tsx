import type { Metadata } from "next";

import { ProductsAdmin } from "@/components/admin/ProductsAdmin";

export const metadata: Metadata = {
  title: "Produits — Admin",
  robots: { index: false, follow: false },
};

export default function AdminProductsPage() {
  return <ProductsAdmin />;
}
