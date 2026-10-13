// Vista previa para el cliente: no se indexa en buscadores.
// Se activa con PREVIEW=1 (Surge) o al compilar en Cloudflare cualquier rama que no sea main.
const ciBranch = process.env.WORKERS_CI_BRANCH;

export const isPreview = process.env.PREVIEW === '1' || (!!ciBranch && ciBranch !== 'main');

// Build de producción en Cloudflare (rama main): el único que mide con Analytics.
export const isProduction = ciBranch === 'main';
