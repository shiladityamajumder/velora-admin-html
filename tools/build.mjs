import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url)),dist=path.join(root,'dist');
const check=spawnSync(process.execPath,[path.join(root,'tools/check.mjs')],{stdio:'inherit'});
if(check.status) process.exit(check.status);
await rm(dist,{recursive:true,force:true}); await mkdir(dist,{recursive:true});
for(const name of ['js','css','fonts','index.html','404.html','routes.json','_redirects','.htaccess','THIRD_PARTY_NOTICES.md','docs/licenses']) await cp(path.join(root,name),path.join(dist,name),{recursive:true});
const routes=JSON.parse(await readFile(path.join(root,'routes.json'),'utf8'));
for(const route of routes) {const file=route.slice(1)+'/index.html';await mkdir(path.dirname(path.join(dist,file)),{recursive:true});await cp(path.join(root,file),path.join(dist,file));}
await writeFile(path.join(dist,'README.txt'),'Velora Admin HTML. Upload this directory to your static web host. For clean and dynamic URLs configure fallback to /index.html; _redirects and .htaccess are included.\n');
console.log(`Built ${routes.length} HTML pages in dist/. No application compilation or framework server is required.`);
