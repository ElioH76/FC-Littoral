import { NextResponse } from "next/server";

import type { Order } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Réception d'une commande boutique.
 *
 * La commande est transmise à un webhook Google Apps Script (variable
 * d'environnement `ORDER_WEBHOOK_URL`) qui ajoute une ligne dans un Google
 * Sheet et envoie un email au club. Voir docs/BOUTIQUE.md pour la mise en place.
 *
 * Si le webhook n'est pas configuré, la commande est tout de même journalisée
 * côté serveur (filet de sécurité), mais pense à configurer `ORDER_WEBHOOK_URL`
 * en production.
 */
export async function POST(req: Request) {
  let order: Order;
  try {
    order = (await req.json()) as Order;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Validation minimale côté serveur.
  const c = order?.customer;
  if (!order?.items?.length || !c?.firstName?.trim() || !c?.lastName?.trim()) {
    return NextResponse.json({ ok: false, error: "invalid_order" }, { status: 422 });
  }
  if (!c.phone?.trim() && !c.email?.trim()) {
    return NextResponse.json({ ok: false, error: "no_contact" }, { status: 422 });
  }

  // Trace serveur : filet de sécurité si le webhook échoue.
  console.log("[commande boutique]", JSON.stringify(order));

  const webhook = process.env.ORDER_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        body: JSON.stringify({ ...order, token: process.env.ORDER_WEBHOOK_TOKEN ?? "" }),
      });
      if (!res.ok) throw new Error(`webhook ${res.status}`);
      // Le script Apps Script répond toujours HTTP 200 : on doit vérifier le
      // corps pour distinguer un vrai succès d'un refus (ex. token invalide).
      const text = await res.text();
      let data: { ok?: boolean; error?: string };
      try {
        data = JSON.parse(text) as { ok?: boolean; error?: string };
      } catch {
        throw new Error("réponse inattendue du webhook (pas du JSON)");
      }
      if (!data.ok) throw new Error(`webhook refusé: ${data.error ?? "inconnu"}`);
    } catch (e) {
      console.error("[commande boutique] échec du webhook:", e);
      return NextResponse.json(
        { ok: false, error: "webhook_failed" },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({ ok: true, stored: Boolean(webhook) });
}
