#!/usr/bin/env node
/**
 * Static React SSR for two locales, four route types and a no-JavaScript root redirect.
 * Works on a GitHub Pages project path (e.g. /coverkit/) without a runtime server.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const outDir = join(root, 'apps/web/dist');
const ssrDir = join(root, 'apps/web/dist-ssr');
const template = readFileSync(join(outDir, 'index.html'), 'utf8');
const ssrBundle = join(ssrDir, 'entry-server.js');
if (!existsSync(ssrBundle)) throw new Error('Missing SSR bundle: first run vite build --ssr src/entry-server.tsx');
const { renderPage } = await import(pathToFileURL(ssrBundle).href);
const siteInput = process.env.COVERKIT_SITE_URL?.trim();
const canonicalRoot = siteInput ? new URL(siteInput.endsWith('/') ? siteInput : `${siteInput}/`).href : null;
const base = process.env.VITE_BASE_PATH || '/';
const repo = process.env.COVERKIT_GITHUB_REPO?.trim();
const locales = ['en','es'];
const modes = ['component','gallery','docs','reference'];
const suffix = mode => mode === 'component' ? '' : mode === 'reference' ? 'components/media-card/' : `${mode}/`;
const route = (locale, mode) => `${locale}/${suffix(mode)}`;
const address = (locale,mode) => canonicalRoot ? new URL(route(locale,mode),canonicalRoot).href : `${base}${route(locale,mode)}`;
const escapeAttr = value => String(value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');

const pages = {
  en: {
    component: ['CoverKit — React card design studio','Experiment with accessible React media cards: four layouts, bilingual UI, themes and optional Motion effects.'],
    gallery: ['React media card gallery — CoverKit','See four card layouts across manga, books, comics, web novels and series with original artwork.'],
    docs: ['MediaCard API & installation guide — CoverKit','Copyable React MediaCard and AnimatedMediaCard examples, locales, design tokens and TypeScript API.'],
    reference: ['MediaCard React component — CoverKit','Four accessible, customizable React cover-card layouts for manga, comics, books, web novels and shows.'],
  },
  es: {
    component: ['CoverKit — laboratorio de tarjetas React','Experimenta con tarjetas React accesibles: cuatro variantes, interfaz bilingüe, temas y animaciones opcionales.'],
    gallery: ['Galería de tarjetas React — CoverKit','Cuatro variantes de tarjetas React con ejemplos de manga, libros, cómics, novelas web y series.'],
    docs: ['Guía y API de MediaCard — CoverKit','Ejemplos de React y AnimatedMediaCard, idiomas, tokens y API TypeScript.'],
    reference: ['Componente React MediaCard — CoverKit','Cuatro variantes personalizables para libros, manga, cómics, novelas web y series.'],
  },
};

for (const locale of locales) {
  for (const mode of modes) {
    const [title,description] = pages[locale][mode];
    const canonical = address(locale,mode);
    const variants = [...locales.map(l=>`<link rel="alternate" hreflang="${l}" href="${escapeAttr(address(l,mode))}" />`),
      `<link rel="alternate" hreflang="x-default" href="${escapeAttr(address('en',mode))}" />`].join('\n    ');
    const structured = {
      '@context':'https://schema.org','@type':'SoftwareSourceCode',name:'CoverKit MediaCard',description,
      programmingLanguage:['TypeScript','React'],license:'https://opensource.org/license/mit',inLanguage:locale,
      ...(repo ? {codeRepository:`https://github.com/${repo}`} : {}),
      ...(canonicalRoot ? {url:canonical} : {}),
    };
    const metadata = [
      `<meta name="description" content="${escapeAttr(description)}" />`,
      '<meta name="robots" content="index,follow" />',
      `<link rel="canonical" href="${escapeAttr(canonical)}" />`,variants,
      '<meta property="og:type" content="website" />',
      `<meta property="og:locale" content="${locale === 'es' ? 'es_ES' : 'en_US'}" />`,
      `<meta property="og:title" content="${escapeAttr(title)}" />`,
      `<meta property="og:description" content="${escapeAttr(description)}" />`,
      ...(canonicalRoot ? [`<meta property="og:url" content="${escapeAttr(canonical)}" />`,`<meta property="og:image" content="${escapeAttr(new URL('og-coverkit.png',canonicalRoot).href)}" />`] : []),
      '<meta name="twitter:card" content="summary_large_image" />',
      `<script type="application/ld+json">${JSON.stringify(structured).replace(/</g,'\\u003c')}</script>`,
    ].join('\n    ');
    const rendered = renderPage(mode,locale);
    let html = template
      .replace(/<html lang="[^"]*">/,`<html lang="${locale}">`)
      .replace(/<title>[^<]*<\/title>/,`<title>${escapeAttr(title)}</title>`)
      .replace(/\s*<meta name="description"[^>]*\/>/g,'')
      .replace('</head>',`    ${metadata}\n  </head>`)
      .replace('<div id="root"></div>',`<div id="root">${rendered}</div>`);
    if (html.includes('<div id="root"></div>')) throw new Error(`SSR markup missing for ${locale}/${mode}`);
    const out = join(outDir,route(locale,mode),'index.html');
    mkdirSync(dirname(out),{recursive:true});writeFileSync(out,html);
    console.log(`Prerendered /${route(locale,mode)} (${html.length} bytes)`);
  }
}

// GitHub Pages does not support HTTP redirects: create a tiny HTML fallback.
// Keep the canonical English page at /en/ to avoid duplicate indexed content.
const rootIndex = `<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><meta name="robots" content="noindex,follow" /><meta http-equiv="refresh" content="0; url=./en/" /><title>CoverKit — open the design studio</title><link rel="canonical" href="${escapeAttr(address('en','component'))}" /></head><body><main><h1>CoverKit</h1><p>Explore the bilingual React MediaCard design studio.</p><a href="./en/">Open English documentation</a> · <a href="./es/">Ver documentación en español</a></main></body></html>`;
writeFileSync(join(outDir,'index.html'),rootIndex);
writeFileSync(join(outDir,'.nojekyll'),'');
writeFileSync(join(outDir,'robots.txt'),['User-agent: *','Allow: /',...(canonicalRoot?[`Sitemap: ${new URL('sitemap.xml',canonicalRoot).href}`]:[]),''].join('\n'));
if (canonicalRoot) {
  const urls = modes.flatMap(mode=>locales.map(locale=>{
    const alternates = [...locales.map(l=>`<xhtml:link rel="alternate" hreflang="${l}" href="${escapeAttr(address(l,mode))}" />`),
      `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeAttr(address('en',mode))}" />`].join('');
    return `<url><loc>${escapeAttr(address(locale,mode))}</loc>${alternates}</url>`;
  })).join('\n');
  writeFileSync(join(outDir,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>`);
} else {
  const sitemap=join(outDir,'sitemap.xml');if(existsSync(sitemap))rmSync(sitemap);
  console.warn('COVERKIT_SITE_URL not set; production sitemap and absolute OG image URL were omitted.');
}
rmSync(ssrDir,{recursive:true,force:true});
