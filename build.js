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

function buildPages() {
  const files = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith('.js'));
  let count = 0;
  for (const file of files) {
    const page = require(path.join(PAGES_DIR, file));
    if (!page.url || !page.content) {
      throw new Error(`Seite ${file} braucht mindestens { url, content }`);
    }
    const html = renderPage({
      title: page.title,
      description: page.description,
      bodyClass: page.bodyClass,
      url: page.url,
      content: typeof page.content === 'function' ? page.content() : page.content
    });
    const outPath = outputPathFor(page.url);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html);
    count++;
  }
  return count;
}

function copyAssets() {
  const dest = path.join(OUT, 'assets');
  fs.cpSync(ASSETS_DIR, dest, { recursive: true });
}

function main() {
  clean(OUT);
  const pageCount = buildPages();
  copyAssets();
  console.log(`Build fertig: ${pageCount} Seiten -> _site/`);
}

main();
