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
    "Club de football amateur fondé en 2002, le F.C. Littoral réunit passionnés de tous âges autour de valeurs simples : le respect, la convivialité et le goût de l'effort. Du U15 aux Vétérans, en passant par notre équipe fanion des Seniors Après-Midi, nous faisons vivre le football au cœur de notre territoire.",
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
    { value: "1", label: "Stade municipal" },
  ],
  contact: {
    email: "contact@fclittoral.fr",
    phone: "06 12 34 56 78",
    address: "Stade Municipal, Avenue du Littoral, 00000 Ville",
  },
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
  },
} as const;
