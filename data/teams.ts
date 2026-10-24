import type { Team } from "@/types";

/**
 * Les équipes du club (U13 + Seniors Après-Midi).
 * 👉 Pour modifier une équipe : éditer l'objet correspondant.
 * Les photos pointent vers des images de démonstration (à remplacer par les vraies).
 */
export const teams: Team[] = [
  {
    slug: "u13",
    name: "U13",
    shortName: "U13",
    category: "Jeunes • U13 Départemental 4",
    description:
      "Notre équipe U13 rassemble les jeunes pousses du club. L'objectif : apprendre, progresser et prendre du plaisir, tout en développant les fondamentaux techniques et l'esprit collectif.",
    highlight:
      "Une catégorie tournée vers la formation, où chaque joueur trouve sa place et grandit avec le club.",
    objectives: [
      "Maîtriser les fondamentaux techniques",
      "Développer l'intelligence de jeu",
      "Prendre du plaisir et progresser ensemble",
    ],
    image: "/images/team-u13.jpg",
    imageAlt: "Jeunes joueurs U13 à l'entraînement",
    trainings: [
      { day: "Lundi", time: "18h00 – 19h30", location: "Stade François Maillot" },
      { day: "Mercredi", time: "15h00 – 16h30", location: "Stade François Maillot" },
    ],
    staff: [
      { name: "Vincent Routel", role: "Coach" },
      { name: "José", role: "Dirigeant" },
      { name: "Nathanaël", role: "Dirigeant" },
      { name: "Pascal", role: "Dirigeant" },
      { name: "Emeric", role: "Dirigeant" },
    ],
    // Effectif U12/U13 (liste Footclubs). Joueurs mineurs : PAS de photo pour
    // l'instant (cartes en initiales), ni poste, ni date de naissance.
    // Hugo Letellier : U11 surclassé en U12 cette saison.
    players: [
      { name: "Mathis Allais", position: "" },
      { name: "Lenny Bolaingue", position: "" },
      { name: "Clément Cahard", position: "" },
      { name: "Tim Fontaine", position: "" },
      { name: "Mahé Fontana Franchet", position: "" },
      { name: "Cassien Gueroult", position: "" },
      { name: "Antoine Henry", position: "" },
      { name: "Aurélien Keromnes", position: "" },
      { name: "Nahil Khiar", position: "" },
      { name: "Charli Lemaire", position: "" },
      { name: "Hugo Letellier", position: "" },
      { name: "Anthon Pingue", position: "" },
    ],
  },
  {
    slug: "seniors",
    name: "Seniors Après-Midi",
    shortName: "Seniors",
    flagship: true,
    matchStats: true,
    category: "Équipe fanion • Seniors Après-Midi D4",
    description:
      "Vitrine sportive du F.C. Littoral, l'équipe Seniors Après-Midi porte haut les couleurs or et vert chaque dimanche. Compétitive et soudée, elle incarne l'ambition du club.",
    highlight:
      "L'équipe fanion du club : exigence, intensité et fierté de représenter le Littoral.",
    objectives: [
      "Jouer le haut de tableau du championnat",
      "S'appuyer sur un collectif solide et discipliné",
      "Faire du Stade François Maillot une forteresse",
    ],
    image: "/teams/equipe-2026-2027.jpg",
    imageAlt:
      "L'équipe Seniors du F.C. Littoral au complet avant le 1er match de championnat 2026/2027",
    trainings: [
      { day: "Mardi", time: "19h00 – 21h00", location: "Stade François Maillot" },
      { day: "Jeudi", time: "19h00 – 21h00", location: "Stade François Maillot" },
    ],
    staff: [
      { name: "Fabrice Chaif", role: "Coach" },
      { name: "Vincent Routel", role: "Coach adjoint" },
    ],
    // Effectif synchronisé depuis joueurs.xlsx (feuille « Joueurs »).
    // Plus de numéros (amateur) ni de buts ici : les buts/passes sont saisis
    // par match dans l'admin. `photo` : fichier dans /public/players (sinon
    // repli auto sur les initiales).
    players: [
      // Base = pose -1, survol (hover) = pose célébration -4. Détourées + cadrées
      // au buste (cf. player-photo-pipeline). Poses -2/-3 disponibles en local.
      { name: "Adrien Debris", position: "Milieu défensif", photo: "/players/adrien-debris-1.png", hoverPhoto: "/players/adrien-debris-4.png" },
      { name: "Alban Pusset", position: "Ailier", photo: "/players/alban-pusset-1.png", hoverPhoto: "/players/alban-pusset-4.png" },
      { name: "Alexandre Ferreira Moreira", position: "Buteur", photo: "/players/alex-fm-1.png", hoverPhoto: "/players/alex-fm-4.png" },
      { name: "Alexis Gilles", position: "Gardien", photo: "/players/alexis-gilles-1.png", hoverPhoto: "/players/alexis-gilles-4.png" },
      { name: "Anthony Salmon", position: "Attaquant", photo: "/players/anthony-salmon-1.png", hoverPhoto: "/players/anthony-salmon-4.png" },
      { name: "Axel Hauchecorne", position: "Ailier" },
      { name: "Benjamin Friboulet", position: "Ailier", photo: "/players/ben-friboulet-1.png", hoverPhoto: "/players/ben-friboulet-4.png" },
      { name: "Corentin Savalle", position: "Défenseur central", photo: "/players/corentin-savalle-1.png", hoverPhoto: "/players/corentin-savalle-4.png" },
      { name: "Elio Hardouin", position: "Défenseur central", photo: "/players/elio-hardouin-1.png", hoverPhoto: "/players/elio-hardouin-4.png", captain: true },
      { name: "Erwan Ligney", position: "Milieu", photo: "/players/erwan-ligney-1.png", hoverPhoto: "/players/erwan-ligney-4.png" },
      { name: "Ethan Tiffay", position: "Latéral droit", photo: "/players/ethan-tiffay-1.png", hoverPhoto: "/players/ethan-tiffay-4.png" },
      { name: "Jean-Michel Geffroy", position: "Buteur", photo: "/players/jean-mi-1.png", hoverPhoto: "/players/jean-mi-4.png" },
      { name: "Mattéo Ebersvillier", position: "Milieu défensif", photo: "/players/matheo-eb-1.png", hoverPhoto: "/players/matheo-eb-4.png" },
      { name: "Maxime Vallette", position: "Ailier" },
      { name: "Noam Julien", position: "Ailier" },
      { name: "Noan Lecarpentier", position: "Défenseur" },
      { name: "Pierre Marie", position: "Attaquant" },
      { name: "Rémi Le Batteux", position: "Milieu", photo: "/players/remi-lb-1.png", hoverPhoto: "/players/remi-lb-4.png" },
      { name: "Théo Debris", position: "Buteur", photo: "/players/theo-debris-1.png", hoverPhoto: "/players/theo-debris-4.png" },
      { name: "Thomas Cocault-Duverger", position: "Latéral gauche", photo: "/players/thomas-cd-1.png", hoverPhoto: "/players/thomas-cd-4.png" },
      { name: "Thomas Dumont", position: "Milieu défensif" },
      { name: "Thomas Guérout", position: "Latéral droit", photo: "/players/thomas-gueroult-1.png", hoverPhoto: "/players/thomas-gueroult-4.png" },
      { name: "Thomas Legay", position: "Gardien" },
      { name: "Valentin Joly", position: "Milieu" },
      { name: "Vincent Malandain", position: "Gardien" },
      { name: "William Tassel", position: "Défenseur central", photo: "/players/william-tassel-1.png", hoverPhoto: "/players/william-tassel-4.png" },
    ],
  },
];
