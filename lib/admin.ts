import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import type { AdminOrder, OrderStatus } from "@/types";

/**
 * Auth admin minimaliste (adaptée à un club) :
 * - un seul mot de passe partagé dans `ADMIN_PASSWORD`,
 * - une fois connecté, un cookie httpOnly signé (HMAC du mot de passe) prouve
 *   la session. Sans le mot de passe côté serveur, le cookie est infalsifiable.
 *
 * Ce n'est pas une auth « niveau banque », mais c'est suffisant pour protéger
 * l'accès aux commandes d'un petit club.
 */

export const ADMIN_COOKIE = "fcl_admin";
const SESSION_MSG = "fclittoral-admin-v1";

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

/** Jeton de session = HMAC(mot de passe, message fixe). */
export function sessionToken(): string {
  return createHmac("sha256", adminPassword()).update(SESSION_MSG).digest("hex");
}

/** Vérifie le mot de passe soumis au login. */
export function checkPassword(password: string): boolean {
  const secret = adminPassword();
  return secret.length > 0 && safeEqual(password, secret);
}

/** L'appelant est-il authentifié (cookie de session valide) ? */
export function isAuthenticated(): boolean {
  if (adminPassword().length === 0) return false;
  const cookie = cookies().get(ADMIN_COOKIE)?.value;
  return Boolean(cookie) && safeEqual(cookie as string, sessionToken());
}

/* ----------------------- Accès Apps Script (Sheet) ----------------------- */

function webhookUrl(): string | null {
  return process.env.ORDER_WEBHOOK_URL || null;
}

function webhookToken(): string {
  return process.env.ORDER_WEBHOOK_TOKEN ?? "";
}

/** Récupère toutes les commandes depuis le Google Sheet (via Apps Script). */
export async function fetchOrders(): Promise<AdminOrder[]> {
  const url = webhookUrl();
  if (!url) throw new Error("ORDER_WEBHOOK_URL non configuré");
  const qs = new URLSearchParams({ action: "list", token: webhookToken() });
  const res = await fetch(`${url}?${qs.toString()}`, {
    method: "GET",
    redirect: "follow",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`webhook list ${res.status}`);
  const data = (await res.json()) as { ok: boolean; orders?: AdminOrder[] };
  if (!data.ok) throw new Error("webhook list refusé");
  return data.orders ?? [];
}

/** Met à jour le statut d'une commande dans le Google Sheet. */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<void> {
  const url = webhookUrl();
  if (!url) throw new Error("ORDER_WEBHOOK_URL non configuré");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    redirect: "follow",
    body: JSON.stringify({
      action: "updateStatus",
      token: webhookToken(),
      orderId,
      status,
    }),
  });
  if (!res.ok) throw new Error(`webhook update ${res.status}`);
  const data = (await res.json()) as { ok: boolean };
  if (!data.ok) throw new Error("webhook update refusé");
}
