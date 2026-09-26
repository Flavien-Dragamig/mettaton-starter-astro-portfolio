// @ts-check
import { defineConfig } from 'astro/config';

// Pas de télémétrie Astro (données d'usage envoyées à Astro), quel que soit
// l'hébergeur qui build le site : Astro lit cette variable après avoir chargé
// ce fichier (build, dev, sync, preview).
process.env.ASTRO_TELEMETRY_DISABLED ??= '1';

// https://astro.build/config
export default defineConfig({});
