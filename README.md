# Site F.C. Littoral

Site web du club de football amateur **F.C. Littoral**, construit avec Next.js 14, TypeScript, Tailwind CSS et shadcn/ui.

## 🚀 Démarrer

```bash
npm install      # installer les dépendances
npm run dev      # serveur de développement → http://localhost:3000
npm run build    # build de production
npm run start    # lancer le build de production
```

## 📁 Structure

```
app/                 Pages (App Router)
  page.tsx           Accueil
  equipes/           Nos équipes
  sponsors/          Sponsors
  actualites/        Liste + [slug] détail d'article
components/
  brand/             Logo
  layout/            Header, Footer
  sections/          Sections réutilisables (Hero, CTA, etc.)
  cards/             Cartes (équipe, actu, sponsor)
  ui/                Composants shadcn/ui
data/                ⭐ DONNÉES À MODIFIER (voir ci-dessous)
lib/
  data.ts            Couche d'accès aux données (async)
  utils.ts           Utilitaires
types/               Modèles TypeScript partagés
public/sponsors/     Logos des sponsors
```

## ✏️ Modifier le contenu

Tout le contenu est centralisé dans le dossier **`data/`** :

| Fichier            | Contenu                                   |
| ------------------ | ----------------------------------------- |
| `data/club.ts`     | Nom, slogans, contact, réseaux, stats     |
| `data/teams.ts`    | Les 3 équipes (U15, Seniors, Vétérans)    |
| `data/sponsors.ts` | Les partenaires                           |
| `data/news.ts`     | Les actualités                            |
| `data/standings.ts`| Classement (démo, futur temps réel)       |
| `data/fixtures.ts` | Calendrier & résultats (démo)             |

> Les images sont stockées en local dans `public/images/` (aucune dépendance externe). Pour changer une photo, remplace le fichier en gardant le même nom.

### Ajouter une actualité

Copier un bloc dans `data/news.ts` (en haut de la liste). Le `slug` doit être unique → il devient l'URL `/actualites/mon-slug`.

- Ajouter `featured: true` → l'article apparaît dans le **slider « À ne pas rater »** de l'accueil (et n'est plus dupliqué dans la grille).
- Ajouter `gallery: [{ src, alt }, …]` → une galerie d'images s'affiche en bas de l'article (et les 2 premières images servent de visuel dans le slider).

### Ajouter un sponsor

Copier un bloc dans `data/sponsors.ts`, déposer le logo dans `public/sponsors/`, et choisir le `tier` (`principal`, `officiel` ou `partenaire`).

### Remplacer le logo du club

Déposer le vrai logo dans `public/logo.png`, puis adapter `components/brand/Logo.tsx` (instructions dans le fichier).

## 🎨 Direction artistique

- **Or** `#F5C518` · **Vert sapin** `#1F7A3D` · **Noir** `#0B0B0B`
- Titres : police condensée athlétique (*Anton*) — corps : *Inter* — accents : *Caveat*
- Variables de thème dans `app/globals.css` et `tailwind.config.ts`

## 🔌 Évolutions prévues (architecture déjà prête)

Le site est conçu pour accueillir facilement les prochaines phases **sans refonte** :

- **Données temps réel (classements / calendriers)** : les composants ne lisent jamais
  les fichiers `data/` directement, ils passent par la couche async `lib/data.ts`.
  Pour brancher une API foot, il suffit de remplacer l'intérieur des fonctions
  (`getStandings`, `getFixtures`, etc.) par un `fetch` — aucun composant à modifier.
  Les emplacements sont déjà réservés (`components/sections/ComingSoon.tsx`).
- **Back-end actualités** : même principe — `getNews()` / `getArticle()` pourront
  pointer vers un CMS ou une base de données.
- Les modèles `Standing` et `Fixture` sont déjà définis dans `types/`.
