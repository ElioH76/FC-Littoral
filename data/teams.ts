import type { Team } from "@/types";

/**
 * Les 3 équipes du club.
 * 👉 Pour modifier une équipe : éditer l'objet correspondant.
 * Les photos pointent vers des images de démonstration (à remplacer par les vraies).
 */
export const teams: Team[] = [
  {
    slug: "u15",
    name: "U15",
    shortName: "U15",
    category: "Jeunes • Catégorie U15",
    description:
      "Notre équipe U15 rassemble les jeunes pousses du club. L'objectif : apprendre, progresser et prendre du plaisir, tout en développant les fondamentaux techniques et l'esprit collectif.",
    highlight:
      "Une catégorie tournée vers la formation, où chaque joueur trouve sa place et grandit avec le club.",
    objectives: [
      "Maîtriser les fondamentaux techniques",
      "Développer l'intelligence de jeu",
      "Prendre du plaisir et progresser ensemble",
    ],
    image: "/images/team-u15.jpg",
    imageAlt: "Jeunes joueurs U15 à l'entraînement",
    trainings: [
      { day: "Mardi", time: "18h00 – 19h30", location: "Stade Municipal" },
      { day: "Jeudi", time: "18h00 – 19h30", location: "Stade Municipal" },
    ],
    staff: [
      { name: "Karim Benali", role: "Éducateur principal" },
      { name: "Lucas Petit", role: "Éducateur adjoint" },
    ],
    players: [
      { name: "Nathan Roux", number: 1, position: "Gardien" },
      { name: "Téo Marchand", number: 4, position: "Défenseur" },
      { name: "Noé Lambert", number: 3, position: "Défenseur" },
      { name: "Hugo Lefèvre", number: 8, position: "Milieu" },
      { name: "Sacha Morel", number: 10, position: "Milieu offensif" },
      { name: "Léo Fontaine", number: 7, position: "Ailier" },
      { name: "Eliott Girard", number: 9, position: "Attaquant" },
      { name: "Adam Bonnet", number: 11, position: "Attaquant" },
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
      "Faire du Stade Municipal une forteresse",
    ],
    image: "/images/team-seniors.jpg",
    imageAlt: "Équipe seniors du F.C. Littoral avant un match",
    trainings: [
      { day: "Mercredi", time: "19h30 – 21h00", location: "Stade Municipal" },
      { day: "Vendredi", time: "19h30 – 21h00", location: "Stade Municipal" },
    ],
    staff: [
      { name: "David Mercier", role: "Entraîneur principal" },
      { name: "Antoine Faure", role: "Entraîneur adjoint" },
      { name: "Sophie Renaud", role: "Préparatrice physique" },
    ],
    players: [
      { name: "Maxime Dubois", number: 1, position: "Gardien", goals: 0 },
      {
        name: "Elio Hardouin",
        number: 5,
        position: "Défenseur central",
        goals: 12,
        photo: "/players/elio-hardouin.png",
      },
      { name: "Thomas Leroy", number: 2, position: "Latéral droit", goals: 1 },
      { name: "Bastien Roy", number: 3, position: "Latéral gauche", goals: 0 },
      { name: "Yanis Lopez", number: 6, position: "Milieu défensif", goals: 3 },
      { name: "Romain Carré", number: 10, position: "Meneur de jeu", goals: 9 },
      { name: "Lucas Henry", number: 8, position: "Milieu", goals: 4 },
      { name: "Julien Bernard", number: 11, position: "Ailier", goals: 7 },
      { name: "Mehdi Aziz", number: 7, position: "Ailier", goals: 6 },
      { name: "Kévin Martin", number: 9, position: "Avant-centre", goals: 10 },
      { name: "Florian Petit", number: 14, position: "Attaquant", goals: 5 },
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
      { day: "Vendredi", time: "20h00 – 21h30", location: "Stade Municipal" },
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
