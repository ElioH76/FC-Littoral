/**
 * Modèles de données partagés.
 * Ces types sont réutilisés par le front actuel ET par le futur back-end / API.
 * Garder ces structures stables facilite le branchement d'une API plus tard.
 */

export type TeamSlug = "u13" | "seniors";

export interface Player {
  name: string;
  number?: number;
  position: string;
  /**
   * Buts marqués sur la saison (sert au "meilleur buteur").
   * ⚠️ Cette valeur est CALCULÉE depuis les feuilles de match (cf. `match-stats`)
   * et injectée par la couche de données (`getTeamStatsBundle`). Les valeurs
   * éventuellement présentes dans `data/teams.ts` sont ignorées à l'affichage.
   */
  goals?: number;
  /** Passes décisives sur la saison (calculé depuis les feuilles de match). */
  assists?: number;
  /** Nombre de matchs joués sur la saison (calculé depuis les feuilles de match). */
  matches?: number;
  /** Photo détourée du joueur, ex. "/players/elio-hardouin.png". */
  photo?: string;
  /** Capitaine de l'équipe. */
  captain?: boolean;
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
  /** Photo d'équipe utilisée en bannière sur la page dédiée (sinon `image`). */
  banner?: string;
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
/* BOUTIQUE                                                           */
/* ------------------------------------------------------------------ */

export type ProductCategory = "Maillots" | "Textile" | "Accessoires";

export interface Product {
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  image: string;
  imageAlt: string;
  /** Prix TTC en euros. `null` = tarif à confirmer au club. */
  price: number | null;
  /** Tailles proposées. Tableau vide = taille unique. */
  sizes: string[];
  /** Propose la personnalisation par initiales (flocage). */
  flocage: boolean;
  /** Mis en avant en tête de boutique. */
  featured?: boolean;
  /** Produit visible en boutique. `undefined` = actif (compat ancien format). */
  active?: boolean;
  /** Ordre d'affichage (croissant). */
  order?: number;
}

/** Une ligne de commande = un exemplaire configuré (taille + initiales). */
export interface OrderLine {
  slug: string;
  name: string;
  size: string;
  /** Initiales de flocage (optionnel). */
  initials: string;
}

export interface OrderCustomer {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  /** Équipe / catégorie (optionnel). */
  team?: string;
  /** Remarque libre (optionnel). */
  note?: string;
}

export interface Order {
  items: OrderLine[];
  customer: OrderCustomer;
  /** ISO datetime côté client. */
  submittedAt: string;
}

/** Statuts de suivi d'une commande (côté admin). Le 1er est le défaut. */
export const ORDER_STATUSES = [
  "En attente",
  "Commandée",
  "Reçu",
  "En attente de paiement",
  "Payée",
  "Annulée",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Une commande telle que renvoyée à l'admin (agrégée depuis le Sheet). */
export interface AdminOrder {
  orderId: string;
  date: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  team: string;
  note: string;
  status: OrderStatus;
  items: { name: string; size: string; initials: string }[];
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

/** Type de compétition d'un match (sert au filtre des stats). */
export type MatchType = "championnat" | "coupe" | "amical";

export interface Fixture {
  id: string;
  date: string;
  /** Heure du coup d'envoi, ex. "15H00" (optionnel). */
  time?: string;
  home: string;
  away: string;
  /** Logos (URL FFF ou /logo.png pour notre club). */
  homeLogo?: string;
  awayLogo?: string;
  competition: string;
  homeScore?: number;
  awayScore?: number;
  venue?: string;
  /** Type de compétition. Défaut "championnat" (matchs FFF). */
  type?: MatchType;
  /** Vrai si le match a été ajouté à la main (amical, coupe hors FFF…). */
  manual?: boolean;
}

/* ------------------------------------------------------------------ */
/* MATCHS MANUELS & FEUILLES DE MATCH (saisie admin)                  */
/* ------------------------------------------------------------------ */

/** Un match ajouté à la main depuis l'admin (ex. amical). */
export interface ManualFixture {
  id: string;
  slug: TeamSlug;
  type: MatchType;
  /** Date ISO yyyy-mm-dd. */
  date: string;
  /** Heure du coup d'envoi, ex. "15:00". */
  time?: string;
  home: string;
  away: string;
  /** Logo de l'adversaire (URL Blob) — le nôtre est /logo.png automatiquement. */
  opponentLogo?: string;
  venue?: string;
  /** Libellé affiché (ex. "Match amical"). */
  competition: string;
  /** Scores : `null`/absent = match pas encore joué. */
  homeScore?: number | null;
  awayScore?: number | null;
}

/** Contribution d'un joueur sur un match (présence dans la liste = a joué). */
export interface MatchPlayerStat {
  name: string;
  goals: number;
  assists: number;
}

/** Feuille de match : les joueurs ayant participé + leurs buts/passes. */
export interface MatchStat {
  players: MatchPlayerStat[];
}

/** Feuilles de match indexées par identifiant de match (FFF ou manuel). */
export type MatchStatsStore = Record<string, MatchStat>;

/** Totaux agrégés d'un joueur (sur un type de match ou au global). */
export interface PlayerStatTotals {
  goals: number;
  assists: number;
  matches: number;
}

/** Stats d'un joueur ventilées par type de match, + total. */
export interface PlayerSeasonStats {
  name: string;
  byType: Record<MatchType, PlayerStatTotals>;
  total: PlayerStatTotals;
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
