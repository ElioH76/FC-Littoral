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
    category: "Jeunes • Catégorie U13",
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
      { day: "Mardi", time: "18h00 – 19h30", location: "Stade François Maillot" },
      { day: "Jeudi", time: "18h00 – 19h30", location: "Stade François Maillot" },
    ],
    staff: [
      { name: "Karim Benali", role: "Éducateur principal" },
      { name: "Lucas Petit", role: "Éducateur adjoint" },
    ],
    // ⚠️ Effectif U13 encore fictif (pas de feuille U13 dans joueurs.xlsx).
    players: [
      { name: "Nathan Roux", position: "Gardien" },
      { name: "Téo Marchand", position: "Défenseur" },
      { name: "Noé Lambert", position: "Défenseur" },
      { name: "Hugo Lefèvre", position: "Milieu" },
      { name: "Sacha Morel", position: "Milieu offensif" },
      { name: "Léo Fontaine", position: "Ailier" },
      { name: "Eliott Girard", position: "Attaquant" },
      { name: "Adam Bonnet", position: "Attaquant" },
    ],
  },
  {
    slug: "seniors",
    name: "Seniors Après-Midi",
    shortName: "Seniors",
    flagship: true,
    category: "Équipe fanion • Seniors",
    description:
      "Vitrine sportive du F.C. Littoral, l'équipe Seniors Après-Midi porte haut les couleurs or et vert chaque dimanche. Compétitive et soudée, elle incarne l'ambition du club.",
    highlight:
      "L'équipe fanion du club : exigence, intensité et fierté de représenter le Littoral.",
    objectives: [
      "Jouer le haut de tableau du championnat",
      "S'appuyer sur un collectif solide et discipliné",
      "Faire du Stade François Maillot une forteresse",
    ],
    image: "/teams/groupe-02-06-26.jpeg",
    imageAlt: "L'équipe Seniors du F.C. Littoral posant en maillots or et vert",
    trainings: [
      { day: "Mardi", time: "19h00 – 21h00", location: "Stade François Maillot" },
      { day: "Jeudi", time: "19h00 – 21h00", location: "Stade François Maillot" },
    ],
    staff: [
      { name: "Fabrice", role: "Coach" },
      { name: "Vincent", role: "Coach" },
    ],
    // Effectif synchronisé depuis joueurs.xlsx (feuille « Joueurs »).
    // Plus de numéros (amateur) ni de buts ici : les buts/passes sont saisis
    // par match dans l'admin. `photo` : fichier dans /public/players (sinon
    // repli auto sur les initiales).
    players: [
      { name: "Adrien Debris", position: "Milieu défensif", photo: "/players/adrien-debris.png" },
      { name: "Alban Pusset", position: "Ailier", photo: "/players/alban-pusset.png" },
      { name: "Alexandre Ferreira Moreira", position: "Buteur", photo: "/players/alexandre-ferreira.png" },
      { name: "Anthony Salmon", position: "Attaquant", photo: "/players/anthony-salmon.png" },
      { name: "Axel Hauchecorne", position: "Ailier", photo: "/players/axel-hauchecorne.png" },
      { name: "Benjamin Friboulet", position: "Ailier", photo: "/players/ben-friboulet.png" },
      { name: "Corentin Savalle", position: "Défenseur central", photo: "/players/corentin-savalle.png" },
      { name: "Elio Hardouin", position: "Défenseur central", photo: "/players/elio-hardouin.png", captain: true },
      { name: "Erwan Ligney", position: "Milieu", photo: "/players/erwan-ligney.png" },
      { name: "Ethan Tiffay", position: "Latéral droit", photo: "/players/ethan-tiffay.png" },
      { name: "Jean-Michel Geffroy", position: "Buteur", photo: "/players/jeanmi-geffroy.png" },
      { name: "Mattéo Ebersvillier", position: "Milieu défensif", photo: "/players/matteo-ebersvillier.png" },
      { name: "Maxime Vallette", position: "Ailier", photo: "/players/maxime-vallette.png" },
      { name: "Noam Julien", position: "Ailier", photo: "/players/noam-julien.png" },
      { name: "Noan Lecarpentier", position: "Défenseur", photo: "/players/noan-lecarpentier.png" },
      { name: "Pierre Marie", position: "Attaquant", photo: "/players/pierre-marie.png" },
      { name: "Rémi Le Batteux", position: "Milieu", photo: "/players/remi-lebatteux.png" },
      { name: "Théo Debris", position: "Buteur", photo: "/players/theo-debris.png" },
      { name: "Thomas Cocault-Duverger", position: "Latéral gauche", photo: "/players/thomas-duverger.png" },
      { name: "Thomas Dumont", position: "Milieu défensif", photo: "/players/thomas-dumont.png" },
      { name: "Thomas Guérout", position: "Latéral droit", photo: "/players/thomas-guerout.png" },
      { name: "Thomas Legay", position: "Gardien", photo: "/players/thomas-legay.png" },
      { name: "Valentin Joly", position: "Milieu", photo: "/players/val-joly.png" },
      { name: "Vincent Malandain", position: "Gardien", photo: "/players/vincent-malandain.png" },
      { name: "William Tassel", position: "Défenseur central", photo: "/players/william-tassel.png" },
    ],
  },
];
