#!/usr/bin/env node
// Importa fotos de platos desde Instagram.
//
//   npm run fetch-ig -- --profile=dantee.ariel            todos los posts recientes que muestra el perfil
//   npm run fetch-ig -- https://www.instagram.com/p/XXXX/  posts puntuales (links o shortcodes)
//
// Opciones:
//   --first-only   de un carrusel, sólo la primera foto
//   --refresh      vuelve a descargar las imágenes que ya están en dishes.json
//
// Usa los embeds públicos (/{usuario}/embed/ y /p/{code}/embed/captioned/), que no requieren login.
// Los videos se omiten. Las imágenes van a src/assets/dishes/ y se agregan a src/data/dishes.json
// con "hidden": true; después se curan a mano (título, alt, destacado) y se les saca "hidden".

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = path.join(root, 'src/assets/dishes');
const dataFile = path.join(root, 'src/data/dishes.json');
const UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const BS = '\\';

const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args
    .filter((a) => a.startsWith('--'))
    .map((a) => {
      const [k, ...v] = a.slice(2).split('=');
      return [k, v.length ? v.join('=') : true];
    }),
);
const codes = args
  .filter((a) => !a.startsWith('--'))
  .map((a) => a.match(/(?:\/(?:p|reel|tv)\/)?([A-Za-z0-9_-]{8,})\/?(?:\?.*)?$/)?.[1])
  .filter(Boolean);

if (!codes.length && !opts.profile) {
  console.log('Uso: npm run fetch-ig -- --profile=usuario | <link o shortcode> [...]');
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** El embed trae el JSON del post escapado varias veces; lo dejamos plano. */
function unescape(html) {
  let t = html;
  for (let i = 0; i < 5; i++) t = t.split(BS + '/').join('/').split(BS + '"').join('"').split(BS + BS).join(BS);
  return t;
}

const decodeUrl = (u) => u.replace(/&amp;/g, '&').replace(/\\u0026/g, '&');
const decodeText = (s) => {
  try {
    return JSON.parse(`"${s.replace(/"/g, '\\"')}"`);
  } catch {
    return s;
  }
};

/** Shortcodes de los posts que muestra el embed del perfil (los carruseles traen también a sus hijos). */
async function profilePosts(user) {
  const res = await fetch(`https://www.instagram.com/${user}/embed/`, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`perfil HTTP ${res.status}`);
  const t = unescape(await res.text());
  const posts = [];
  // Cada post del perfil aparece como un nodo con "__typename" y luego su shortcode
  for (const m of t.matchAll(/"__typename":"Graph(?:Image|Sidecar|Video)"[^{}]{0,400}?"shortcode":"([A-Za-z0-9_-]{8,})"/g)) {
    if (!posts.includes(m[1])) posts.push(m[1]);
  }
  if (posts.length) return posts;
  // Formato alternativo: todos los shortcodes; fetchPost resuelve los carruseles igual
  return [...new Set([...t.matchAll(/"shortcode":"([A-Za-z0-9_-]{8,})"/g)].map((m) => m[1]))];
}

async function fetchPost(code) {
  const res = await fetch(`https://www.instagram.com/p/${code}/embed/captioned/`, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const t = unescape(html);

  const start = t.indexOf('"shortcode_media"');
  if (start === -1) return fromImgTag(code, html);
  const body = t.slice(start);

  // Carrusel: se leen los hijos. Post simple: el propio post.
  const sidecarAt = body.indexOf('"edge_sidecar_to_children"');
  const scope = sidecarAt === -1 ? body : body.slice(sidecarAt);
  const nodes = [];
  const seen = new Set();
  for (const m of scope.matchAll(/"shortcode":"([A-Za-z0-9_-]+)"/g)) {
    const seg = scope.slice(m.index, m.index + 3000);
    const at = seg.indexOf('"display_url":"');
    if (at === -1) continue;
    const url = seg.slice(at + 15, seg.indexOf('"', at + 15));
    const key = url.split('?')[0];
    if (seen.has(key)) continue;
    seen.add(key);
    nodes.push({ code: m[1], url: decodeUrl(url), video: seg.slice(0, at).includes('"is_video":true') });
    if (sidecarAt === -1) break;
  }

  let media = nodes.filter((n) => !n.video);
  if (opts['first-only']) media = media.slice(0, 1);

  const captionRaw = body.match(/"edge_media_to_caption":\{"edges":\[\{"node":\{"text":"((?:[^"\\]|\\.)*)"/)?.[1] ?? '';
  return { media, caption: decodeText(captionRaw) };
}

/** Posts de una sola imagen: el embed no trae JSON, sólo <img class="EmbeddedMediaImage" srcset=...>. */
function fromImgTag(code, html) {
  const tag = html.match(/<img[^>]*class="EmbeddedMediaImage"[^>]*>/)?.[0];
  if (!tag) throw new Error('el embed no trae la imagen (¿video, post privado o foto dentro de un carrusel?)');
  const srcset = decodeUrl(tag.match(/srcset="([^"]+)"/)?.[1] ?? '');
  const best = srcset
    .split(/,(?=https?:)/)
    .map((s) => s.trim().split(/\s+/))
    .map(([url, w]) => ({ url, w: parseInt(w, 10) || 0 }))
    .sort((a, b) => b.w - a.w)[0];
  const url = best?.url ?? decodeUrl(tag.match(/src="([^"]+)"/)[1]);
  const owner = html.match(/class="UsernameText"[^>]*>([^<]+)/)?.[1];
  const caption = (html.match(/<div class="Caption">([\s\S]*?)<\/div>/)?.[1] ?? '')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&#064;/g, '@')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .trim()
    .replace(owner ? new RegExp(`^${owner}\\s*`) : /^/, '');
  return { media: [{ code, url, video: false }], caption };
}

// Guarda la imagen como JPG con un tope de 2160 px de ancho: alcanza para retina y el repo no engorda.
async function download(url, out) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`imagen HTTP ${res.status}`);
  await sharp(Buffer.from(await res.arrayBuffer()))
    .rotate()
    .resize({ width: 2160, withoutEnlargement: true })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(out);
}

const dishes = existsSync(dataFile) ? JSON.parse(await readFile(dataFile, 'utf8')) : [];
await mkdir(assetsDir, { recursive: true });
if (opts.profile) codes.push(...(await profilePosts(opts.profile)));
let added = 0;

for (const [i, code] of codes.entries()) {
  if (i) await sleep(2500); // evita el rate limit (429)
  try {
    const { media, caption } = await fetchPost(code);
    if (!media.length) {
      console.warn(`- ${code}: sólo tiene video, se omite`);
      continue;
    }
    for (const m of media) {
      const existing = dishes.find((d) => d.id === m.code);
      if (existing && !opts.refresh) continue;
      const file = existing?.file ?? `${m.code}.jpg`;
      const out = path.join(assetsDir, file);
      if (!existsSync(out) || opts.refresh) await download(m.url, out);
      if (existing) continue;
      const meta = await sharp(out).metadata();
      dishes.push({
        id: m.code,
        file,
        title: { es: '', en: '' },
        alt: { es: '', en: '' },
        featured: false,
        hidden: true,
        igUrl: `https://www.instagram.com/p/${code}/`,
        caption: caption.slice(0, 300),
      });
      added++;
      console.log(`+ ${m.code} (${meta.width}x${meta.height}) ← ${code}`);
    }
  } catch (e) {
    console.error(`! ${code}: ${e.message}`);
  }
}

if (added) {
  await writeFile(dataFile, JSON.stringify(dishes, null, 2) + '\n');
  console.log(`\n${added} imagen(es) nueva(s). Curalas en src/data/dishes.json (título, alt, sacar "hidden").`);
}
