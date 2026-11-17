// GitHub Pages has no SPA fallback: give every route its own index.html (served with 200),
// plus a 404.html for anything else.
import { mkdirSync, copyFileSync } from 'node:fs';
import { projects, routes } from '../src/data.js';
const paths = [...routes.map(([p]) => p).filter(p => p !== '/'), ...projects.map(p => `/work/${p.slug}`)];
for (const p of paths) { mkdirSync(`dist${p}`, { recursive: true }); copyFileSync('dist/index.html', `dist${p}/index.html`); }
copyFileSync('dist/index.html', 'dist/404.html');
console.log(`postbuild: wrote ${paths.length} route pages + 404.html`);
