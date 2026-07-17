import { NextResponse } from "next/server";

import { isAuthenticated, updateOrderStatus } from "@/lib/admin";
import { ORDER_STATUSES, type OrderStatus } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let orderId = "";
  let status = "" as OrderStatus;
  try {
    ({ orderId, status } = (await req.json()) as {
      orderId: string;
      status: OrderStatus;
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!orderId || !ORDER_STATUSES.includes(status)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  try {
    await updateOrderStatus(orderId, status);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin] échec mise à jour statut:", e);
    return NextResponse.json({ ok: false, error: "update_failed" }, { status: 502 });
  }
}
