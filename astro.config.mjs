// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Dominio para el sitemap y las URLs absolutas. SITE_URL lo pisa (p. ej. en la vista previa de Surge).
const site = process.env.SITE_URL || 'https://arieldantellensa.site';

export default defineConfig({
  site,
  integrations: [sitemap({ i18n: { defaultLocale: 'es', locales: { es: 'es-AR', en: 'en' } } })],
  i18n: { locales: ['es', 'en'], defaultLocale: 'es' },
  // CSS embebido en el HTML: evita una petición que bloquea el primer render en mobile
  build: { inlineStylesheets: 'always' },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Cormorant Garamond',
      cssVariable: '--font-display',
      weights: ['300', '400', '500'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Garamond', 'Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter Tight',
      cssVariable: '--font-body',
      weights: ['300', '400', '500'],
      subsets: ['latin'],
      fallbacks: ['Arial', 'sans-serif'],
    },
  ],
  image: {
    layout: 'constrained',
  },
});
