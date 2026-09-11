/**
 * Welche Seite welches Teilen-Vorschaubild bekommt.
 *
 * Diese Liste wird an zwei Stellen gebraucht und darf deshalb nicht zweimal
 * dastehen: `tools/share-images.js` rendert daraus die PNGs, und `layout.js`
 * setzt daraus das og:image der jeweiligen Seite. Fehlt zu einer Seite ein
 * Bild, faellt sie auf das Hero-Foto zurueck — und der Build sagt Bescheid.
 */
const { offers } = require('./offers.json');

/** Gelb statt Orange, wo Haki Sports die Marke traegt. */
const HAZARD = '#ff4b12';
const SAFETY = '#ffc738';

const SEITEN = [
  { url: '/', eyebrow: 'Karlsruhe · Draußen · Für alle', titel: 'Wir bauen eine Bewegung.' },
  { url: '/vision-werte/', eyebrow: 'Vision & Werte', titel: 'Sport ist unser Werkzeug.' },
  { url: '/angebote/', eyebrow: 'Angebote', titel: 'Training für alle, die anfangen wollen.' },
  { url: '/zielgruppe/', eyebrow: 'Für wen', titel: 'Von 6 bis 60. Wirklich für alle.' },
  { url: '/mitgliedschaft/', eyebrow: 'Mitmachen', titel: 'Das erste Training kostet nichts.' },
  { url: '/buchung/', eyebrow: 'Anfragen', titel: 'Sag Bescheid, wir melden uns.' },
  { url: '/community/', eyebrow: 'Community', titel: 'Kein Hochglanz. Echte Menschen.' },
  { url: '/haki-sports/', eyebrow: 'Haki Sports · 1:1 Coaching', titel: 'Professionelles Personal Training.', akzent: SAFETY },
  { url: '/kontakt/', eyebrow: 'Kontakt', titel: 'Schreib uns. Auch unbequeme Fragen.' },
  { url: '/haeufige-fragen/', eyebrow: 'Häufige Fragen', titel: 'Ehrlich beantwortet.' }
];

function dateiname(url) {
  const rein = url.replace(/^\/|\/$/g, '').replace(/\//g, '-');
  return (rein || 'start') + '.png';
}

/** Die feste Liste plus ein Bild je Angebotsseite, aus offers.json erzeugt. */
function seitenFuerTeilbilder() {
  const ausAngeboten = offers.map((o) => ({
    url: `/angebote/${o.slug}/`,
    eyebrow: o.tag,
    titel: o.title
  }));
  return [...SEITEN, ...ausAngeboten].map((s) => ({
    ...s,
    akzent: s.akzent || HAZARD,
    datei: dateiname(s.url)
  }));
}

/** Der Dateiname zu einer URL — oder null, wenn diese Seite keines bekommt. */
function teilbildFuer(url) {
  const treffer = seitenFuerTeilbilder().find((s) => s.url === url);
  return treffer ? treffer.datei : null;
}

module.exports = { seitenFuerTeilbilder, teilbildFuer };
