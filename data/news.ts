import type { Article } from "@/types";

/**
 * Actualités du club.
 * 👉 Pour ajouter un article : copier un bloc en haut de liste.
 * `slug` doit être unique (utilisé dans l'URL /actualites/[slug]).
 * `content` est un tableau de paragraphes.
 */
export const news: Article[] = [
  {
    slug: "nouveaux-maillots-2024-2025",
    title: "À ne pas louper : découvrez les nouveaux maillots 2024/2025 !",
    excerpt:
      "L'équipe Seniors Après-Midi dévoile ses nouvelles tuniques, joueur et gardien, signées MAKI9SPORT. Or et vert pour le terrain, violet camo pour les cages.",
    date: "2024-06-04",
    category: "Boutique",
    featured: true,
    cover: "/mockup-maillot-joueur.jpeg",
    coverAlt: "Maillot joueur F.C. Littoral 2024/2025",
    content: [
      "Ça y est, les nouveaux maillots de l'équipe Seniors Après-Midi sont là ! Fidèles à l'identité du club, ils mettent à l'honneur l'or et le vert sur un design moderne aux motifs dynamiques.",
      "Le maillot joueur arbore les couleurs historiques du F.C. Littoral, avec l'écusson sur le cœur et le flocage MAKI9SPORT, notre équipementier. Le maillot gardien, lui, se distingue par un audacieux camouflage violet pour faire briller nos derniers remparts.",
      "Un grand merci à MAKI9SPORT pour ce travail et à nos partenaires qui rendent tout cela possible. Rendez-vous bientôt pour les modalités de commande !",
    ],
    gallery: [
      {
        src: "/mockup-maillot-joueur.jpeg",
        alt: "Maillot joueur F.C. Littoral 2024/2025 — face et dos",
      },
      {
        src: "/mockup-maillot-gardien.jpeg",
        alt: "Maillot gardien F.C. Littoral 2024/2025 — face et dos",
      },
    ],
  },
  {
    slug: "victoire-derby-us-riviere",
    title: "Les Seniors s'imposent dans le derby face à l'US Rivière",
    excerpt:
      "Portée par un Stade Municipal en fusion, l'équipe fanion a décroché une victoire précieuse dans le derby de la saison.",
    date: "2024-05-26",
    category: "Compte-rendu",
    featured: true,
    cover: "/images/news-derby.jpg",
    coverAlt: "Joueurs célébrant un but au stade",
    content: [
      "Devant un public venu en nombre, les Seniors Après-Midi ont livré une prestation pleine de caractère pour s'imposer dans le derby face à l'US Rivière.",
      "Solide défensivement et appliquée dans le jeu, l'équipe fanion a su faire la différence en seconde période grâce à un collectif soudé et une envie de fer.",
      "« Notre club, notre fierté » : le slogan a pris tout son sens cet après-midi. Bravo à tous les joueurs et merci aux supporters pour leur soutien indéfectible.",
    ],
  },
  {
    slug: "tournoi-jeunes-u15",
    title: "Belle performance des U15 au tournoi de printemps",
    excerpt:
      "Nos jeunes ont brillé par leur état d'esprit et leur jeu collectif lors du tournoi régional des U15.",
    date: "2024-05-12",
    category: "Jeunes",
    cover: "/images/news-u15.jpg",
    coverAlt: "Jeunes footballeurs lors d'un tournoi",
    content: [
      "Le tournoi de printemps a été l'occasion pour nos U15 de montrer tous leurs progrès. Engagement, fair-play et beau jeu étaient au rendez-vous.",
      "Au-delà du résultat, c'est l'attitude exemplaire de nos jeunes qui a marqué les esprits. Un grand bravo aux joueurs et au staff éducatif.",
      "La formation reste au cœur du projet du F.C. Littoral : faire grandir nos talents dans le plaisir et le respect.",
    ],
  },
  {
    slug: "troisieme-mi-temps-veterans",
    title: "Les Vétérans clôturent la saison en toute convivialité",
    excerpt:
      "Football plaisir et troisième mi-temps mémorable : retour sur la belle saison de nos Vétérans.",
    date: "2024-04-28",
    category: "Vie du club",
    cover: "/images/news-veterans.jpg",
    coverAlt: "Ambiance conviviale autour du club",
    content: [
      "Nos Vétérans ont bouclé leur saison comme ils l'aiment : avec le sourire, l'esprit d'équipe et une troisième mi-temps à la hauteur.",
      "Au F.C. Littoral, le football loisir est une institution. Merci à tous nos vétérans pour leur fidélité et leur bonne humeur.",
      "Rendez-vous la saison prochaine pour de nouvelles aventures et toujours plus de convivialité.",
    ],
  },
  {
    slug: "appel-benevoles-saison",
    title: "Le club recherche des bénévoles pour la nouvelle saison",
    excerpt:
      "Rejoignez l'aventure ! Le F.C. Littoral a besoin de vous pour faire vivre le club au quotidien.",
    date: "2024-04-10",
    category: "Vie du club",
    cover: "/images/news-benevoles.jpg",
    coverAlt: "Bénévoles d'un club de football",
    content: [
      "Un club amateur, c'est avant tout une équipe de bénévoles passionnés. Pour la saison à venir, le F.C. Littoral recherche des bonnes volontés.",
      "Encadrement, organisation des matchs, buvette, communication : il y a une place pour chacun, selon vos envies et votre disponibilité.",
      "Intéressé(e) ? Contactez-nous, nous serions ravis de vous accueillir dans la grande famille du Littoral.",
    ],
  },
];
