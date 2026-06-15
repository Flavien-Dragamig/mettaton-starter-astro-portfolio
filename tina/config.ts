import { defineConfig } from 'tinacms';

/**
 * Configuration TinaCMS self-host — starter Astro Portfolio (Mettaton, Lot 1).
 *
 * Frontière de repo (canon §3) : Tina édite UNIQUEMENT `src/content/`.
 * Le code, les composants et les layouts (`src/components/`, `src/layouts/`, config)
 * restent édités par Claude Code. Ce schéma est le MIROIR de `src/content.config.ts`
 * (collections `work` + `pages`) : tout changement de champ doit être répercuté dans les deux fichiers.
 *
 * Sécurité (canon §6.3) : l'admin (`/admin`) ne doit JAMAIS être exposé sans authentification.
 * Mode local : auth servie par `tinacms dev` (LocalBackendAuthProvider).
 * Prod : AuthJS via le backend self-host (contrat figé dans `tina/backend/handler.ts`, hébergé au Lot 4).
 */

// Branche/identifiants Git du backend Tina (renseignés au Lot 4 ; valeurs neutres en local).
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';

// En mode local, l'API GraphQL est servie par le serveur `tinacms dev`.
// En prod, le backend self-host (Lot 4) expose son URL via TINA_PUBLIC_CONTENT_API_URL.
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

export default defineConfig({
  branch,
  // ID + token : utilisés uniquement par le backend distant (Tina Cloud OU self-host). Vides en local.
  clientId: process.env.TINA_PUBLIC_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',
  // En local on laisse Tina cibler le serveur de dev ; en prod on force l'URL du backend self-host.
  contentApiUrlOverride: isLocal
    ? '/api/tina/gql'
    : process.env.TINA_PUBLIC_CONTENT_API_URL || '/api/tina/gql',

  build: {
    // L'admin statique est généré dans `public/admin` → servi sous `/admin` par Astro.
    publicFolder: 'public',
    outputFolder: 'admin',
  },

  media: {
    tina: {
      // Toutes les images vivent dans `public/assets` (chemins `/assets/...`),
      // éditables via Tina sans friction. Modèle unifié des starters (cf. ADR images).
      mediaRoot: 'assets',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      {
        name: 'work',
        label: 'Projets (Work)',
        // Miroir du loader Astro : glob `src/content/work/**/*.md`.
        path: 'src/content/work',
        format: 'md',
        ui: {
          filename: {
            slugify: (values) =>
              `${(values?.title || 'nouveau-projet')
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^a-z0-9-]/g, '')}`,
          },
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Titre',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            required: true,
            ui: { component: 'textarea' },
          },
          {
            type: 'datetime',
            name: 'publishDate',
            label: 'Date de publication',
            required: true,
          },
          {
            type: 'string',
            name: 'tags',
            label: 'Tags',
            list: true,
            required: true,
          },
          {
            type: 'image',
            name: 'img',
            label: 'Image',
            required: true,
          },
          {
            type: 'string',
            name: 'img_alt',
            label: "Texte alternatif de l'image",
            required: false,
          },
          {
            // Corps Markdown du projet (rich-text WYSIWYG).
            type: 'rich-text',
            name: 'body',
            label: 'Contenu',
            isBody: true,
          },
        ],
      },
      {
        name: 'pages',
        label: 'Pages (contenu éditorial)',
        // Miroir du loader Astro : glob `src/content/pages/*.md`.
        // Pages singleton dé-hardcodées (home, about). Mêmes champs que `src/content.config.ts`.
        path: 'src/content/pages',
        format: 'md',
        ui: {
          // Pages singleton : on n'autorise ni création ni suppression depuis l'admin.
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Titre de page (balise <title>)',
            required: false,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Meta description',
            required: false,
            ui: { component: 'textarea' },
          },
          {
            type: 'object',
            name: 'hero',
            label: 'Hero',
            required: true,
            fields: [
              { type: 'string', name: 'title', label: 'Titre', required: true },
              {
                type: 'string',
                name: 'tagline',
                label: 'Accroche',
                required: false,
                ui: { component: 'textarea' },
              },
              {
                type: 'string',
                name: 'align',
                label: 'Alignement',
                required: false,
                options: ['start', 'center'],
              },
              { type: 'image', name: 'image', label: 'Image', required: false },
              {
                type: 'string',
                name: 'imageAlt',
                label: "Texte alternatif de l'image",
                required: false,
              },
              { type: 'number', name: 'imageWidth', label: 'Largeur image', required: false },
              { type: 'number', name: 'imageHeight', label: 'Hauteur image', required: false },
              {
                type: 'object',
                name: 'roles',
                label: 'Rôles (pills)',
                list: true,
                required: false,
                ui: {
                  itemProps: (item) => ({ label: item?.label || 'Rôle' }),
                },
                fields: [
                  { type: 'string', name: 'icon', label: 'Icône', required: true },
                  { type: 'string', name: 'label', label: 'Libellé', required: true },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'skills',
            label: 'Compétences (cartes)',
            list: true,
            required: false,
            ui: {
              itemProps: (item) => ({ label: item?.title || 'Compétence' }),
            },
            fields: [
              { type: 'string', name: 'icon', label: 'Icône', required: true },
              { type: 'string', name: 'title', label: 'Titre', required: true },
              {
                type: 'string',
                name: 'description',
                label: 'Description',
                required: true,
                ui: { component: 'textarea' },
              },
            ],
          },
          {
            type: 'object',
            name: 'selectedWork',
            label: 'Section « Selected Work »',
            required: false,
            fields: [
              { type: 'string', name: 'title', label: 'Titre', required: true },
              {
                type: 'string',
                name: 'text',
                label: 'Texte',
                required: false,
                ui: { component: 'textarea' },
              },
            ],
          },
          {
            type: 'object',
            name: 'mentions',
            label: 'Section « Mentions »',
            required: false,
            fields: [
              { type: 'string', name: 'title', label: 'Titre', required: true },
              {
                type: 'string',
                name: 'text',
                label: 'Texte',
                required: false,
                ui: { component: 'textarea' },
              },
              {
                type: 'string',
                name: 'brands',
                label: 'Marques',
                list: true,
                required: false,
              },
            ],
          },
          {
            type: 'object',
            name: 'sections',
            label: 'Sections de contenu',
            list: true,
            required: false,
            ui: {
              itemProps: (item) => ({ label: item?.title || 'Section' }),
            },
            fields: [
              { type: 'string', name: 'title', label: 'Titre', required: true },
              {
                type: 'string',
                name: 'body',
                label: 'Paragraphes (HTML inline autorisé)',
                list: true,
                required: false,
                ui: { component: 'textarea' },
              },
            ],
          },
          {
            type: 'object',
            name: 'contact',
            label: 'Appel à contact (CTA)',
            required: false,
            fields: [
              { type: 'string', name: 'title', label: 'Titre', required: true },
              { type: 'string', name: 'buttonLabel', label: 'Libellé du bouton', required: true },
              { type: 'string', name: 'href', label: 'Lien (mailto/URL)', required: true },
            ],
          },
        ],
      },
    ],
  },
});
