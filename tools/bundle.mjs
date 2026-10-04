import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { portableHTML } from './page-html.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
await build({
  entryPoints: [root + 'js/app.js'], outfile: root + 'js/app.bundle.js',
  bundle: true, format: 'iife', platform: 'browser', target: 'es2022',
  minify: true, legalComments: 'eof',
});
const routes = new Set(JSON.parse(await readFile(root + 'routes.json', 'utf8')));
for (const route of ['/', ...routes]) {
  const file = root + (route === '/' ? '' : route.slice(1) + '/') + 'index.html';
  await writeFile(file, portableHTML(await readFile(file, 'utf8'), route, routes));
}
await writeFile(root + '404.html', portableHTML(await readFile(root + '404.html', 'utf8'), '/', routes));
console.log(`Bundled browser JavaScript and prepared ${routes.size + 2} portable HTML entries.`);
