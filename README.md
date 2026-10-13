# Portfolio — Ariel Dante Llensa

Sitio estático (Astro 7) bilingüe ES/EN: `/` y `/en/`. Animaciones con GSAP (ScrollTrigger) y Lenis.

```bash
npm run dev               # desarrollo
npm run build             # genera dist/
npm run deploy:preview    # vista previa en ariel-llensa-preview.surge.sh (no indexada)
```

## Contenido
- Textos y trayectoria: `src/data/site.ts` (ES y EN lado a lado).
- Fotos: `src/data/dishes.json` + `src/assets/dishes/`. `kind: "dish"` va a la galería; `"portrait"` se usa en la foto principal y en el perfil.
- Traer fotos de Instagram: `npm run fetch-ig -- <link del post>` (o `--profile=dantee.ariel`). Entran con `"hidden": true` para curarlas.
- Imagen para compartir: `node scripts/make-og.mjs` → `public/og.jpg`.

## Diseño
Dirección "menú degustación": negro cálido, marfil y un acento bronce (tokens en `src/styles/global.css`), Cormorant Garamond + Inter Tight, versalitas (`.caps`) y filetes finos.

## Animaciones
- `CutTitle`: una línea fina de luz cruza el título y las dos mitades se juntan a su paso.
- `CutReveal`: la foto se abre desde una línea (horizontal o vertical) mientras se asienta.
- `Steam`: vapor suave sobre una foto (canvas).
- `Menu`: la trayectoria como menú degustación; los filetes se trazan desde el centro.
- Todo vive en `src/scripts/motion.ts`. Con `prefers-reduced-motion` o sin JS se ve el contenido completo, sin animar.

## Deploy
Cloudflare Workers con `wrangler.jsonc` (sirve `dist/`). Cambiar el dominio en `astro.config.mjs` (`site`).
