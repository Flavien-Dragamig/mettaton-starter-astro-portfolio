/**
 * CONTRAT DE BRIQUE — datalayer + auth TinaCMS self-host.
 *
 * ⚠️ Hébergement réel du backend = Lot 4 (Docker / Dokploy). NON monté par le build statique Astro.
 *    Ce fichier vit volontairement HORS de `src/pages/` : un site Astro statique n'a pas de runtime
 *    serveur pour exécuter `/api/tina/[...routes]`. Le backend Tina (datalayer + AuthJS + git provider)
 *    sera hébergé séparément au Lot 4, et `contentApiUrlOverride` (cf. tina/config.ts) pointera dessus.
 *
 * Rôle de ce squelette : figer le CONTRAT (interface + variables d'environnement) de la brique
 * réutilisable « datalayer + auth », industrialisée une seule fois (canon §4) puis répliquée sur N sites.
 *
 * Sécurité (canon §6.3) : l'admin n'est JAMAIS exposé sans authentification.
 *   - Mode local  → LocalBackendAuthProvider() (auth servie par `tinacms dev`).
 *   - Mode prod   → AuthJsBackendAuthProvider() (AuthJS + secret NEXTAUTH_SECRET).
 *
 * Dépendances attendues au Lot 4 : @tinacms/datalayer, tinacms-authjs, et un git provider
 * (GitHub natif OU provider custom GitLab/Gitea/Forgejo/Bitbucket — facteur différenciant, canon §2).
 *
 * Les imports ci-dessous sont commentés tant que le backend n'est pas hébergé (Lot 4), afin que
 * le build statique du starter ne tente jamais de résoudre/monter ce handler.
 */

// import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer';
// import { TinaAuthJSOptions, AuthJsBackendAuthProvider } from 'tinacms-authjs';
// import databaseClient from '../__generated__/databaseClient';

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

/**
 * Contrat du handler self-host (à activer au Lot 4) :
 *
 *   const handler = TinaNodeBackend({
 *     authProvider: isLocal
 *       ? LocalBackendAuthProvider()
 *       : AuthJsBackendAuthProvider({
 *           authOptions: TinaAuthJSOptions({
 *             databaseClient,
 *             secret: process.env.NEXTAUTH_SECRET as string,
 *           }),
 *         }),
 *     databaseClient,
 *   });
 *
 *   export default (req, res) => handler(req, res);
 */

export const tinaBackendContract = {
  isLocal,
  authProvider: isLocal ? 'LocalBackendAuthProvider' : 'AuthJsBackendAuthProvider',
  hostedAt: 'Lot 4 (Docker/Dokploy)',
} as const;

export default tinaBackendContract;
