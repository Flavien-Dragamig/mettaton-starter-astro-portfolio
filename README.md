# Mettaton Starter — Astro Portfolio

Starter de portfolio basé sur le template officiel Astro `portfolio`, prêt à personnaliser pour Mettaton.

## Démarrage

```sh
npm install    # installe les dépendances
npm run dev    # serveur de dev sur http://localhost:4321
npm run build  # build de production dans dist/
```

## Édition de contenu (TinaCMS)

Ce starter intègre **TinaCMS self-host** pour l'édition WYSIWYG du contenu.

### Frontière de repo (à respecter)

| Zone | Périmètre | Édité par |
|---|---|---|
| `src/content/` | Contenu éditorial (projets `work`, pages `home`/`about`) | **Tina** + Claude Code |
| `src/components/`, `src/layouts/`, config (`astro.config.mjs`, `tina/config.ts`…) | Code, structure, templates | **Claude Code uniquement** |

Le schéma Tina (`tina/config.ts`) est le **miroir** de `src/content.config.ts` : toute évolution
de champ doit être répercutée dans les deux fichiers pour rester cohérent.

> Les pages d'accueil et « À propos » ont été **dé-hardcodées** : leur contenu (hero, compétences,
> sections, CTA, mentions) vit dans `src/content/pages/home.md` et `src/content/pages/about.md` et
> est rendu par boucles dans `src/pages/index.astro` / `about.astro`. La structure visuelle reste
> dans les composants/layouts.

### Lancer l'éditeur en local

```bash
cp .env.example .env.local       # TINA_PUBLIC_IS_LOCAL=true par défaut
npm run dev:cms                  # lance `tinacms dev` + `astro dev`
```

Puis ouvrir l'admin sur **http://localhost:4321/admin** (login local requis — l'admin n'est
**jamais** exposé sans authentification). Les modifications sont écrites dans `src/content/`
puis commitées dans Git (source de vérité du contenu).

### Backend de production

En local, l'auth + le datalayer sont servis par `tinacms dev` (filesystem + git, sans base de
données). En production, le backend Tina self-host (datalayer + AuthJS + git provider) est hébergé
séparément (**Docker / Dokploy — Lot 4**) ; son contrat figure dans `tina/backend/handler.ts` et
les variables d'environnement correspondantes dans `.env.example`.
