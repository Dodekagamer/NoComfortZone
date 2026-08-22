const fs = require('fs');
const path = require('path');
const { pageHero, ctaBand } = require('../lib/components');
const { esc } = require('../lib/escape');
const { offers } = require('../lib/offers.json');

const IMG_DIR = path.join(__dirname, '..', 'assets', 'img', 'angebote');
const PLACEHOLDER = 'platzhalter.jpg';

/**
 * Solange ein Foto noch nicht hinterlegt ist, wird das Platzhalterbild
 * ausgeliefert und der Bildbereich als Platzhalter gekennzeichnet. Sobald die
 * Datei unter dem erwarteten Namen in src/assets/img/angebote/ liegt, wird sie
 * beim nächsten Build automatisch verwendet — ohne Codeänderung.
 */
function resolveImage(fileName) {
  const exists = fs.existsSync(path.join(IMG_DIR, fileName));
  return { src: `/assets/img/angebote/${exists ? fileName : PLACEHOLDER}`, isPlaceholder: !exists };
}

/** Liste der noch fehlenden Bilder — build.js gibt sie am Ende aus. */
function missingImages() {
  const missing = [];
  for (const offer of offers) {
    for (const s of offer.sections) {
      if (!fs.existsSync(path.join(IMG_DIR, s.image))) missing.push(`angebote/${s.image}`);
    }
  }
  return missing;
}

function renderSection(section, index) {
  const img = resolveImage(section.image);
  return `<section class="offer-detail${index % 2 === 1 ? ' is-reversed' : ''}">
  <div class="wrap offer-detail-grid">
    <div class="offer-detail-text">
      <span class="eyebrow">${String(index + 1).padStart(2, '0')}</span>
      <h2>${esc(section.heading)}</h2>
      <p>${esc(section.text)}</p>
    </div>
    <figure class="offer-detail-media${img.isPlaceholder ? ' is-placeholder' : ''}">
      <img src="${img.src}" alt="${esc(section.alt)}" width="1200" height="800"
           loading="lazy" decoding="async">
      ${img.isPlaceholder ? '<figcaption>Platzhalter — hier kommt euer eigenes Foto hin</figcaption>' : ''}
    </figure>
  </div>
</section>`;
}

const pages = offers.map((offer) => ({
  url: `/angebote/${offer.slug}/`,
  title: `${offer.title} — Angebote — No Comfort Zone`,
  description: offer.teaser,
  content: () => `
${pageHero(offer.tag, offer.title, offer.lead, 'Probetraining buchen', '/buchung/', 'Alle Angebote', '/angebote/')}

<nav class="breadcrumb" aria-label="Brotkrumen-Navigation">
  <div class="wrap">
    <a href="/angebote/">Angebote</a> <span aria-hidden="true">›</span> <span>${esc(offer.title)}</span>
  </div>
</nav>

${offer.sections.map(renderSection).join('\n\n')}

${ctaBand(
  `Lust auf ${offer.title}?`,
  'Probetraining buchen',
  '/buchung/',
  'Das erste Training ist kostenlos und unverbindlich.',
  'Andere Angebote ansehen',
  '/angebote/'
)}
`
}));

// dataFiles: zusaetzliche Quellen fuer das Sitemap-Datum (siehe build.js).
// Diese Seiten aendern sich, wenn offers.json sich aendert — nicht nur, wenn
// dieses Modul angefasst wird.
module.exports = { pages, missingImages, dataFiles: ['lib/offers.json'] };
