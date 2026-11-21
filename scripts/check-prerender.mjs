import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const dist = resolve(import.meta.dirname,'../apps/web/dist');
const modes = ['', 'gallery/', 'docs/', 'components/media-card/'];
for (const locale of ['en','es']) {
  for (const route of modes) {
    const target = join(dist,locale,route,'index.html');
    if(!existsSync(target))throw new Error(`Missing prerendered ${locale}/${route}`);
    const html=readFileSync(target,'utf8');
    const start=html.indexOf('<div id="root">');
    const content=start>=0?html.slice(start+'<div id="root">'.length):'';
    const checks=[
      html.includes(`<html lang="${locale}">`),html.includes('rel="canonical"'),
      html.includes('hreflang="en"'),html.includes('hreflang="es"'),html.includes('hreflang="x-default"'),
      html.includes('og:title'),html.includes('application/ld+json'),
      content.length>1200,content.includes('<h1'),
      locale==='es'?html.includes('Galería')||html.includes('Guía')||html.includes('Componente'):html.includes('Gallery')||html.includes('Guide')||html.includes('Component'),
    ];
    if(checks.some(ok=>!ok))throw new Error(`SEO/SSR output incomplete for ${locale}/${route}: ${checks}`);
  }
}
const root=readFileSync(join(dist,'index.html'),'utf8');
if(!root.includes('url=./en/'))throw new Error('English default route missing');
console.log('8 localized SSR pages, language alternates, metadata and English landing: OK');
