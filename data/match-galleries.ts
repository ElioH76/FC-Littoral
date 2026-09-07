/**
 * Galeries photo attachées à un match précis (clé = id du match FFF ou manuel).
 * Les fichiers sont des versions web optimisées ; les originaux haute déf
 * restent hors dépôt (cf. .gitignore).
 */
export interface MatchGallery {
  /** Légende courte de l'album. */
  caption?: string;
  /** Chemins publics des photos (la 1re sert de photo d'équipe / couverture). */
  photos: string[];
}

const dir = "/images/galerie/vs-fecamp-aller";

export const MATCH_GALLERIES: Record<string, MatchGallery> = {
  // 1re journée de championnat 2026/2027 — USF Fécamp / F.C. Littoral.
  "56447701": {
    caption: "1re journée de championnat — l'équipe et le match en images",
    photos: [
      `${dir}/dscf4832.jpg`,
      `${dir}/dscf4843.jpg`,
      `${dir}/dscf4858.jpg`,
      `${dir}/dscf4882.jpg`,
      `${dir}/dscf4915.jpg`,
      `${dir}/dscf4941.jpg`,
      `${dir}/dscf4966.jpg`,
      `${dir}/dscf4995.jpg`,
      `${dir}/dscf5029.jpg`,
      `${dir}/dscf5064.jpg`,
      `${dir}/dscf5095.jpg`,
      `${dir}/dscf5132.jpg`,
      `${dir}/dscf5150.jpg`,
      `${dir}/dscf5192.jpg`,
      `${dir}/dscf5220.jpg`,
      `${dir}/img_4917.jpg`,
    ],
  },
};

export function getMatchGallery(fixtureId: string): MatchGallery | undefined {
  return MATCH_GALLERIES[fixtureId];
}
