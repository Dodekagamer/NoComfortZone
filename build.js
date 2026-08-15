#!/usr/bin/env node
/**
 * Zero-dependency static site build for No Comfort Zone.
 * Reads page definitions from src/pages/*.js, wraps them in the shared
 * layout (src/lib/layout.js) and writes plain HTML to _site/.
 * Also copies src/assets/ verbatim. No npm packages required.
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
const OUT = path.join(__dirname, '_site');
const PAGES_DIR = path.join(SRC, 'pages');
const ASSETS_DIR = path.join(SRC, 'assets');

const { renderPage } = require('./src/lib/layout');
const { BASE_PATH, SITE_URL } = require('./src/lib/base-path');
const { pageHero } = require('./src/lib/components');

function clean(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function outputPathFor(url) {
  // "/" -> _site/index.html, "/vision-werte/" -> _site/vision-werte/index.html
  if (url === '/') return path.join(OUT, 'index.html');
  const clean = url.replace(/^\/|\/$/g, '');
  return path.join(OUT, clean, 'index.html');
}

/**
 * GitHub Pages serves this project under BASE_PATH (see src/lib/base-path.js).
 * All templates/partials write plain root-relative links (href="/kontakt/",
 * src="/assets/..."), which is what you want for local dev at "/". This
 * rewrites just those root-relative href/src attributes to carry BASE_PATH,
 * in one place, after rendering — instead of threading a prefix through
 * every template. Absolute URLs (http/https), protocol-relative ("//..."),
 * mailto: and tel: links are left untouched by the negative lookahead.
 */
function applyBasePath(html) {
  if (!BASE_PATH) return html;
  return html.replace(/(href|src)="\/(?!\/)/g, `$1="${BASE_PATH}/`);
}

function buildPages() {
  const files = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith('.js'));
  const pages = [];
  for (const file of files) {
    const mod = require(path.join(PAGES_DIR, file));
    // Ein Modul liefert entweder eine Seite oder — über `pages` — mehrere
    // gleichartige Seiten aus einer Datenquelle (z. B. die Angebotsdetails).
    const entries = Array.isArray(mod.pages) ? mod.pages : [mod];
    for (const page of entries) {
      if (!page.url || !page.content) {
        throw new Error(`Seite in ${file} braucht mindestens { url, content }`);
      }
      const html = applyBasePath(
        renderPage({
          title: page.title,
          description: page.description,
          bodyClass: page.bodyClass,
          url: page.url,
          content: typeof page.content === 'function' ? page.content() : page.content
        })
      );
      const outPath = outputPathFor(page.url);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html);
      pages.push({ url: page.url });
    }
  }
  return pages;
}

function copyAssets() {
  const dest = path.join(OUT, 'assets');
  fs.cpSync(ASSETS_DIR, dest, { recursive: true });
}

function writeStaticFile(relPath, content) {
  const outPath = path.join(OUT, relPath);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, content);
}

function buildSitemap(pages) {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = pages
    .map((p) => {
      // Startseite höher priorisieren, Rechtstexte niedriger — hilft Crawlern
      // bei der Einordnung, welche Seiten die eigentlichen Inhalte sind.
      const priority = p.url === '/' ? '1.0' : /impressum|datenschutz/.test(p.url) ? '0.3' : '0.8';
      return `  <url><loc>${SITE_URL}${p.url}</loc><lastmod>${lastmod}</lastmod><priority>${priority}</priority></url>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  writeStaticFile('sitemap.xml', xml);
}

function buildRobots() {
  const robots = `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  writeStaticFile('robots.txt', robots);
}

function build404() {
  const html = applyBasePath(
    renderPage({
      title: 'Seite nicht gefunden — No Comfort Zone',
      description: 'Diese Seite existiert nicht (mehr).',
      url: '/404/',
      content: `
<div class="error-404">
${pageHero('404', 'Diese Seite gibt es nicht.', 'Der Link ist entweder veraltet oder falsch getippt. Auf der Startseite findest du alles Wichtige.', 'Zur Startseite', '/', 'Kontakt aufnehmen', '/kontakt/')}
</div>
`
    })
  );
  writeStaticFile('404.html', html);
}

function reportMissingImages() {
  const { missingImages } = require('./src/pages/angebot-detail');
  const missing = missingImages();
  if (!missing.length) return;
  console.log(
    `\nHinweis: ${missing.length} Angebotsfotos fehlen noch — es wird jeweils das ` +
      `Platzhalterbild angezeigt.\nSobald eine Datei unter diesem Namen in ` +
      `src/assets/img/angebote/ liegt, wird sie automatisch verwendet:`
  );
  missing.forEach((m) => console.log('  ' + m));
}

function main() {
  clean(OUT);
  const pages = buildPages();
  copyAssets();
  buildSitemap(pages);
  buildRobots();
  build404();
  console.log(`Build fertig: ${pages.length} Seiten -> _site/ (Base-Path: ${BASE_PATH || '(keiner)'})`);
  reportMissingImages();
}

main();
