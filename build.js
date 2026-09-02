#!/usr/bin/env node
/**
 * Zero-dependency static site build for No Comfort Zone.
 * Reads page definitions from src/pages/*.js, wraps them in the shared
 * layout (src/lib/layout.js) and writes plain HTML to _site/.
 * Also copies src/assets/ verbatim. No npm packages required.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SRC = path.join(__dirname, 'src');
const OUT = path.join(__dirname, '_site');
const PAGES_DIR = path.join(SRC, 'pages');
const ASSETS_DIR = path.join(SRC, 'assets');

const { renderPage } = require('./src/lib/layout');
const { stripCssComments, stripJsComments, stripHtmlComments } = require('./src/lib/minify');
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

/**
 * Der immer gleiche Weg vom Seitenmodul zur fertigen Datei: rendern, die
 * Adressen auf den Unterpfad umschreiben, Kommentare entfernen. Stand vorher
 * zweimal dreifach verschachtelt da — einmal hier, einmal fuer die 404-Seite.
 */
function finishPage(options) {
  return stripHtmlComments(applyBasePath(renderPage(options)));
}

function buildPages() {
  const files = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith('.js'));
  const pages = [];
  // Schon vergebene Adressen merken. Zwei Seiten mit derselben URL wuerden
  // sonst dieselbe Datei schreiben — die zweite ueberschreibt die erste, der
  // Build meldet trotzdem Erfolg und eine Seite fehlt unbemerkt.
  const vergeben = new Map();
  for (const file of files) {
    const mod = require(path.join(PAGES_DIR, file));
    // Ein Modul liefert entweder eine Seite oder — über `pages` — mehrere
    // gleichartige Seiten aus einer Datenquelle (z. B. die Angebotsdetails).
    const entries = Array.isArray(mod.pages) ? mod.pages : [mod];
    for (const page of entries) {
      if (!page.url || !page.content) {
        throw new Error(`Seite in ${file} braucht mindestens { url, content }`);
      }
      const html = finishPage({
        title: page.title,
        description: page.description,
        shareTitle: page.shareTitle,
        robots: page.robots,
        bodyClass: page.bodyClass,
        url: page.url,
        content: typeof page.content === 'function' ? page.content() : page.content
      });
      if (vergeben.has(page.url)) {
        throw new Error(
          `Zwei Seiten wollen dieselbe Adresse "${page.url}": ${vergeben.get(page.url)} und ${file}. ` +
            `Bei den Angeboten ist meist ein doppelter "slug" in src/lib/offers.json die Ursache.`
        );
      }
      vergeben.set(page.url, file);

      const outPath = outputPathFor(page.url);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html);
      // Quellen fuer das Sitemap-Datum: das Seitenmodul selbst und — bei
      // datengetriebenen Seiten wie den Angebotsdetails — die Datendatei.
      const sources = [path.join(PAGES_DIR, file)];
      for (const extra of mod.dataFiles || []) sources.push(path.resolve(SRC, extra));
      pages.push({ url: page.url, sources });
    }
  }
  return pages;
}

function copyAssets() {
  const dest = path.join(OUT, 'assets');
  fs.cpSync(ASSETS_DIR, dest, { recursive: true });

  // Kommentare bleiben in src/, gehen aber nicht mit an den Besucher.
  const kuerzen = [
    ['css/styles.css', stripCssComments],
    ['js/main.js', stripJsComments]
  ];
  for (const [rel, funktion] of kuerzen) {
    const datei = path.join(dest, rel);
    const vorher = fs.readFileSync(datei, 'utf8');
    fs.writeFileSync(datei, funktion(vorher));
  }
}

function writeStaticFile(relPath, content) {
  const outPath = path.join(OUT, relPath);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, content);
}

/**
 * Letztes Aenderungsdatum einer Quelldatei aus der Git-Historie.
 * Wichtig fuer die Sitemap: stuende dort bei jedem Build das heutige Datum,
 * meldete die Seite staendig Aenderungen, die es gar nicht gab — Suchmaschinen
 * stufen ein solches lastmod als unzuverlaessig ein und ignorieren es.
 */
const gitDateCache = new Map();
function gitDate(filePath) {
  if (gitDateCache.has(filePath)) return gitDateCache.get(filePath);
  let date = null;
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', filePath], {
      cwd: __dirname,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) date = out;
  } catch (err) {
    // kein Git verfuegbar (z. B. Tarball-Download) — dann greift der Fallback
  }
  gitDateCache.set(filePath, date);
  return date;
}

function lastmodFor(sources) {
  const heute = new Date().toISOString().slice(0, 10);
  const dates = sources.map(gitDate).filter(Boolean);
  // Noch nicht committete (neue) Dateien liefern kein Datum -> heutiges Datum.
  return dates.length === sources.length ? dates.sort().pop() : heute;
}

function buildSitemap(pages) {
  const urls = pages
    .map((p) => {
      const lastmod = lastmodFor(p.sources);
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
  const html = finishPage({
    title: 'Seite nicht gefunden — No Comfort Zone',
    description: 'Diese Seite existiert nicht (mehr).',
    // Die Fehlerseite gehoert nicht in den Suchindex.
    robots: 'noindex, follow',
    url: '/404/',
    content: `
<div class="error-404">
${pageHero('404', 'Diese Seite gibt es nicht.', 'Der Link ist entweder veraltet oder falsch getippt. Auf der Startseite findest du alles Wichtige.', 'Zur Startseite', '/', 'Kontakt aufnehmen', '/kontakt/')}
</div>
`
  });
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
