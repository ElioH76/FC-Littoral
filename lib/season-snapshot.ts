import snapshot from "@/data/season-snapshot.json";
import type { Fixture, Standing, TeamSlug } from "@/types";

/**
 * SNAPSHOT SAISON (données FFF figées dans le repo).
 *
 * L'API FFF (DOFA) bloque les IP cloud (Vercel, GitHub Actions…), donc la prod
 * ne peut pas l'appeler. On lit ce fichier `data/season-snapshot.json`, rafraîchi
 * depuis une IP résidentielle par `npm run sync:fff` (scripts/sync-fff.mjs), qui
 * récupère la FFF, réécrit le fichier, puis commit+push (→ redéploiement).
 */

interface TeamSnapshot {
  fixtures?: Fixture[];
  standings?: Standing[];
}
interface SeasonSnapshot {
  syncedAt: string | null;
  teams: Partial<Record<TeamSlug, TeamSnapshot>>;
}

const data = snapshot as unknown as SeasonSnapshot;

export function snapshotFixtures(team: TeamSlug): Fixture[] {
  return data.teams[team]?.fixtures ?? [];
}

export function snapshotStandings(team: TeamSlug): Standing[] {
  return data.teams[team]?.standings ?? [];
}

/** Date/heure ISO de la dernière synchro FFF (ou null si jamais synchronisé). */
export function snapshotSyncedAt(): string | null {
  return data.syncedAt ?? null;
}
