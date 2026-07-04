import type { Team } from "@/types";

/**
 * Les 3 équipes du club.
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
    players: [
      { name: "Nathan Roux", number: 1, position: "Gardien", goals: 0 },
      { name: "Téo Marchand", number: 4, position: "Défenseur", goals: 1 },
      { name: "Noé Lambert", number: 3, position: "Défenseur", goals: 2 },
      { name: "Hugo Lefèvre", number: 8, position: "Milieu", goals: 5 },
      { name: "Sacha Morel", number: 10, position: "Milieu offensif", goals: 9 },
      { name: "Léo Fontaine", number: 7, position: "Ailier", goals: 6 },
      { name: "Eliott Girard", number: 9, position: "Attaquant", goals: 8 },
      { name: "Adam Bonnet", number: 11, position: "Attaquant", goals: 7 },
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
    players: [
      { name: "Vincent Malandain", number: 1, position: "Gardien", goals: 0, photo: "/players/vincent-malandain.png" },
      { name: "Théo Debris", number: 2, position: "Piston droit", goals: 16, photo: "/players/theo-debris.png" },
      { name: "Thomas Cocault-Duverger", number: 3, position: "Latéral gauche", goals: 4, photo: "/players/thomas-duverger.png" },
      { name: "Corentin Savalle", number: 4, position: "Défenseur central", goals: 3, photo: "/players/corentin-savalle.png" },
      { name: "Elio Hardouin", number: 5, position: "Défenseur central", goals: 9, photo: "/players/elio-hardouin.png", captain: true },
      { name: "Adrien Debris", number: 6, position: "Milieu défensif", goals: 8, photo: "/players/adrien-debris.png" },
      { name: "Alban Pusset", number: 7, position: "Ailier", goals: 12, photo: "/players/alban-pusset.png" },
      { name: "Erwan Ligney", number: 8, position: "Milieu", goals: 10, photo: "/players/erwan-ligney.png" },
      { name: "Alexandre Ferreira Moreira", number: 9, position: "Buteur", goals: 17, photo: "/players/alexandre-ferreira.png" },
      { name: "Mathys Linquier", number: 10, position: "Milieu offensif", goals: 24, photo: "/players/mathys-linquier.png" },
      { name: "Benjamin Friboulet", number: 11, position: "Ailier", goals: 28, photo: "/players/ben-friboulet.png" },
      { name: "Mattéo Ebersvillier", number: 12, position: "Milieu défensif", goals: 3, photo: "/players/matteo-ebersvillier.png" },
      { name: "Noam Julien", number: 13, position: "Ailier", goals: 2, photo: "/players/noam-julien.png" },
      { name: "Axel Hauchecorne", number: 14, position: "Ailier", goals: 0, photo: "/players/axel-hauchecorne.png" },
      { name: "Thomas Guérout", number: 15, position: "Latéral droit", goals: 0, photo: "/players/thomas-guerout.png" },
      { name: "Valentin Joly", number: 16, position: "Milieu", goals: 7, photo: "/players/val-joly.png" },
      { name: "William Tassel", number: 17, position: "Défenseur central", goals: 2, photo: "/players/william-tassel.png" },
      { name: "Mathis Hardouin", number: 18, position: "Milieu offensif", goals: 15, photo: "/players/mathis-hardouin.png" },
    ],
  },
  {
    slug: "veterans",
    name: "Vétérans",
    shortName: "Vétérans",
    category: "Loisir • Vétérans",
    description:
      "Le plaisir avant tout ! Nos Vétérans se retrouvent chaque semaine pour entretenir la forme, partager de bons moments et prolonger la passion du ballon rond dans une ambiance détendue.",
    highlight:
      "Football plaisir, troisième mi-temps garantie : l'esprit club dans toute sa convivialité.",
    objectives: [
      "Garder la forme et le plaisir de jouer",
      "Cultiver la convivialité et l'amitié",
      "Représenter le club dans les tournois loisir",
    ],
    image: "/images/team-veterans.jpg",
    imageAlt: "Joueurs vétérans réunis sur le terrain",
    trainings: [
      { day: "Vendredi", time: "20h00 – 21h30", location: "Stade François Maillot" },
      { day: "Dimanche", time: "10h00 (matchs)", location: "Terrain annexe" },
    ],
    staff: [
      { name: "Patrick Lemoine", role: "Référent équipe" },
      { name: "Gérard Faure", role: "Capitaine" },
    ],
    players: [
      { name: "Christophe Garnier", position: "Gardien" },
      { name: "Olivier Roussel", position: "Défenseur" },
      { name: "Pascal Moreau", position: "Défenseur" },
      { name: "Stéphane Dubreuil", position: "Milieu" },
      { name: "Franck Vidal", position: "Milieu" },
      { name: "Laurent Chevalier", position: "Attaquant" },
      { name: "Didier Aubert", position: "Attaquant" },
    ],
  },
];
