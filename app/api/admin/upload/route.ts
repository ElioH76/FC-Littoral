import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

import { isAuthenticated } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024; // 5 Mo
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { ok: false, error: "blob_not_configured" },
      { status: 503 },
    );
  }

  let file: File | null = null;
  try {
    const form = await req.formData();
    const f = form.get("file");
    if (f instanceof File) file = f;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!file) return NextResponse.json({ ok: false, error: "no_file" }, { status: 400 });
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ ok: false, error: "bad_type" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  try {
    const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
    const blob = await put(`boutique/${Date.now()}.${ext}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (e) {
    console.error("[admin] échec upload image:", e);
    return NextResponse.json({ ok: false, error: "upload_failed" }, { status: 502 });
  }
}
