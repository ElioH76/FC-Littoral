import { NextResponse } from "next/server";

import { isAuthenticated } from "@/lib/admin";
import { getAllProducts, saveProducts } from "@/lib/products-store";
import type { Product, ProductCategory } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CATEGORIES: ProductCategory[] = ["Maillots", "Textile", "Accessoires"];

/** Nettoie/valide un produit reçu du client. */
function sanitize(input: unknown): Product | null {
  if (typeof input !== "object" || input === null) return null;
  const p = input as Record<string, unknown>;
  const slug = String(p.slug ?? "").trim();
  const name = String(p.name ?? "").trim();
  const category = p.category as ProductCategory;
  if (!slug || !name || !CATEGORIES.includes(category)) return null;

  const price =
    p.price === null || p.price === undefined || p.price === ""
      ? null
      : Number(p.price);

  return {
    slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    name,
    category,
    description: String(p.description ?? ""),
    image: String(p.image ?? ""),
    imageAlt: String(p.imageAlt ?? name),
    price: price === null || Number.isNaN(price) ? null : price,
    sizes: Array.isArray(p.sizes)
      ? p.sizes.map((s) => String(s).trim()).filter(Boolean)
      : [],
    flocage: Boolean(p.flocage),
    featured: Boolean(p.featured),
    active: p.active === undefined ? true : Boolean(p.active),
    order: Number.isFinite(Number(p.order)) ? Number(p.order) : 0,
  };
}

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  try {
    const products = await getAllProducts();
    return NextResponse.json({ ok: true, products });
  } catch (e) {
    console.error("[admin] échec lecture produits:", e);
    return NextResponse.json({ ok: false, error: "read_failed" }, { status: 502 });
  }
}

/** Upsert d'un produit, OU remplacement complet de la liste (réordonnancement). */
export async function POST(req: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: { product?: unknown; products?: unknown[] };
  try {
    body = (await req.json()) as { product?: unknown; products?: unknown[] };
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    // Remplacement complet (ex. réordonnancement).
    if (Array.isArray(body.products)) {
      const cleaned = body.products.map(sanitize).filter((p): p is Product => p !== null);
      await saveProducts(cleaned);
      return NextResponse.json({ ok: true, products: cleaned });
    }

    // Upsert d'un seul produit.
    const product = sanitize(body.product);
    if (!product) {
      return NextResponse.json({ ok: false, error: "invalid_product" }, { status: 422 });
    }
    const all = await getAllProducts();
    const idx = all.findIndex((p) => p.slug === product.slug);
    if (idx >= 0) {
      all[idx] = product;
    } else {
      product.order = product.order || all.length;
      all.push(product);
    }
    await saveProducts(all);
    return NextResponse.json({ ok: true, products: all });
  } catch (e) {
    console.error("[admin] échec écriture produits:", e);
    return NextResponse.json(
      { ok: false, error: "write_failed", detail: e instanceof Error ? e.message : String(e) },
      { status: 502 },
    );
  }
}

export async function DELETE(req: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  let slug = "";
  try {
    ({ slug } = (await req.json()) as { slug: string });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!slug) return NextResponse.json({ ok: false }, { status: 422 });

  try {
    const all = await getAllProducts();
    const next = all.filter((p) => p.slug !== slug);
    await saveProducts(next);
    return NextResponse.json({ ok: true, products: next });
  } catch (e) {
    console.error("[admin] échec suppression produit:", e);
    return NextResponse.json(
      { ok: false, error: "delete_failed", detail: e instanceof Error ? e.message : String(e) },
      { status: 502 },
    );
  }
}
