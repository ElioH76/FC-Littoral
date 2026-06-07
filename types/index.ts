/**
 * Modèles de données partagés.
 * Ces types sont réutilisés par le front actuel ET par le futur back-end / API.
 * Garder ces structures stables facilite le branchement d'une API plus tard.
 */

export type TeamSlug = "u15" | "seniors" | "veterans";

export interface Player {
  name: string;
  number?: number;
  position: string;
}

export interface StaffMember {
  name: string;
  role: string;
}

export interface TrainingSlot {
  day: string;
  time: string;
  location: string;
}

export interface Team {
  slug: TeamSlug;
  name: string;
  shortName: string;
  /** Marque l'équipe fanion (mise en avant) */
  flagship?: boolean;
  category: string;
  description: string;
  /** Court paragraphe d'ambiance/objectifs */
  highlight: string;
  objectives?: string[];
  image: string;
  imageAlt: string;
  trainings: TrainingSlot[];
  staff: StaffMember[];
  players?: Player[];
}

export interface Sponsor {
  id: string;
  name: string;
  description: string;
  website: string;
  logo: string;
  /** "principal" = sponsor majeur affiché en avant */
  tier: "principal" | "officiel" | "partenaire";
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  /** Date ISO yyyy-mm-dd */
  date: string;
  category: string;
  cover: string;
  coverAlt: string;
  /** Met l'article en avant ("à ne pas louper") */
  featured?: boolean;
  /** Contenu en paragraphes (simple pour l'instant, Markdown/CMS plus tard) */
  content: string[];
  /** Galerie d'images optionnelle affichée sous le contenu */
  gallery?: { src: string; alt: string }[];
}

/* ------------------------------------------------------------------ */
/* Modèles prévus pour la PHASE 2 (API temps réel) — non utilisés     */
/* aujourd'hui, mais définis ici pour stabiliser le contrat de données.*/
/* ------------------------------------------------------------------ */

export interface Standing {
  rank: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface Fixture {
  id: string;
  date: string;
  home: string;
  away: string;
  competition: string;
  homeScore?: number;
  awayScore?: number;
  venue?: string;
}

/** Données de saison agrégées pour une équipe (classement + matchs). */
export interface TeamSeason {
  slug: TeamSlug;
  name: string;
  /** Vide si l'équipe n'a pas de classement officiel (ex. loisir/vétérans). */
  standings: Standing[];
  results: Fixture[];
  upcoming: Fixture[];
  /** Message affiché à la place du classement quand il n'y en a pas. */
  noStandingsNote?: string;
}
