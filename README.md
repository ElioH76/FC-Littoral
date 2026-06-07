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

- **Données temps réel (classements / calendriers)** — *squelette déjà en place* :
  - Les composants passent par `lib/data.ts` (`getStandings`, `getFixtures`, `getSeasonBoards`),
    qui passe par la **couche de sources** `lib/sources/`.
  - Source active définie dans **`lib/season-config.ts`** (`ACTIVE_SOURCE`) : `"mock"` aujourd'hui.
  - Pour brancher la vraie donnée (API FFF/DOFA) :
    1. remplir les ids de poule/club dans `teamSourceConfig` (`lib/season-config.ts`),
    2. compléter les `fetch` + mappers dans `lib/sources/fff-dofa-source.ts`,
    3. passer `ACTIVE_SOURCE = "fff-dofa"`.
  - **Repli automatique** sur les données de démo si la source externe échoue → le site ne casse jamais.
  - Aucun composant à modifier.
- **Back-end actualités** : même principe — `getNews()` / `getArticle()` pourront
  pointer vers un CMS ou une base de données.
- Les modèles `Standing`, `Fixture` et `TeamSeason` sont définis dans `types/`.

## 🚀 Déploiement

- Code hébergé sur **GitHub** ; push via **GitHub Desktop**.
- Mise en ligne sur **Vercel** (gratuit) : connecté au repo → chaque push redéploie
  automatiquement. Custom domain ajoutable dans *Vercel → Settings → Domains*.
