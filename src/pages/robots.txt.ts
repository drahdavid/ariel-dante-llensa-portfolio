import type { APIRoute } from 'astro';
import { isPreview } from '../lib/preview';

// En vista previa se bloquea a los buscadores. En producción se permite todo y se apunta al sitemap.
export const GET: APIRoute = ({ site }) => {
  const lines =
    isPreview
      ? ['User-agent: *', 'Disallow: /']
      : ['User-agent: *', 'Allow: /', ...(site ? ['', `Sitemap: ${new URL('sitemap-index.xml', site).href}`] : [])];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
