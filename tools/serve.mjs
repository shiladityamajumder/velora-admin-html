import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const args = process.argv.slice(2), portIndex = args.indexOf('--port'), hostIndex = args.indexOf('--host');
const port = Number(portIndex >= 0 ? args[portIndex + 1] : process.env.PORT || 3200);
const host = hostIndex >= 0 ? args[hostIndex + 1] : process.env.HOST || '127.0.0.1';
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.woff2':'font/woff2','.ttf':'font/ttf','.svg':'image/svg+xml','.png':'image/png','.txt':'text/plain; charset=utf-8'};
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = path.resolve(root, '.' + pathname);
    if ((file !== root && !file.startsWith(root + path.sep)) || /^\/(?:tools|tests|artifacts|node_modules|dist)(?:\/|$)/.test(pathname)) { response.writeHead(404); response.end('Not found'); return; }
    let info = await stat(file).catch(() => null);
    if (info?.isDirectory()) file = path.join(file, 'index.html');
    else if (!info && !path.extname(file)) file = await stat(file + '.html').then(() => file + '.html').catch(() => path.join(file, 'index.html'));
    let data = await readFile(file).catch(() => null);
    if (!data && !path.extname(pathname)) {
      const depth = pathname.split('/').filter(Boolean).length;
      data = (await readFile(path.join(root, 'index.html'), 'utf8')).replaceAll('href="./css/', `href="${'../'.repeat(Math.max(0,depth-1))}css/`).replaceAll('src="./js/', `src="${'../'.repeat(Math.max(0,depth-1))}js/`);
      file = path.join(root, 'index.html');
    }
    if (!data) { response.writeHead(404); response.end('Not found'); return; }
    response.writeHead(200, {'Content-Type':types[path.extname(file)] ?? 'application/octet-stream','Cache-Control':'no-cache'}); response.end(data);
  } catch { response.writeHead(400); response.end('Bad request'); }
}).listen(port, host, () => console.log(`Velora HTML: http://${host}:${port}/template`));
