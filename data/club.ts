/**
 * Informations générales du club.
 * 👉 Fichier facilement modifiable : coordonnées, slogans, réseaux sociaux.
 */

export const club = {
  name: "F.C. Littoral",
  fullName: "Football Club Littoral",
  founded: 2002,
  slogan: "Notre club, notre fierté",
  subSlogan: "Ensemble, plus forts",
  description:
    "Club de football amateur fondé en 2002, le F.C. Littoral réunit passionnés de tous âges autour de valeurs simples : le respect, la convivialité et le goût de l'effort. Du U13 aux Vétérans, en passant par notre équipe fanion des Seniors Après-Midi, nous faisons vivre le football au cœur de notre territoire.",
  values: [
    {
      title: "Esprit de club",
      text: "Une grande famille où chaque licencié compte, du plus jeune au plus expérimenté.",
    },
    {
      title: "Formation",
      text: "Encadrer et faire progresser nos joueurs dans un cadre exigeant et bienveillant.",
    },
    {
      title: "Convivialité",
      text: "Le terrain, mais aussi la troisième mi-temps : on gagne, on perd, on partage ensemble.",
    },
  ],
  stats: [
    { value: "2002", label: "Année de création" },
    { value: "3", label: "Équipes engagées" },
    { value: "120+", label: "Licenciés" },
    { value: "Heuqueville", label: "Notre stade" },
  ],
  // Histoire du club (paragraphes) — page "Le club"
  history: [
    "Né en 2002 de la passion de quelques bénévoles, le F.C. Littoral s'est construit saison après saison autour d'un noyau de joueurs et de familles fidèles.",
    "D'abord une simple équipe de copains, le club a grandi pour accueillir aujourd'hui les jeunes (U13), une équipe fanion ambitieuse (Seniors Après-Midi) et une équipe Vétérans conviviale.",
    "Plus de vingt ans plus tard, l'esprit reste le même : un club familial, ancré dans son territoire, où l'on vient autant pour le foot que pour les liens qui s'y créent.",
  ],
  // Bureau / dirigeants — page "Le club"
  bureau: [
    { name: "Jean-Marc Lemoine", role: "Président" },
    { name: "Sophie Renaud", role: "Vice-présidente" },
    { name: "Antoine Faure", role: "Secrétaire" },
    { name: "Karine Dubois", role: "Trésorière" },
    { name: "David Mercier", role: "Responsable sportif" },
  ],
  // Infos pratiques — page "Le club"
  pratique: [
    { label: "Permanence", value: "Mercredi & samedi, 10h – 12h (club-house)" },
    { label: "Stade", value: "Stade François Maillot, Heuqueville" },
    { label: "Saison", value: "Septembre à juin" },
  ],
  contact: {
    email: "contact@fclittoral.fr",
    phone: "06 12 34 56 78",
    address: "Stade François Maillot, 76280 Heuqueville",
  },
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
  },
} as const;
