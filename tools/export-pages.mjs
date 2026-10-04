import { chromium } from '@playwright/test';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { portableHTML } from './page-html.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)).replace(/\/$/,'');
const baseURL=process.env.VELORA_TEST_URL || 'http://127.0.0.1:3200';
(async()=>{
 const routes=JSON.parse(await fs.readFile(root+'/routes.json','utf8'));
 const browser=await chromium.launch(); const context=await browser.newContext({viewport:{width:1440,height:1000},colorScheme:'light'});
 await context.addInitScript(()=>{localStorage.setItem('nexa-data-v1:enterprise-session',JSON.stringify({id:'u1',name:'Demo Administrator',email:'superadmin@example.com',role:'Super Admin'}));});
 const p=await context.newPage(); let errors=[];p.on('pageerror',error=>errors.push(error.message));
 const report=[];
 for(const [index,route] of routes.entries()){
  errors=[];
  await p.goto(baseURL+route);
  await p.locator('h1').first().waitFor({timeout:20000});
  await p.waitForFunction(()=>!document.querySelector('main [aria-busy="true"]'),{timeout:15000});
  await p.waitForTimeout(route.includes('/charts/') || route.startsWith('/dashboard/') || route==='/charts' ? 1700 : 90);
  const content=await p.evaluate(()=>{
   const app=document.getElementById('app'),copy=app.cloneNode(true);
   const before=app.querySelectorAll('input,textarea,select'),after=copy.querySelectorAll('input,textarea,select');
   before.forEach((node,i)=>{
    if(node.tagName==='INPUT' && node.type!=='file'){after[i].setAttribute('value',node.value);if(node.checked) after[i].setAttribute('checked','');else after[i].removeAttribute('checked');}
    if(node.tagName==='TEXTAREA') after[i].textContent=node.value;
    if(node.tagName==='SELECT') [...after[i].options].forEach((option,j)=>{if(node.options[j].selected) option.setAttribute('selected','');else option.removeAttribute('selected');});
   });
   copy.querySelectorAll('dialog').forEach(dialog=>dialog.removeAttribute('open'));
   return copy.innerHTML;
  });
  const prefix='../'.repeat(route.slice(1).split('/').length), file=root+route+'/index.html';
  const html=`<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Velora Admin</title><meta name="description" content="Velora Admin — HTML, CSS and JavaScript templates"><script src="${prefix}js/boot.js"></script><link rel="stylesheet" href="${prefix}css/velora.css"><script type="module" src="${prefix}js/app.js"></script></head><body><div id="app">${content}</div><noscript>Enable JavaScript to use interactive template controls.</noscript></body></html>\n`;
  await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,portableHTML(html,route,new Set(routes)));
  report.push({route,heading:await p.locator('h1').first().textContent(),errors:[...errors]});
  if((index+1)%25===0) console.log(`${index+1}/${routes.length} HTML templates generated`);
 }
 const overview=await fs.readFile(root+'/template/index.html','utf8');await fs.writeFile(root+'/index.html',portableHTML(overview.replaceAll('../','./'),'/',new Set(routes)));
 await fs.writeFile(root+'/artifacts/route-validation.json',JSON.stringify(report,null,2));
 console.log('All '+routes.length+' HTML files generated. Browser errors: '+report.filter(x=>x.errors.length).length);
 await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
