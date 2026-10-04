import { readdir, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url));
async function walk(directory) { const result=[]; for(const entry of await readdir(directory,{withFileTypes:true})) { const file=path.join(directory,entry.name); if(entry.isDirectory()) result.push(...await walk(file)); else result.push(file); } return result; }
let checked=0;
for(const file of await walk(path.join(root,'js'))) {
  if(!file.endsWith('.js')) continue;
  const source=await readFile(file,'utf8');
  const syntax=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
  if(syntax.status) throw new Error(syntax.stderr);
  for(const match of source.matchAll(/(?:from\s+|import\s*\()(['"])([^'"\n]+)\1/g)) {
    if(!match[2].startsWith('.')) continue;
    const imported=path.resolve(path.dirname(file),match[2]);
    if(!(await stat(imported).catch(()=>null))) throw new Error(`Missing import in ${path.relative(root,file)}: ${match[2]}`);
  }
  checked++;
}
const routes=JSON.parse(await readFile(path.join(root,'routes.json'),'utf8'));
for(const route of routes) {
 const file=path.join(root,route.slice(1),'index.html');
 const html=await readFile(file,'utf8');
 if(!html.includes('<html') || !html.includes('id="app"') || !html.includes('js/app.js')) throw new Error(`Invalid HTML: ${route}`);
 const base=path.dirname(file);
 for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  if(/^(?:https?:|data:|blob:|\/|mailto:|tel:)/.test(match[1])||!match[1].includes('/css/')&&!match[1].includes('/js/')) continue;
  if(!(await stat(path.resolve(base,match[1])).catch(()=>null))) throw new Error(`Missing HTML asset: ${route} ${match[1]}`);
 }
}
console.log(`Checked ${checked} JavaScript files and ${routes.length} HTML pages.`);
