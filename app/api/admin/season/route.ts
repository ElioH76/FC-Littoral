import { NextResponse } from "next/server";

import { isAuthenticated } from "@/lib/admin";
import { getFixtures } from "@/lib/data";
import {
  getManualFixtures,
  saveManualFixtures,
} from "@/lib/manual-fixtures-store";
import { getMatchStats, saveMatchStats } from "@/lib/match-stats-store";
import { teams } from "@/data/teams";
import type {
  Fixture,
  ManualFixture,
  MatchPlayerStat,
  MatchType,
  TeamSlug,
} from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TEAM_SLUGS = teams.map((t) => t.slug) as TeamSlug[];
const MATCH_TYPES: MatchType[] = ["championnat", "coupe", "amical"];

function isTeam(v: unknown): v is TeamSlug {
  return typeof v === "string" && TEAM_SLUGS.includes(v as TeamSlug);
}
function isType(v: unknown): v is MatchType {
  return typeof v === "string" && MATCH_TYPES.includes(v as MatchType);
}

/** Score : entier ≥ 0, ou null (pas encore joué). */
function toScore(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Math.trunc(Number(v));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function genId(): string {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Nettoie/valide un match manuel reçu du client. */
function sanitizeFixture(input: unknown): ManualFixture | null {
  if (typeof input !== "object" || input === null) return null;
  const f = input as Record<string, unknown>;
  const slug = f.slug;
  const type = f.type;
  const date = String(f.date ?? "").trim();
  const home = String(f.home ?? "").trim();
  const away = String(f.away ?? "").trim();
  if (!isTeam(slug) || !isType(type)) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  if (!home || !away) return null;

  const id = String(f.id ?? "").trim() || genId();
  const time = String(f.time ?? "").trim() || undefined;
  const venue = String(f.venue ?? "").trim() || undefined;
  const competition =
    String(f.competition ?? "").trim() ||
    (type === "amical" ? "Match amical" : type === "coupe" ? "Coupe" : "Championnat");

  return {
    id,
    slug,
    type,
    date,
    time,
    home,
    away,
    venue,
    competition,
    homeScore: toScore(f.homeScore),
    awayScore: toScore(f.awayScore),
  };
}

/** Nettoie une feuille de match (liste de joueurs + buts/passes). */
function sanitizeMatchPlayers(input: unknown): MatchPlayerStat[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const out: MatchPlayerStat[] = [];
  for (const raw of input) {
    if (typeof raw !== "object" || raw === null) continue;
    const r = raw as Record<string, unknown>;
    const name = String(r.name ?? "").trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    const goals = Math.max(0, Math.trunc(Number(r.goals) || 0));
    const assists = Math.max(0, Math.trunc(Number(r.assists) || 0));
    out.push({ name, goals, assists });
  }
  return out;
}

/** GET → tout ce dont l'admin a besoin : effectifs, matchs (FFF+manuels), feuilles. */
export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  try {
    const rosters: Record<string, { name: string; number?: number }[]> = {};
    const fixtures: Record<string, Fixture[]> = {};

    await Promise.all(
      teams.map(async (t) => {
        rosters[t.slug] = (t.players ?? []).map((p) => ({
          name: p.name,
          number: p.number,
        }));
        fixtures[t.slug] = await getFixtures(t.slug, { fresh: true });
      }),
    );

    const matchStats = await getMatchStats(true);

    return NextResponse.json({
      ok: true,
      teams: teams.map((t) => ({ slug: t.slug, name: t.name })),
      rosters,
      fixtures,
      matchStats,
    });
  } catch (e) {
    console.error("[admin] échec lecture saison:", e);
    return NextResponse.json({ ok: false, error: "read_failed" }, { status: 502 });
  }
}

export async function POST(req: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const action = String(body.action ?? "");

  try {
    /* ---- Ajout / édition d'un match manuel ---- */
    if (action === "saveFixture") {
      const fixture = sanitizeFixture(body.fixture);
      if (!fixture) {
        return NextResponse.json(
          { ok: false, error: "invalid_fixture" },
          { status: 422 },
        );
      }
      const all = await getManualFixtures(true);
      const idx = all.findIndex((m) => m.id === fixture.id);
      if (idx >= 0) all[idx] = fixture;
      else all.push(fixture);
      await saveManualFixtures(all);
      return NextResponse.json({ ok: true, fixture });
    }

    /* ---- Suppression d'un match manuel (+ sa feuille) ---- */
    if (action === "deleteFixture") {
      const id = String(body.id ?? "").trim();
      if (!id) return NextResponse.json({ ok: false }, { status: 422 });
      const all = await getManualFixtures(true);
      await saveManualFixtures(all.filter((m) => m.id !== id));
      // purge la feuille de match associée si présente
      const stats = await getMatchStats(true);
      if (stats[id]) {
        delete stats[id];
        await saveMatchStats(stats);
      }
      return NextResponse.json({ ok: true });
    }

    /* ---- Saisie de la feuille d'un match (FFF ou manuel) ---- */
    if (action === "saveMatchStat") {
      const id = String(body.id ?? "").trim();
      if (!id) return NextResponse.json({ ok: false }, { status: 422 });
      const players = sanitizeMatchPlayers(body.players);
      const stats = await getMatchStats(true);
      if (players.length === 0) delete stats[id];
      else stats[id] = { players };
      await saveMatchStats(stats);
      return NextResponse.json({ ok: true, players });
    }

    return NextResponse.json({ ok: false, error: "unknown_action" }, { status: 400 });
  } catch (e) {
    console.error("[admin] échec écriture saison:", e);
    return NextResponse.json(
      { ok: false, error: "write_failed", detail: e instanceof Error ? e.message : String(e) },
      { status: 502 },
    );
  }
}
