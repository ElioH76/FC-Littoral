import { NextResponse } from "next/server";

/**
 * Route de DIAGNOSTIC temporaire : teste l'accès à l'API DOFA (FFF) depuis
 * l'environnement d'exécution (Vercel vs local) avec deux jeux d'en-têtes.
 * À SUPPRIMER une fois le problème résolu.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BASE = "https://api-dofa.fff.fr/api";

async function probe(path: string, headers: Record<string, string>) {
  const started = Date.now();
  try {
    const res = await fetch(`${BASE}${path}`, { headers, cache: "no-store" });
    const text = await res.text();
    let kind = "?";
    try {
      const j = JSON.parse(text);
      kind = Array.isArray(j) ? `array(${j.length})` : typeof j;
    } catch {
      /* not json */
    }
    return {
      status: res.status,
      ok: res.ok,
      ms: Date.now() - started,
      len: text.length,
      kind,
      contentType: res.headers.get("content-type"),
      preview: text.slice(0, 220),
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e), ms: Date.now() - started };
  }
}

export async function GET() {
  const basic = {
    "User-Agent": "Mozilla/5.0",
    Accept: "application/json",
    Referer: "https://www.fff.fr/",
  };
  const browser = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "fr-FR,fr;q=0.9",
    Referer: "https://www.fff.fr/",
    Origin: "https://www.fff.fr",
  };

  const body = {
    region: process.env.VERCEL_REGION ?? "local",
    node: process.version,
    equipes_basic: await probe("/clubs/100405/equipes", basic),
    equipes_browser: await probe("/clubs/100405/equipes", browser),
  };

  return NextResponse.json(body, { headers: { "cache-control": "no-store" } });
}
