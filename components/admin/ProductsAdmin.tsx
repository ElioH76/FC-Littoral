"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Loader2,
  LogOut,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import type { Product, ProductCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Login } from "@/components/admin/Login";
import { AdminTabs } from "@/components/admin/AdminTabs";

type Phase = "loading" | "login" | "ready";

const CATEGORIES: ProductCategory[] = ["Maillots", "Textile", "Accessoires"];

const BLANK: Product = {
  slug: "",
  name: "",
  category: "Maillots",
  description: "",
  image: "",
  imageAlt: "",
  price: null,
  sizes: [],
  flocage: false,
  featured: false,
  active: true,
  order: 0,
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductsAdmin() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/admin/products", { cache: "no-store" });
      if (res.status === 401) {
        setPhase("login");
        return;
      }
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { products: Product[] };
      setProducts(data.products);
      setPhase("ready");
    } catch {
      setError("Impossible de charger les produits.");
      setPhase("ready");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setPhase("login");
  }

  function openNew() {
    setEditing({ ...BLANK, order: products.length });
    setIsNew(true);
  }
  function openEdit(p: Product) {
    setEditing({ ...p });
    setIsNew(false);
  }

  async function toggleActive(p: Product) {
    const updated = { ...p, active: p.active === false };
    setProducts((prev) => prev.map((x) => (x.slug === p.slug ? updated : x)));
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product: updated }),
    }).catch(() => load());
  }

  async function remove(p: Product) {
    if (!confirm(`Supprimer « ${p.name} » ? Cette action est définitive.`)) return;
    setProducts((prev) => prev.filter((x) => x.slug !== p.slug));
    const res = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: p.slug }),
    });
    if (!res.ok) load();
  }

  async function onSaved(saved: Product[]) {
    setProducts(saved);
    setEditing(null);
  }

  if (phase === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }
  if (phase === "login") return <Login onSuccess={load} />;

  return (
    <div className="section">
      <div className="container">
        <div className="mb-6 flex items-center justify-between gap-4">
          <AdminTabs />
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="eyebrow mb-2">Espace réservé</span>
            <h1 className="font-heading text-3xl font-black uppercase text-bone md:text-4xl">
              Produits ({products.length})
            </h1>
          </div>
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" />
            Ajouter un produit
          </Button>
        </div>

        {error && (
          <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="grid gap-4">
          {products.map((p) => (
            <div
              key={p.slug}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-ink-800 p-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image || "/logo.png"}
                alt=""
                className="h-16 w-16 shrink-0 rounded-lg bg-ink object-cover"
              />
              <div className="min-w-[180px] flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold uppercase text-bone">
                    {p.name}
                  </span>
                  {p.featured && (
                    <span className="rounded bg-gold/15 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase text-gold">
                      En avant
                    </span>
                  )}
                </div>
                <div className="text-xs text-bone-dim">
                  {p.category} · {p.price != null ? `${p.price} €` : "Prix à confirmer"}
                  {p.sizes.length > 0 && ` · ${p.sizes.length} tailles`}
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleActive(p)}
                className={`rounded-full border px-3 py-1.5 font-heading text-[0.65rem] font-bold uppercase tracking-wide transition-colors ${
                  p.active === false
                    ? "border-white/15 text-bone-dim hover:text-bone"
                    : "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                }`}
              >
                {p.active === false ? "Désactivé" : "Actif"}
              </button>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(p)}>
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => remove(p)}
                  className="border-red-500/30 text-red-300 hover:bg-red-500/10 hover:text-red-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <ProductEditor
          product={editing}
          isNew={isNew}
          existingSlugs={products.map((p) => p.slug)}
          onClose={() => setEditing(null)}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}

function ProductEditor({
  product,
  isNew,
  existingSlugs,
  onClose,
  onSaved,
}: {
  product: Product;
  isNew: boolean;
  existingSlugs: string[];
  onClose: () => void;
  onSaved: (all: Product[]) => void;
}) {
  const [p, setP] = useState<Product>(product);
  const [sizesText, setSizesText] = useState(product.sizes.join(", "));
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof Product>(key: K, value: Product[K]) {
    setP((prev) => ({ ...prev, [key]: value }));
  }

  async function upload(file: File) {
    setUploading(true);
    setErr(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = (await res.json()) as { ok: boolean; url?: string; error?: string };
      if (!res.ok || !data.ok || !data.url) {
        setErr(
          data.error === "blob_not_configured"
            ? "Stockage d'images non activé (Vercel Blob). Voir la doc."
            : "Échec de l'upload de l'image.",
        );
        return;
      }
      set("image", data.url);
    } catch {
      setErr("Échec de l'upload de l'image.");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    const slug = (p.slug || slugify(p.name)).trim();
    if (!p.name.trim() || !slug) {
      setErr("Le nom est obligatoire.");
      return;
    }
    if (isNew && existingSlugs.includes(slug)) {
      setErr("Un produit avec cet identifiant existe déjà.");
      return;
    }
    const payload: Product = {
      ...p,
      slug,
      imageAlt: p.imageAlt || p.name,
      sizes: sizesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: payload }),
      });
      const data = (await res.json()) as { ok: boolean; products?: Product[]; error?: string };
      if (!res.ok || !data.ok) {
        setErr(
          data.error === "write_failed"
            ? "Enregistrement impossible (Vercel Blob non activé ?)."
            : "Enregistrement impossible.",
        );
        return;
      }
      onSaved(data.products ?? []);
    } catch {
      setErr("Enregistrement impossible.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-2xl rounded-3xl border border-white/10 bg-ink-800 p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-xl font-black uppercase text-bone">
            {isNew ? "Nouveau produit" : "Modifier le produit"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg p-1.5 text-bone-dim hover:bg-white/5 hover:text-bone"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-5">
          {/* Image */}
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.image || "/logo.png"}
              alt=""
              className="h-24 w-24 shrink-0 rounded-xl bg-ink object-cover"
            />
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload(f);
                }}
              />
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Changer la photo
              </Button>
              <p className="mt-2 text-xs text-bone-dim">JPG, PNG ou WebP · max 5 Mo</p>
            </div>
          </div>

          <Field label="Nom">
            <input
              value={p.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputCls}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Catégorie">
              <select
                value={p.category}
                onChange={(e) => set("category", e.target.value as ProductCategory)}
                className={inputCls}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Prix (€) — vide = à confirmer">
              <input
                type="number"
                min="0"
                step="1"
                value={p.price ?? ""}
                onChange={(e) =>
                  set("price", e.target.value === "" ? null : Number(e.target.value))
                }
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              value={p.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className={inputCls}
            />
          </Field>

          <Field label="Tailles (séparées par des virgules — vide = taille unique)">
            <input
              value={sizesText}
              onChange={(e) => setSizesText(e.target.value)}
              placeholder="S, M, L, XL"
              className={inputCls}
            />
          </Field>

          <div className="flex flex-wrap gap-6">
            <Check label="Flocage (initiales)" checked={p.flocage} onChange={(v) => set("flocage", v)} />
            <Check label="Mis en avant" checked={Boolean(p.featured)} onChange={(v) => set("featured", v)} />
            <Check label="Actif (visible)" checked={p.active !== false} onChange={(v) => set("active", v)} />
          </div>

          {err && <p className="text-sm text-red-400">{err}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="button" onClick={save} disabled={busy || uploading}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-white/15 bg-ink px-3.5 py-2.5 text-sm text-bone focus:border-gold focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-heading text-[0.65rem] font-bold uppercase tracking-wider text-bone-dim">
        {label}
      </span>
      {children}
    </label>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-bone">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-gold"
      />
      {label}
    </label>
  );
}
