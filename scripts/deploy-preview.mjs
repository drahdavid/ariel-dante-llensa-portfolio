#!/usr/bin/env node
// Publica una vista previa para el cliente en Surge, sin indexar en buscadores.
//   npm run deploy:preview                 → ariel-llensa-preview.surge.sh
//   npm run deploy:preview -- otro-nombre  → otro-nombre.surge.sh
import { execSync } from 'node:child_process';

const name = process.argv[2] || 'ariel-llensa-preview';
const domain = `${name}.surge.sh`;
const env = { ...process.env, PREVIEW: '1', SITE_URL: `https://${domain}` };

execSync('npx astro build', { stdio: 'inherit', env });
execSync(`surge dist ${domain}`, { stdio: 'inherit', env });
console.log(`\nPublicado: https://${domain}`);
