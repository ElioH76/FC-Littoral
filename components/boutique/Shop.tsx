"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Check,
  Info,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import type { OrderLine, Product, ProductCategory } from "@/types";
import { Button } from "@/components/ui/button";

const CATEGORY_ORDER: ProductCategory[] = ["Maillots", "Textile", "Accessoires"];

function formatPrice(price: number | null): string {
  return price == null ? "—" : `${price} €`;
}

let lineCounter = 0;
const nextId = () => `${Date.now()}-${lineCounter++}`;

interface CartLine extends OrderLine {
  id: string;
}

export function Shop({ products }: { products: Product[] }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    team: "",
    note: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const bySlug = useMemo(
    () => Object.fromEntries(products.map((p) => [p.slug, p])),
    [products],
  );

  const grouped = useMemo(
    () =>
      CATEGORY_ORDER.map((cat) => ({
        cat,
        items: products.filter((p) => p.category === cat),
      })).filter((g) => g.items.length > 0),
    [products],
  );

  function addProduct(product: Product, qty: number) {
    const additions: CartLine[] = Array.from({ length: qty }, () => ({
      id: nextId(),
      slug: product.slug,
      name: product.name,
      size: product.sizes[0] ?? "Taille unique",
      initials: "",
    }));
    setLines((prev) => [...prev, ...additions]);
    // Amène l'utilisateur vers le panier
    requestAnimationFrame(() => {
      document.getElementById("panier")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function updateLine(id: string, patch: Partial<OrderLine>) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function removeLine(id: string) {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }

  const total = useMemo(() => {
    if (lines.length === 0) return null;
    let sum = 0;
    let allKnown = true;
    for (const l of lines) {
      const price = bySlug[l.slug]?.price;
      if (price == null) allKnown = false;
      else sum += price;
    }
    return allKnown ? sum : null;
  }, [lines, bySlug]);

  const canSubmit =
    lines.length > 0 &&
    customer.firstName.trim() !== "" &&
    customer.lastName.trim() !== "" &&
    (customer.phone.trim() !== "" || customer.email.trim() !== "");

  async function submit() {
    if (!canSubmit) return;
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map(({ slug, name, size, initials }) => ({
            slug,
            name,
            size,
            initials,
          })),
          customer,
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      setLines([]);
      setCustomer({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        team: "",
        note: "",
      });
    } catch (e) {
      setStatus("error");
      setError(
        "Impossible d'enregistrer la commande pour le moment. Réessaie ou contacte le club directement.",
      );
    }
  }

  if (status === "success") {
    return (
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-xl rounded-3xl border border-gold/30 bg-ink-800 p-8 text-center md:p-12">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold text-ink">
              <Check className="h-8 w-8" />
            </span>
            <h2 className="mt-6 font-heading text-2xl font-black uppercase text-bone md:text-3xl">
              Commande enregistrée !
            </h2>
            <p className="mt-4 text-bone-dim">
              Merci pour ta commande. Le <b className="text-bone">règlement se fait
              en main propre au club</b>. Les commandes sont regroupées et passées
              une fois par mois : on te recontacte pour la remise et le paiement.
            </p>
            <Button className="mt-8" onClick={() => setStatus("idle")}>
              Passer une nouvelle commande
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        {/* Bandeau d'info */}
        <div className="mb-10 flex items-start gap-3 rounded-2xl border border-gold/25 bg-gold/5 p-4 text-sm text-bone-dim">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
          <p>
            <b className="text-bone">Pas de paiement en ligne.</b> Choisis tes
            articles, indique la taille et les initiales de chacun, puis valide :
            ta commande est transmise au club. Le règlement se fait en main propre
            et les commandes sont groupées une fois par mois pour réduire les frais
            de livraison.
          </p>
        </div>

        {/* Catalogue */}
        {grouped.map(({ cat, items }) => (
          <div key={cat} className="mb-14">
            <h2 className="mb-6 font-heading text-xl font-black uppercase tracking-wide text-bone">
              {cat}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((product) => (
                <ProductCard key={product.slug} product={product} onAdd={addProduct} />
              ))}
            </div>
          </div>
        ))}

        {/* Panier */}
        <div id="panier" className="scroll-mt-24">
          <h2 className="mb-6 flex items-center gap-3 font-heading text-xl font-black uppercase tracking-wide text-bone">
            <ShoppingBag className="h-6 w-6 text-gold" />
            Ma commande
            {lines.length > 0 && (
              <span className="rounded-full bg-gold px-2.5 py-0.5 text-sm text-ink">
                {lines.length}
              </span>
            )}
          </h2>

          {lines.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-bone-dim">
              Ton panier est vide. Ajoute un article ci-dessus pour commencer.
            </p>
          ) : (
            <div className="space-y-3">
              {lines.map((line) => {
                const product = bySlug[line.slug];
                return (
                  <div
                    key={line.id}
                    className="grid grid-cols-[64px_1fr_auto] items-center gap-4 rounded-2xl border border-white/10 bg-ink-800 p-3 sm:grid-cols-[72px_1.4fr_1fr_1fr_auto]"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-ink sm:h-[72px] sm:w-[72px]">
                      {product && (
                        <Image
                          src={product.image}
                          alt={product.imageAlt}
                          fill
                          sizes="72px"
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="truncate font-heading font-bold uppercase text-bone">
                        {line.name}
                      </div>
                      <div className="text-sm text-bone-dim">
                        {formatPrice(product?.price ?? null)}
                      </div>
                    </div>

                    {/* Taille */}
                    <div className="col-span-2 sm:col-span-1">
                      {product && product.sizes.length > 0 ? (
                        <label className="block">
                          <span className="mb-1 block font-heading text-[0.65rem] font-bold uppercase tracking-wider text-bone-dim">
                            Taille
                          </span>
                          <select
                            value={line.size}
                            onChange={(e) => updateLine(line.id, { size: e.target.value })}
                            className="w-full rounded-lg border border-white/15 bg-ink px-3 py-2 text-sm text-bone focus:border-gold focus:outline-none"
                          >
                            {product.sizes.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </label>
                      ) : (
                        <span className="inline-block rounded-lg border border-white/10 px-3 py-2 text-sm text-bone-dim">
                          Taille unique
                        </span>
                      )}
                    </div>

                    {/* Initiales */}
                    <div className="col-span-2 sm:col-span-1">
                      {product?.flocage ? (
                        <label className="block">
                          <span className="mb-1 block font-heading text-[0.65rem] font-bold uppercase tracking-wider text-bone-dim">
                            Initiales <span className="normal-case opacity-70">(option)</span>
                          </span>
                          <input
                            type="text"
                            value={line.initials}
                            maxLength={4}
                            placeholder="EX. EH"
                            onChange={(e) =>
                              updateLine(line.id, {
                                initials: e.target.value.toUpperCase(),
                              })
                            }
                            className="w-full rounded-lg border border-white/15 bg-ink px-3 py-2 text-sm uppercase text-bone placeholder:text-bone-dim/50 focus:border-gold focus:outline-none"
                          />
                        </label>
                      ) : (
                        <span className="hidden text-sm text-bone-dim sm:inline-block sm:py-2">
                          —
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeLine(line.id)}
                      aria-label="Retirer cet article"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-bone-dim transition-colors hover:border-red-500/60 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}

              {/* Total */}
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-ink-800 px-5 py-4">
                <span className="font-heading text-sm font-bold uppercase tracking-wide text-bone-dim">
                  Total estimé
                </span>
                <span className="font-display text-2xl text-gold">
                  {total == null ? "À confirmer au club" : `${total} €`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Coordonnées + envoi */}
        {lines.length > 0 && (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="mb-5 font-heading text-xl font-black uppercase tracking-wide text-bone">
                Tes coordonnées
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Prénom"
                  required
                  value={customer.firstName}
                  onChange={(v) => setCustomer((c) => ({ ...c, firstName: v }))}
                />
                <Field
                  label="Nom"
                  required
                  value={customer.lastName}
                  onChange={(v) => setCustomer((c) => ({ ...c, lastName: v }))}
                />
                <Field
                  label="Téléphone"
                  type="tel"
                  value={customer.phone}
                  onChange={(v) => setCustomer((c) => ({ ...c, phone: v }))}
                />
                <Field
                  label="Email"
                  type="email"
                  value={customer.email}
                  onChange={(v) => setCustomer((c) => ({ ...c, email: v }))}
                />
                <Field
                  label="Équipe / catégorie (option)"
                  value={customer.team}
                  onChange={(v) => setCustomer((c) => ({ ...c, team: v }))}
                />
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block font-heading text-[0.7rem] font-bold uppercase tracking-wider text-bone-dim">
                    Remarque (option)
                  </span>
                  <textarea
                    value={customer.note}
                    rows={3}
                    onChange={(e) => setCustomer((c) => ({ ...c, note: e.target.value }))}
                    className="w-full rounded-lg border border-white/15 bg-ink px-3.5 py-2.5 text-sm text-bone focus:border-gold focus:outline-none"
                  />
                </label>
              </div>
              <p className="mt-3 text-xs text-bone-dim">
                Renseigne au moins un téléphone <b>ou</b> un email pour qu&apos;on
                puisse te recontacter.
              </p>
            </div>

            <div className="lg:pt-11">
              <div className="rounded-2xl border border-white/10 bg-ink-800 p-6">
                <div className="flex items-center justify-between text-sm text-bone-dim">
                  <span>Articles</span>
                  <span className="text-bone">{lines.length}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-bone-dim">
                  <span>Total estimé</span>
                  <span className="text-bone">
                    {total == null ? "À confirmer" : `${total} €`}
                  </span>
                </div>
                <Button
                  className="mt-6 w-full"
                  size="lg"
                  disabled={!canSubmit || status === "submitting"}
                  onClick={submit}
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Envoi…
                    </>
                  ) : (
                    <>Envoyer la commande</>
                  )}
                </Button>
                {!canSubmit && (
                  <p className="mt-3 text-center text-xs text-bone-dim">
                    Complète tes nom, prénom et un moyen de contact.
                  </p>
                )}
                {status === "error" && error && (
                  <p className="mt-3 text-center text-xs text-red-400">{error}</p>
                )}
                <p className="mt-4 text-center text-[0.7rem] leading-relaxed text-bone-dim">
                  Paiement en main propre au club · commandes groupées chaque mois.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (product: Product, qty: number) => void;
}) {
  const [qty, setQty] = useState(1);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-800 transition-all duration-300 hover:-translate-y-1 hover:border-gold">
      <div className="relative aspect-square overflow-hidden bg-black">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 font-heading text-[0.62rem] font-extrabold uppercase tracking-wider text-ink">
            Populaire
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg font-extrabold uppercase text-bone">
            {product.name}
          </h3>
          <span className="shrink-0 font-display text-xl text-gold">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="mt-2 flex-1 text-sm text-bone-dim">{product.description}</p>

        <div className="mt-5 flex items-center gap-3">
          {/* Quantité */}
          <div className="flex items-center rounded-lg border border-white/15">
            <button
              type="button"
              aria-label="Diminuer la quantité"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-10 w-10 items-center justify-center text-bone-dim transition-colors hover:text-gold"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-heading font-bold text-bone">
              {qty}
            </span>
            <button
              type="button"
              aria-label="Augmenter la quantité"
              onClick={() => setQty((q) => Math.min(20, q + 1))}
              className="flex h-10 w-10 items-center justify-center text-bone-dim transition-colors hover:text-gold"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <Button
            className="flex-1"
            onClick={() => {
              onAdd(product, qty);
              setQty(1);
            }}
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-heading text-[0.7rem] font-bold uppercase tracking-wider text-bone-dim">
        {label} {required && <span className="text-gold">*</span>}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/15 bg-ink px-3.5 py-2.5 text-sm text-bone focus:border-gold focus:outline-none"
      />
    </label>
  );
}
