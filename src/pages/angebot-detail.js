const fs = require('fs');
const path = require('path');
const { pageHero, ctaBand } = require('../lib/components');
const { esc } = require('../lib/escape');
const { offers } = require('../lib/offers.json');

const IMG_DIR = path.join(__dirname, '..', 'assets', 'img', 'angebote');
const PLACEHOLDER = 'platzhalter.svg';

/**
 * Zwei Dinge gelten nur fuer den Platzhalter:
 * - Das Bild traegt seinen Hinweis selbst ("Foto folgt"). Eine zusaetzliche
 *   Bildunterschrift waere doppelt; die frueher hier stehende Notiz "hier
 *   kommt euer eigenes Foto hin" richtete sich ohnehin an uns und stand
 *   sichtbar auf der oeffentlichen Seite.
 * - Der alt-Text aus offers.json beschreibt das ECHTE Foto. Solange der
 *   Platzhalter zu sehen ist, waere er schlicht falsch — Screenreader wuerden
 *   ein Bild ansagen, das es nicht gibt. Deshalb bleibt alt dort leer
 *   (dekoratives Bild); sobald das Foto liegt, greift der Text automatisch.
 *
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

/**
 * offers.json wird von Hand gepflegt (Texte, Bildnamen, Alt-Texte). Ein
 * vergessenes Feld landete bisher als „undefined“ sichtbar auf der Seite,
 * ein doppelter slug liess eine ganze Angebotsseite verschwinden. Beides
 * faellt jetzt beim Bauen auf, nicht erst den Besuchern.
 */
function pruefeDaten() {
  if (!Array.isArray(offers) || offers.length === 0) {
    throw new Error(
      'src/lib/offers.json: die Liste "offers" ist leer. Ohne Angebote haetten ' +
        'die Angebotsseite und die Navigation nichts zu zeigen — das faellt sonst ' +
        'erst auf der fertigen Website auf.'
    );
  }
  const slugs = new Map();
  offers.forEach((offer, i) => {
    const wo = `offers[${i}]${offer.slug ? ` ("${offer.slug}")` : ''}`;
    for (const feld of ['slug', 'tag', 'title', 'teaser', 'lead']) {
      if (!offer[feld] || !String(offer[feld]).trim()) {
        throw new Error(`src/lib/offers.json: ${wo} fehlt das Feld "${feld}".`);
      }
    }
    if (!/^[a-z0-9-]+$/.test(offer.slug)) {
      throw new Error(
        `src/lib/offers.json: ${wo} hat einen unbrauchbaren slug — erlaubt sind ` +
          `Kleinbuchstaben, Ziffern und Bindestriche (daraus wird die Adresse).`
      );
    }
    if (slugs.has(offer.slug)) {
      throw new Error(
        `src/lib/offers.json: slug "${offer.slug}" wird zweimal verwendet ` +
          `(${slugs.get(offer.slug)} und ${wo}). Jede Adresse darf es nur einmal geben.`
      );
    }
    slugs.set(offer.slug, wo);

    if (!Array.isArray(offer.sections) || offer.sections.length !== 3) {
      throw new Error(
        `src/lib/offers.json: ${wo} braucht genau 3 Abschnitte, hat aber ` +
          `${Array.isArray(offer.sections) ? offer.sections.length : 0}.`
      );
    }
    offer.sections.forEach((s, j) => {
      for (const feld of ['heading', 'text', 'image', 'alt']) {
        if (!s[feld] || !String(s[feld]).trim()) {
          throw new Error(`src/lib/offers.json: ${wo}, Abschnitt ${j + 1} fehlt "${feld}".`);
        }
      }
      // Der Dateiname wird zu einem Pfad im src-Attribut. Nur unbedenkliche
      // Zeichen zulassen: ein Anfuehrungszeichen darin koennte sonst aus dem
      // Attribut ausbrechen, und Schraegstriche wuerden aus dem Bildordner
      // herausfuehren.
      if (!/^[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp|svg)$/.test(s.image)) {
        throw new Error(
          `src/lib/offers.json: ${wo}, Abschnitt ${j + 1} hat einen unbrauchbaren ` +
            `Dateinamen "${s.image}". Erlaubt sind Buchstaben, Ziffern, Punkt, ` +
            `Bindestrich und Unterstrich, mit Endung .jpg/.jpeg/.png/.webp/.svg.`
        );
      }
    });
  });
}

pruefeDaten();

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
      <img src="${esc(img.src)}" alt="${img.isPlaceholder ? 'Platzhalter, Foto folgt' : esc(section.alt)}"
           width="1200" height="800" loading="lazy" decoding="async">
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
