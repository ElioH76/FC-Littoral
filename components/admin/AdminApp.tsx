"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Loader2,
  LogOut,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  ShoppingBag,
  Users,
} from "lucide-react";

import { ORDER_STATUSES, type AdminOrder, type OrderStatus } from "@/types";
import { Button } from "@/components/ui/button";

type Phase = "loading" | "login" | "ready";

const STATUS_STYLES: Record<OrderStatus, string> = {
  "En attente": "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Commandée: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  "En attente de paiement": "bg-orange-500/15 text-orange-300 border-orange-500/30",
  "Payée / récupérée": "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Annulée: "bg-red-500/15 text-red-300 border-red-500/30",
};

export function AdminApp() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "Tous">("Tous");
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoadError(null);
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      if (res.status === 401) {
        setPhase("login");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { orders: AdminOrder[] };
      const sorted = [...data.orders].sort((a, b) =>
        b.date.localeCompare(a.date),
      );
      setOrders(sorted);
      setPhase("ready");
    } catch {
      setLoadError(
        "Impossible de charger les commandes. Vérifie la configuration du webhook.",
      );
      setPhase("ready");
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { Tous: orders.length };
    for (const s of ORDER_STATUSES) c[s] = 0;
    for (const o of orders) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [orders]);

  const visible = useMemo(
    () => (filter === "Tous" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter],
  );

  async function changeStatus(orderId: string, status: OrderStatus) {
    const previous = orders;
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status } : o)),
    );
    try {
      const res = await fetch("/api/admin/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setOrders(previous); // rollback
      alert("La mise à jour du statut a échoué. Réessaie.");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setPhase("login");
    setOrders([]);
  }

  if (phase === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  if (phase === "login") {
    return <Login onSuccess={loadOrders} />;
  }

  return (
    <div className="section">
      <div className="container">
        {/* En-tête */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="eyebrow mb-2">Espace réservé</span>
            <h1 className="font-heading text-3xl font-black uppercase text-bone md:text-4xl">
              Commandes boutique
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadOrders}>
              <RefreshCw className="h-4 w-4" />
              Rafraîchir
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>

        {loadError && (
          <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {loadError}
          </p>
        )}

        {/* Filtres */}
        <div className="mb-8 flex flex-wrap gap-2">
          {(["Tous", ...ORDER_STATUSES] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`rounded-full border px-4 py-2 font-heading text-xs font-bold uppercase tracking-wide transition-colors ${
                filter === s
                  ? "border-gold bg-gold text-ink"
                  : "border-white/15 text-bone-dim hover:border-gold/50 hover:text-bone"
              }`}
            >
              {s} <span className="opacity-70">({counts[s] ?? 0})</span>
            </button>
          ))}
        </div>

        {/* Liste */}
        {visible.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-bone-dim">
            Aucune commande {filter !== "Tous" && `« ${filter} »`} pour le moment.
          </p>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {visible.map((order) => (
              <OrderCard
                key={order.orderId}
                order={order}
                onStatusChange={changeStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({
  order,
  onStatusChange,
}: {
  order: AdminOrder;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-ink-800 p-5">
      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="font-heading text-lg font-black uppercase text-bone">
            {order.firstName} {order.lastName}
          </div>
          <div className="mt-0.5 text-xs text-bone-dim">
            {order.date} · #{order.orderId}
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full border px-3 py-1 font-heading text-[0.62rem] font-extrabold uppercase tracking-wider ${
            STATUS_STYLES[order.status] ?? STATUS_STYLES["En attente"]
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Contact */}
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 py-4 text-sm text-bone-dim">
        {order.phone && (
          <a
            href={`tel:${order.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-1.5 hover:text-gold"
          >
            <Phone className="h-3.5 w-3.5 text-gold" />
            {order.phone}
          </a>
        )}
        {order.email && (
          <a
            href={`mailto:${order.email}`}
            className="inline-flex items-center gap-1.5 hover:text-gold"
          >
            <Mail className="h-3.5 w-3.5 text-gold" />
            {order.email}
          </a>
        )}
        {order.team && (
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-gold" />
            {order.team}
          </span>
        )}
      </div>

      {/* Articles */}
      <ul className="flex-1 space-y-2 border-t border-white/10 py-4">
        {order.items.map((it, i) => (
          <li
            key={i}
            className="flex items-center justify-between gap-3 text-sm text-bone"
          >
            <span className="inline-flex items-center gap-2">
              <ShoppingBag className="h-3.5 w-3.5 text-bone-dim" />
              {it.name}
            </span>
            <span className="text-bone-dim">
              {it.size}
              {it.initials && (
                <span className="ml-2 rounded bg-gold/15 px-1.5 py-0.5 font-heading text-[0.65rem] font-bold uppercase text-gold">
                  {it.initials}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>

      {order.note && (
        <p className="mb-3 rounded-lg bg-ink px-3 py-2 text-xs italic text-bone-dim">
          « {order.note} »
        </p>
      )}

      {/* Changement de statut */}
      <label className="mt-auto block">
        <span className="mb-1.5 block font-heading text-[0.62rem] font-bold uppercase tracking-wider text-bone-dim">
          Changer le statut
        </span>
        <select
          value={order.status}
          onChange={(e) =>
            onStatusChange(order.orderId, e.target.value as OrderStatus)
          }
          className="w-full rounded-lg border border-white/15 bg-ink px-3 py-2.5 text-sm text-bone focus:border-gold focus:outline-none"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        setError("Mot de passe incorrect.");
      }
    } catch {
      setError("Une erreur est survenue. Réessaie.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-ink-800 p-8"
      >
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold text-ink">
          <Lock className="h-6 w-6" />
        </span>
        <h1 className="text-center font-heading text-2xl font-black uppercase text-bone">
          Espace admin
        </h1>
        <p className="mt-2 text-center text-sm text-bone-dim">
          Accès réservé au club.
        </p>
        <label className="mt-6 block">
          <span className="mb-1.5 block font-heading text-[0.7rem] font-bold uppercase tracking-wider text-bone-dim">
            Mot de passe
          </span>
          <input
            type="password"
            value={password}
            autoFocus
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-ink px-3.5 py-2.5 text-bone focus:border-gold focus:outline-none"
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <Button type="submit" className="mt-6 w-full" disabled={busy || !password}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
