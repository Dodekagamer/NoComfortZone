/**
 * Erzeugt die Vorschaubilder, die WhatsApp, Instagram und Suchmaschinen zeigen,
 * wenn jemand einen Link teilt (1200x630).
 *
 * Warum vorgerendert und mitversioniert statt im Build erzeugt: Das Rendern
 * braucht einen Browser, und der GitHub-Actions-Build soll ohne Abhaengigkeiten
 * auskommen. Die Bilder liegen deshalb als PNG im Projekt.
 *
 * Neu erzeugen (braucht Playwright und Chromium):
 *     node tools/share-images.js
 *
 * Aendert sich ein Seitentitel, ohne dass das Bild neu erzeugt wird, zeigt die
 * Vorschau noch den alten — der Build weist beim Bauen darauf hin.
 */
const path = require('path');
const fs = require('fs');

const WURZEL = path.join(__dirname, '..');
const ZIEL = path.join(WURZEL, 'src', 'assets', 'share');
const SCHRIFTEN = path.join(WURZEL, 'src', 'assets', 'fonts');

const { seitenFuerTeilbilder } = require(path.join(WURZEL, 'src', 'lib', 'share-liste'));

function schriftAlsDatenUrl(name) {
  const b64 = fs.readFileSync(path.join(SCHRIFTEN, name)).toString('base64');
  return `url(data:font/woff2;base64,${b64}) format('woff2')`;
}

function vorlage({ eyebrow, titel, akzent }) {
  const anton = schriftAlsDatenUrl('anton-latin-400-normal.woff2');
  const mono = schriftAlsDatenUrl('space-mono-latin-700-normal.woff2');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face{font-family:'Anton';src:${anton};}
  @font-face{font-family:'Space Mono';src:${mono};font-weight:700;}
  *{margin:0;padding:0;box-sizing:border-box;}
  body{width:1200px;height:630px;background:#15161a;color:#fff;position:relative;overflow:hidden;}
  .streifen{height:18px;background:repeating-linear-gradient(-45deg,${akzent} 0 26px,#15161a 26px 52px);}
  .inhalt{padding:74px 80px 0;}
  .eyebrow{font-family:'Space Mono',monospace;font-weight:700;font-size:22px;letter-spacing:0.14em;
    text-transform:uppercase;color:${akzent};margin-bottom:26px;}
  h1{font-family:'Anton',sans-serif;text-transform:uppercase;font-size:96px;line-height:0.98;
    letter-spacing:0.005em;max-width:16ch;}
  h1.lang{font-size:72px;}
  h1.sehrlang{font-size:58px;}
  .fuss{position:absolute;left:80px;bottom:58px;display:flex;align-items:center;gap:18px;}
  .wortmarke{font-family:'Anton',sans-serif;font-size:30px;letter-spacing:0.02em;text-transform:uppercase;}
  .wortmarke span{color:${akzent};}
  .ort{font-family:'Space Mono',monospace;font-size:18px;color:#9a9a9a;letter-spacing:0.08em;text-transform:uppercase;}
  .ecke{position:absolute;right:0;bottom:0;width:340px;height:340px;
    background:repeating-linear-gradient(-45deg,${akzent} 0 20px,transparent 20px 40px);opacity:0.14;}
  </style></head><body>
  <div class="streifen"></div>
  <div class="ecke"></div>
  <div class="inhalt">
    <div class="eyebrow">${eyebrow}</div>
    <h1 class="${titel.length > 42 ? 'sehrlang' : titel.length > 26 ? 'lang' : ''}">${titel}</h1>
  </div>
  <div class="fuss">
    <div class="wortmarke">No Comfort<span>.</span>Zone</div>
    <div class="ort">Karlsruhe</div>
  </div>
  </body></html>`;
}

(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  fs.mkdirSync(ZIEL, { recursive: true });
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await br.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  let gesamt = 0;
  for (const seite of seitenFuerTeilbilder()) {
    await p.setContent(vorlage(seite));
    await p.evaluate(() => document.fonts.ready);
    const datei = path.join(ZIEL, seite.datei);
    await p.screenshot({ path: datei });
    const kb = fs.statSync(datei).size / 1024;
    gesamt += kb;
    console.log(`  ${seite.datei.padEnd(26)} ${kb.toFixed(1).padStart(6)} KB   ${seite.titel}`);
  }
  console.log(`\n  ${'zusammen'.padEnd(26)} ${gesamt.toFixed(1).padStart(6)} KB`);
  await br.close();
})();
