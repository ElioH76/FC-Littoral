import { NextResponse } from "next/server";

import { fetchOrders, isAuthenticated } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  try {
    const orders = await fetchOrders();
    return NextResponse.json({ ok: true, orders });
  } catch (e) {
    console.error("[admin] échec récupération commandes:", e);
    return NextResponse.json({ ok: false, error: "fetch_failed" }, { status: 502 });
  }
}
