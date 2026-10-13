#!/usr/bin/env node
// Genera public/og.jpg (1200x630) para compartir el sitio: nombre centrado a la izquierda, foto a la derecha.
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const photo = await sharp(path.join(root, 'src/assets/dishes/DLId9QjOSrl.jpg'))
  .resize(480, 630, { fit: 'cover', position: 'attention' })
  .toBuffer();

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0f0d0b"/>
  <text x="360" y="150" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" letter-spacing="6" fill="#b08d62">COCINERO · MENDOZA</text>
  <text x="360" y="275" text-anchor="middle" font-family="Garamond, Georgia, serif" font-weight="300" font-size="104" fill="#ece4d6">Ariel</text>
  <text x="360" y="375" text-anchor="middle" font-family="Garamond, Georgia, serif" font-style="italic" font-weight="300" font-size="104" fill="#ece4d6">Dante</text>
  <text x="360" y="475" text-anchor="middle" font-family="Garamond, Georgia, serif" font-weight="300" font-size="104" fill="#ece4d6">Llensa</text>
  <rect x="336" y="512" width="48" height="1" fill="#b08d62"/>
  <text x="360" y="560" text-anchor="middle" font-family="Garamond, Georgia, serif" font-style="italic" font-size="26" fill="#bdb3a4">Técnica, ritmo y emplatado.</text>
</svg>`;

await sharp(Buffer.from(svg))
  .composite([{ input: photo, left: 720, top: 0 }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(root, 'public/og.jpg'));
console.log('public/og.jpg listo');
