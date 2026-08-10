// @ts-nocheck
/**
 * Synchronisation des données FFF (calendrier / classement) → snapshot repo.
 *
 * Pourquoi : l'API FFF (DOFA) bloque les IP cloud (Vercel, GitHub Actions…),
 * donc la prod ne peut pas l'appeler. Ce script tourne depuis une IP
 * RÉSIDENTIELLE (ton PC), récupère la FFF, réécrit `data/season-snapshot.json`,
 * puis commit + push → Vercel redéploie avec les données à jour.
 *
 * Usage : `npm run sync:fff`  (à lancer après chaque journée de championnat).
 */

import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SNAPSHOT = join(ROOT, "data", "season-snapshot.json");

const BASE = "https://api-dofa.fff.fr/api";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  // ⚠️ Accept STRICT "application/json" : avec un Accept plus large, DOFA
  // répond en JSON-LD/Hydra ({ "hydra:member": [...] }) au lieu d'un tableau.
  Accept: "application/json",
  "Accept-Language": "fr-FR,fr;q=0.9",
  Referer: "https://www.fff.fr/",
};

const CLUB_ID = 100405;
const CLUB_NAME = "F.C. Littoral";
// Doit rester aligné avec lib/season-config.ts
const TEAMS = [
  { slug: "seniors", category: "SEM", teamNumber: 2 },
  { slug: "u13", category: "U13", teamNumber: 3 },
];

async function dofaRaw(path) {
  const res = await fetch(`${BASE}${path}`, { headers: HEADERS });
  if (!res.ok) {
    throw new Error(
      `DOFA ${path} → HTTP ${res.status}. ` +
        (res.status === 403
          ? "IP bloquée par la FFF (tu es peut-être sur un VPN/cloud ?). Lance depuis ta connexion normale."
          : ""),
    );
  }
  return res.json();
}

/**
 * Récupère TOUS les éléments d'une collection DOFA.
 * L'API (API Platform) pagine à 30/page → on suit les pages jusqu'à une page
 * incomplète. Gère le format tableau brut ET JSON-LD (hydra:member).
 */
async function dofaList(path) {
  const items = [];
  for (let page = 1; page <= 50; page++) {
    const sep = path.includes("?") ? "&" : "?";
    const json = await dofaRaw(`${path}${sep}page=${page}`);
    const arr = Array.isArray(json) ? json : json?.["hydra:member"] ?? [];
    items.push(...arr);
    if (arr.length < 30) break; // dernière page atteinte
  }
  return items;
}

async function resolvePoule(category, teamNumber) {
  const equipes = await dofaList(`/clubs/${CLUB_ID}/equipes`);
  if (!Array.isArray(equipes) || equipes.length === 0) return null;
  const eq =
    equipes.find((e) => e.category_code === category && e.number === teamNumber) ??
    equipes.find((e) => e.category_code === category) ??
    equipes[0];
  const champ =
    (eq.engagements ?? []).find((en) => en.competition?.type === "CH") ??
    eq.engagements?.[0];
  const cp = champ?.competition?.cp_no;
  const phase = champ?.phase?.number;
  const poule = champ?.poule?.stage_number;
  if (cp == null || phase == null || poule == null) return null;
  return { cp, phase, poule };
}

function mapFixture(m) {
  const played = m.home_score != null && m.away_score != null;
  const journee = m.poule_journee?.number;
  const homeUs = m.home?.club?.cl_no === CLUB_ID;
  const awayUs = m.away?.club?.cl_no === CLUB_ID;
  const f = {
    id: String(m.ma_no),
    date: (m.date ?? "").slice(0, 10),
    home: homeUs ? CLUB_NAME : m.home?.short_name ?? "—",
    away: awayUs ? CLUB_NAME : m.away?.short_name ?? "—",
    competition: `${m.competition?.name ?? "Championnat"}${journee ? ` • J${journee}` : ""}`,
    type: "championnat",
  };
  if (m.time) f.time = m.time;
  const homeLogo = homeUs ? "/logo.png" : m.home?.club?.logo;
  const awayLogo = awayUs ? "/logo.png" : m.away?.club?.logo;
  if (homeLogo) f.homeLogo = homeLogo;
  if (awayLogo) f.awayLogo = awayLogo;
  if (played) {
    f.homeScore = m.home_score;
    f.awayScore = m.away_score;
  }
  const venue = m.terrain?.name
    ? `${m.terrain.name}${m.terrain.city ? `, ${m.terrain.city}` : ""}`
    : undefined;
  if (venue) f.venue = venue;
  return f;
}

function mapStandings(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return [];
  const maxCj = Math.max(...rows.map((r) => r.cj_no ?? 0));
  return rows
    .filter((r) => (r.cj_no ?? 0) === maxCj)
    .sort((a, b) => a.rank - b.rank)
    .map((r) => ({
      rank: r.rank,
      team: r.equipe?.club?.cl_no === CLUB_ID ? CLUB_NAME : r.equipe?.short_name ?? "—",
      played: r.total_games_count ?? 0,
      won: r.won_games_count ?? 0,
      drawn: r.draw_games_count ?? 0,
      lost: r.lost_games_count ?? 0,
      goalsFor: r.goals_for_count ?? 0,
      goalsAgainst: r.goals_against_count ?? 0,
      points: r.point_count ?? 0,
    }));
}

async function syncTeam(t) {
  const p = await resolvePoule(t.category, t.teamNumber);
  if (!p) {
    console.warn(`  ⚠️  [${t.slug}] engagement championnat introuvable → vide`);
    return { fixtures: [], standings: [] };
  }
  const [matchs, classement] = await Promise.all([
    dofaList(`/compets/${p.cp}/phases/${p.phase}/poules/${p.poule}/matchs`),
    dofaList(
      `/compets/${p.cp}/phases/${p.phase}/poules/${p.poule}/classement_journees`,
    ).catch(() => []),
  ]);
  const fixtures = (matchs ?? [])
    .filter(
      (m) => m.home?.club?.cl_no === CLUB_ID || m.away?.club?.cl_no === CLUB_ID,
    )
    .map(mapFixture)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const standings = mapStandings(classement);
  console.log(`  ✓ [${t.slug}] ${fixtures.length} matchs · ${standings.length} lignes de classement`);
  return { fixtures, standings };
}

function git(args) {
  return execSync(`git ${args}`, { cwd: ROOT, encoding: "utf8" });
}

async function main() {
  console.log("⏳ Récupération des données FFF (DOFA)…");

  let existingTeams = {};
  try {
    existingTeams = JSON.parse(readFileSync(SNAPSHOT, "utf8")).teams ?? {};
  } catch {
    /* fichier absent/illisible → on repart de zéro */
  }

  const teams = {};
  for (const t of TEAMS) teams[t.slug] = await syncTeam(t);

  // On ne réécrit / ne pousse QUE si les vraies données ont changé (on ignore
  // `syncedAt` : sinon chaque run créerait un commit + déploiement inutile).
  if (JSON.stringify(teams) === JSON.stringify(existingTeams)) {
    console.log("✅ Données FFF inchangées — rien à faire.");
    return;
  }

  const snapshot = { syncedAt: new Date().toISOString(), teams };
  writeFileSync(SNAPSHOT, JSON.stringify(snapshot, null, 2) + "\n");
  console.log("📝 Snapshot mis à jour : data/season-snapshot.json");

  git("add data/season-snapshot.json");
  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
  execSync(`git commit -m "data(saison): sync FFF ${stamp}"`, { cwd: ROOT, stdio: "inherit" });
  try {
    execSync("git push", { cwd: ROOT, stdio: "inherit" });
    console.log("🚀 Poussé — Vercel va redéployer avec les données à jour.");
  } catch {
    console.warn("⚠️  git push a échoué (hors ligne ?). Le snapshot est committé, pousse-le plus tard.");
  }
}

main().catch((e) => {
  console.error("❌ Échec de la synchro :", e.message);
  process.exit(1);
});
