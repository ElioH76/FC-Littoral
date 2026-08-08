"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

import { club } from "@/data/club";
import type {
  Fixture,
  ManualFixture,
  MatchPlayerStat,
  MatchStatsStore,
  MatchType,
  TeamSlug,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Login } from "@/components/admin/Login";
import { AdminTabs } from "@/components/admin/AdminTabs";

type Phase = "loading" | "login" | "ready";

interface SeasonData {
  teams: { slug: TeamSlug; name: string }[];
  rosters: Record<string, { name: string; number?: number }[]>;
  fixtures: Record<string, Fixture[]>;
  matchStats: MatchStatsStore;
}

const TYPE_LABELS: Record<MatchType, string> = {
  championnat: "Championnat",
  coupe: "Coupe",
  amical: "Amical",
};

const TYPE_BADGE: Record<MatchType, string> = {
  championnat: "bg-forest/20 text-forest border-forest/40",
  coupe: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  amical: "bg-sky-500/15 text-sky-300 border-sky-500/30",
};

const SAVE_ERROR =
  "Enregistrement impossible. Vérifie que Vercel Blob est activé (token read-write) et que le site a été redéployé.";

function frDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export function SeasonAdmin() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [data, setData] = useState<SeasonData | null>(null);
  const [team, setTeam] = useState<TeamSlug>("seniors");
  const [error, setError] = useState<string | null>(null);
  const [editingFixture, setEditingFixture] = useState<Fixture | "new" | null>(null);
  const [sheetFixture, setSheetFixture] = useState<Fixture | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/admin/season", { cache: "no-store" });
      if (res.status === 401) {
        setPhase("login");
        return;
      }
      if (!res.ok) throw new Error();
      const json = (await res.json()) as SeasonData & { ok: boolean };
      setData(json);
      setPhase("ready");
    } catch {
      setError("Impossible de charger les données de saison.");
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

  async function post(payload: Record<string, unknown>): Promise<boolean> {
    setError(null);
    try {
      const res = await fetch("/api/admin/season", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { detail?: string };
        throw new Error(d.detail || "");
      }
      await load();
      return true;
    } catch (e) {
      setError(SAVE_ERROR + (e instanceof Error && e.message ? ` — ${e.message}` : ""));
      return false;
    }
  }

  const saveFixture = (f: ManualFixture) => post({ action: "saveFixture", fixture: f });
  const deleteFixture = (id: string) => post({ action: "deleteFixture", id });
  const saveSheet = (id: string, players: MatchPlayerStat[]) =>
    post({ action: "saveMatchStat", id, players });

  const fixtures = useMemo(
    () => (data?.fixtures[team] ?? []).slice().reverse(), // plus récents d'abord
    [data, team],
  );
  const roster = data?.rosters[team] ?? [];

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
              Matchs &amp; Stats
            </h1>
            <p className="mt-2 max-w-xl text-sm text-bone-dim">
              Ajoute des matchs amicaux, et saisis les buteurs / passeurs / joueurs
              de chaque match (la FFF donne les scores mais pas les buteurs).
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="h-4 w-4" />
            Rafraîchir
          </Button>
        </div>

        {/* Sélecteur d'équipe */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(data?.teams ?? []).map((t) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => setTeam(t.slug)}
              className={`rounded-full border px-4 py-2 font-heading text-xs font-bold uppercase tracking-wide transition-colors ${
                team === t.slug
                  ? "border-gold bg-gold text-ink"
                  : "border-white/15 text-bone-dim hover:border-gold/50 hover:text-bone"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {error && (
          <p className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-bone-dim">
            {fixtures.length} match{fixtures.length > 1 ? "s" : ""}
          </h2>
          <Button size="sm" onClick={() => setEditingFixture("new")}>
            <Plus className="h-4 w-4" />
            Ajouter un match
          </Button>
        </div>

        {fixtures.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-bone-dim">
            Aucun match pour cette équipe. Les matchs de championnat arrivent
            automatiquement de la FFF ; ajoute les amicaux à la main.
          </p>
        ) : (
          <ul className="grid gap-3">
            {fixtures.map((f) => (
              <MatchRow
                key={f.id}
                fixture={f}
                sheetCount={data?.matchStats[f.id]?.players.length ?? 0}
                onSheet={() => setSheetFixture(f)}
                onEdit={f.manual ? () => setEditingFixture(f) : undefined}
                onDelete={
                  f.manual
                    ? () => {
                        if (confirm("Supprimer ce match manuel et sa feuille ?"))
                          deleteFixture(f.id);
                      }
                    : undefined
                }
              />
            ))}
          </ul>
        )}
      </div>

      {editingFixture && (
        <FixtureForm
          team={team}
          fixture={editingFixture === "new" ? null : editingFixture}
          onClose={() => setEditingFixture(null)}
          onSave={async (f) => {
            const ok = await saveFixture(f);
            if (ok) setEditingFixture(null);
          }}
        />
      )}

      {sheetFixture && (
        <MatchSheetForm
          fixture={sheetFixture}
          roster={roster}
          existing={data?.matchStats[sheetFixture.id]?.players ?? []}
          onClose={() => setSheetFixture(null)}
          onSave={async (players) => {
            const ok = await saveSheet(sheetFixture.id, players);
            if (ok) setSheetFixture(null);
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------- Ligne match ------------------------------- */

function MatchRow({
  fixture,
  sheetCount,
  onSheet,
  onEdit,
  onDelete,
}: {
  fixture: Fixture;
  sheetCount: number;
  onSheet: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const played = fixture.homeScore != null && fixture.awayScore != null;
  const type = fixture.type ?? "championnat";
  return (
    <li className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-ink-800 p-4">
      <span
        className={`shrink-0 rounded-full border px-2.5 py-1 font-heading text-[0.6rem] font-extrabold uppercase tracking-wider ${TYPE_BADGE[type]}`}
      >
        {TYPE_LABELS[type]}
      </span>
      <div className="min-w-[200px] flex-1">
        <div className="text-sm font-semibold text-bone">
          {fixture.home} <span className="text-bone-dim">vs</span> {fixture.away}
        </div>
        <div className="mt-0.5 text-xs text-bone-dim">
          {frDate(fixture.date)}
          {fixture.time ? ` · ${fixture.time}` : ""}
          {fixture.manual && " · ajouté à la main"}
        </div>
      </div>
      <div className="shrink-0 font-display text-lg text-bone">
        {played ? `${fixture.homeScore} – ${fixture.awayScore}` : "à venir"}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button size="sm" variant="outline" onClick={onSheet}>
          <ClipboardList className="h-4 w-4" />
          Feuille{sheetCount > 0 ? ` (${sheetCount})` : ""}
        </Button>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            aria-label="Éditer le match"
            className="rounded-lg border border-white/15 p-2 text-bone-dim transition-colors hover:border-gold hover:text-gold"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            aria-label="Supprimer le match"
            className="rounded-lg border border-white/15 p-2 text-bone-dim transition-colors hover:border-red-500 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </li>
  );
}

/* ------------------------------ Modale (shell) ----------------------------- */

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-lg rounded-2xl border border-white/10 bg-ink-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h3 className="font-heading text-lg font-black uppercase text-bone">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-lg p-1.5 text-bone-dim transition-colors hover:bg-white/5 hover:text-bone"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

const fieldClass =
  "w-full rounded-lg border border-white/15 bg-ink px-3 py-2.5 text-sm text-bone focus:border-gold focus:outline-none";
const labelClass =
  "mb-1.5 block font-heading text-[0.62rem] font-bold uppercase tracking-wider text-bone-dim";

/* -------------------------- Formulaire match manuel ------------------------ */

function FixtureForm({
  team,
  fixture,
  onClose,
  onSave,
}: {
  team: TeamSlug;
  fixture: Fixture | null;
  onClose: () => void;
  onSave: (f: ManualFixture) => void;
}) {
  const home = fixture?.home ?? club.name;
  const editingHomeIsUs = home === club.name;

  const [type, setType] = useState<MatchType>(fixture?.type ?? "amical");
  const [date, setDate] = useState(fixture?.date ?? "");
  const [time, setTime] = useState(fixture?.time ?? "");
  const [atHome, setAtHome] = useState(fixture ? editingHomeIsUs : true);
  const [opponent, setOpponent] = useState(
    fixture ? (editingHomeIsUs ? fixture.away : fixture.home) : "",
  );
  const [venue, setVenue] = useState(fixture?.venue ?? "");
  const [competition, setCompetition] = useState(fixture?.competition ?? "Match amical");
  const [ourScore, setOurScore] = useState<string>(
    fixture
      ? String((editingHomeIsUs ? fixture.homeScore : fixture.awayScore) ?? "")
      : "",
  );
  const [theirScore, setTheirScore] = useState<string>(
    fixture
      ? String((editingHomeIsUs ? fixture.awayScore : fixture.homeScore) ?? "")
      : "",
  );

  const canSave = date.trim() !== "" && opponent.trim() !== "";

  function submit() {
    if (!canSave) return;
    const parseScore = (s: string) => (s.trim() === "" ? null : Math.max(0, Math.trunc(Number(s) || 0)));
    const our = parseScore(ourScore);
    const their = parseScore(theirScore);
    const f: ManualFixture = {
      id: fixture?.id ?? "",
      slug: team,
      type,
      date: date.trim(),
      time: time.trim() || undefined,
      home: atHome ? club.name : opponent.trim(),
      away: atHome ? opponent.trim() : club.name,
      venue: venue.trim() || undefined,
      competition: competition.trim() || "Match amical",
      homeScore: atHome ? our : their,
      awayScore: atHome ? their : our,
    };
    onSave(f);
  }

  return (
    <Modal title={fixture ? "Éditer le match" : "Ajouter un match"} onClose={onClose}>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <label>
            <span className={labelClass}>Type</span>
            <select
              value={type}
              onChange={(e) => {
                const t = e.target.value as MatchType;
                setType(t);
                if (!competition.trim() || competition === "Match amical" || competition === "Coupe" || competition === "Championnat")
                  setCompetition(t === "amical" ? "Match amical" : t === "coupe" ? "Coupe" : "Championnat");
              }}
              className={fieldClass}
            >
              {(["amical", "coupe", "championnat"] as MatchType[]).map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className={labelClass}>Lieu</span>
            <select
              value={atHome ? "domicile" : "exterieur"}
              onChange={(e) => setAtHome(e.target.value === "domicile")}
              className={fieldClass}
            >
              <option value="domicile">Domicile (nous recevons)</option>
              <option value="exterieur">Extérieur</option>
            </select>
          </label>
        </div>

        <label>
          <span className={labelClass}>Adversaire</span>
          <input
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            placeholder="Nom de l'équipe adverse"
            className={fieldClass}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label>
            <span className={labelClass}>Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>Heure (optionnel)</span>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={fieldClass} />
          </label>
        </div>

        <label>
          <span className={labelClass}>Lieu / stade (optionnel)</span>
          <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Stade François Maillot" className={fieldClass} />
        </label>

        <label>
          <span className={labelClass}>Libellé compétition</span>
          <input value={competition} onChange={(e) => setCompetition(e.target.value)} className={fieldClass} />
        </label>

        <div>
          <span className={labelClass}>Score (laisser vide si pas encore joué)</span>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <span className="mb-1 block text-[0.65rem] text-bone-dim">{club.name}</span>
              <input type="number" min={0} value={ourScore} onChange={(e) => setOurScore(e.target.value)} className={fieldClass} />
            </div>
            <span className="mt-4 font-display text-lg text-bone-dim">–</span>
            <div className="flex-1">
              <span className="mb-1 block text-[0.65rem] text-bone-dim">Adversaire</span>
              <input type="number" min={0} value={theirScore} onChange={(e) => setTheirScore(e.target.value)} className={fieldClass} />
            </div>
          </div>
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={submit} disabled={!canSave}>
            Enregistrer
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* --------------------------- Feuille de match ------------------------------ */

interface SheetRow {
  name: string;
  number?: number;
  played: boolean;
  goals: string;
  assists: string;
}

function MatchSheetForm({
  fixture,
  roster,
  existing,
  onClose,
  onSave,
}: {
  fixture: Fixture;
  roster: { name: string; number?: number }[];
  existing: MatchPlayerStat[];
  onClose: () => void;
  onSave: (players: MatchPlayerStat[]) => void;
}) {
  const byName = new Map(existing.map((p) => [p.name, p]));
  const [rows, setRows] = useState<SheetRow[]>(
    roster.map((p) => {
      const e = byName.get(p.name);
      return {
        name: p.name,
        number: p.number,
        played: Boolean(e),
        goals: e ? String(e.goals) : "0",
        assists: e ? String(e.assists) : "0",
      };
    }),
  );

  function update(name: string, patch: Partial<SheetRow>) {
    setRows((prev) => prev.map((r) => (r.name === name ? { ...r, ...patch } : r)));
  }

  function submit() {
    const players: MatchPlayerStat[] = rows
      .filter((r) => r.played || Number(r.goals) > 0 || Number(r.assists) > 0)
      .map((r) => ({
        name: r.name,
        goals: Math.max(0, Math.trunc(Number(r.goals) || 0)),
        assists: Math.max(0, Math.trunc(Number(r.assists) || 0)),
      }));
    onSave(players);
  }

  const playedCount = rows.filter((r) => r.played || Number(r.goals) > 0 || Number(r.assists) > 0).length;

  return (
    <Modal title="Feuille de match" onClose={onClose}>
      <p className="mb-1 text-sm font-semibold text-bone">
        {fixture.home} vs {fixture.away}
      </p>
      <p className="mb-4 text-xs text-bone-dim">
        {frDate(fixture.date)} · Coche les joueurs présents, puis saisis buts et passes.
      </p>

      <div className="mb-3 grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-white/10 pb-2 font-heading text-[0.6rem] font-bold uppercase tracking-wider text-bone-dim">
        <span>Joueur</span>
        <span className="w-16 text-center">Buts</span>
        <span className="w-16 text-center">Passes</span>
      </div>

      <div className="max-h-[45vh] space-y-1 overflow-y-auto pr-1">
        {rows.map((r) => (
          <div
            key={r.name}
            className={`grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-lg px-2 py-1.5 ${
              r.played ? "bg-white/5" : ""
            }`}
          >
            <label className="flex min-w-0 items-center gap-2">
              <input
                type="checkbox"
                checked={r.played}
                onChange={(e) => update(r.name, { played: e.target.checked })}
                className="h-4 w-4 shrink-0 accent-gold"
              />
              <span className="truncate text-sm text-bone">
                {r.number != null && (
                  <span className="mr-1.5 font-display text-xs text-bone-dim">{r.number}</span>
                )}
                {r.name}
              </span>
            </label>
            <input
              type="number"
              min={0}
              value={r.goals}
              onChange={(e) => update(r.name, { goals: e.target.value, played: true })}
              className="w-16 rounded-md border border-white/15 bg-ink px-2 py-1.5 text-center text-sm text-bone focus:border-gold focus:outline-none"
            />
            <input
              type="number"
              min={0}
              value={r.assists}
              onChange={(e) => update(r.name, { assists: e.target.value, played: true })}
              className="w-16 rounded-md border border-white/15 bg-ink px-2 py-1.5 text-center text-sm text-bone focus:border-gold focus:outline-none"
            />
          </div>
        ))}
        {rows.length === 0 && (
          <p className="py-6 text-center text-sm text-bone-dim">
            Aucun joueur dans l&apos;effectif de cette équipe.
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <span className="text-xs text-bone-dim">{playedCount} joueur(s) retenu(s)</span>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={submit}>Enregistrer la feuille</Button>
        </div>
      </div>
    </Modal>
  );
}
