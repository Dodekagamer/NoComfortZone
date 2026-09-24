/**
 * Trainingszeiten und Termine.
 *
 * Solange `training` in termine.json leer ist, sagt die Seite genau das —
 * ehrlich, statt einen leeren Kalender oder ein "bald verfügbar" hinzustellen.
 * Sobald der erste Eintrag drinsteht, erscheint überall automatisch eine
 * Tabelle: auf /angebote/, auf der jeweiligen Angebotsseite gefiltert, und in
 * den strukturierten Daten als Öffnungszeiten.
 *
 * Ein Eintrag sieht so aus:
 *
 *   {
 *     "tag": "Dienstag",
 *     "von": "19:00",
 *     "bis": "20:30",
 *     "angebot": "boxen",              (slug aus offers.json, optional)
 *     "titel": "10x10 Sunday Circle",  (eigener Name der Einheit, optional)
 *     "ort": "Günther-Klotz-Anlage",
 *     "adresse": "Am Sportpark 5, 76131 Karlsruhe",   (optional, wird verlinkt)
 *     "hinweis": "Treffpunkt am Spielplatz"           (optional)
 *   }
 *
 * Und ein Termin in `events`:
 *
 *   { "datum": "2026-10-04", "titel": "Herbstlauf", "ort": "...", "text": "..." }
 */
const { esc, safeUrl } = require('./escape');
const daten = require('./termine.json');

const TAGE = [
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
  'Sonntag'
];

/** schema.org erwartet englische Kürzel für Öffnungszeiten. */
const TAG_SCHEMA = {
  Montag: 'Monday',
  Dienstag: 'Tuesday',
  Mittwoch: 'Wednesday',
  Donnerstag: 'Thursday',
  Freitag: 'Friday',
  Samstag: 'Saturday',
  Sonntag: 'Sunday'
};

const UHRZEIT = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATUM = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Fehler in den Daten sollen den Build anhalten, nicht still eine kaputte
 * Tabelle ausliefern — dieselbe Linie wie bei den Angeboten.
 */
function pruefeDaten(bekannteSlugs) {
  daten.training.forEach((t, i) => {
    const wo = `src/lib/termine.json: Trainingszeit ${i + 1}`;
    if (!TAGE.includes(t.tag)) {
      throw new Error(`${wo}: "${t.tag}" ist kein Wochentag. Erlaubt: ${TAGE.join(', ')}.`);
    }
    for (const feld of ['von', 'bis']) {
      if (!UHRZEIT.test(t[feld] || '')) {
        throw new Error(`${wo}: "${feld}" muss eine Uhrzeit wie "19:00" sein, ist aber "${t[feld]}".`);
      }
    }
    if (t.bis <= t.von) throw new Error(`${wo}: "bis" (${t.bis}) liegt nicht nach "von" (${t.von}).`);
    if (!t.ort) throw new Error(`${wo}: "ort" fehlt — ohne Treffpunkt nützt die Zeit niemandem.`);
    if (t.angebot && !bekannteSlugs.includes(t.angebot)) {
      throw new Error(
        `${wo}: "${t.angebot}" ist kein Angebot aus offers.json. Bekannt: ${bekannteSlugs.join(', ')}.`
      );
    }
  });

  daten.events.forEach((e, i) => {
    const wo = `src/lib/termine.json: Termin ${i + 1}`;
    if (!DATUM.test(e.datum || '')) {
      throw new Error(`${wo}: "datum" muss im Format 2026-10-04 stehen, ist aber "${e.datum}".`);
    }
    if (!e.titel) throw new Error(`${wo}: "titel" fehlt.`);
  });
}

/**
 * Die erste feste Einheit — fuer Stellen, die in einem Satz sagen wollen, was
 * regelmaessig laeuft, ohne die ganze Tabelle zu zeigen. Null, solange nichts
 * eingetragen ist.
 */
function festeEinheit() {
  return sortiert(daten.training)[0] || null;
}

function hatTraining() {
  return daten.training.length > 0;
}

/** Termine, die noch nicht vorbei sind — vergangene blendet die Seite aus. */
function kommendeEvents(heute = new Date()) {
  const grenze = heute.toISOString().slice(0, 10);
  return daten.events.filter((e) => e.datum >= grenze).sort((a, b) => a.datum.localeCompare(b.datum));
}

/** "2026-10-04" -> "Sonntag, 4. Oktober 2026" */
function datumLang(iso) {
  const [jahr, monat, tag] = iso.split('-').map(Number);
  const d = new Date(Date.UTC(jahr, monat - 1, tag));
  return d.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

function sortiert(liste) {
  return [...liste].sort(
    (a, b) => TAGE.indexOf(a.tag) - TAGE.indexOf(b.tag) || a.von.localeCompare(b.von)
  );
}

/**
 * Die Tabelle. `slug` filtert auf ein Angebot; ohne slug kommen alle Zeiten.
 * Gibt es (noch) keine Zeiten, liefert die Funktion den ehrlichen Hinweis
 * statt einer leeren Tabelle.
 */
function trainingszeiten({ slug = null, gruppe = null } = {}) {
  const passend = slug ? daten.training.filter((t) => t.angebot === slug) : daten.training;

  if (!passend.length) {
    const weg = gruppe
      ? ` Am schnellsten geht es über die WhatsApp-Gruppe <a href="${safeUrl(
          gruppe.url
        )}" target="_blank" rel="noopener noreferrer" class="inline-link">${esc(gruppe.label)}</a>.`
      : '';
    return `<p class="zeiten-offen">Hierfür gibt es noch keine festen Zeiten. Schreib uns kurz,
      dann sagen wir dir den nächsten Termin und den Treffpunkt.${weg}</p>`;
  }

  const zeilen = sortiert(passend)
    .map(
      (t) => `<tr>
        <th scope="row">${esc(t.tag)}</th>
        <td><time datetime="${esc(t.von)}">${esc(t.von)}</time>–<time datetime="${esc(t.bis)}">${esc(t.bis)}</time></td>
        <td>${bezeichnung(t, slug)}</td>
        <td>${esc(t.ort)}${karte(t)}${t.hinweis ? `<span class="zeiten-hinweis">${esc(t.hinweis)}</span>` : ''}</td>
      </tr>`
    )
    .join('\n      ');

  /* Die Tabelle zeigt die festen Termine. Dass daneben kurzfristig Einheiten
     entstehen, steht sonst nirgends — und wer die Tabelle sieht, haelt sie
     sonst fuer das ganze Angebot. */
  const spontan = gruppe
    ? `<p class="zeiten-nachsatz">Dazu entstehen immer wieder Einheiten außer der Reihe — kurzfristig
      abgesprochen in der WhatsApp-Gruppe
      <a href="${safeUrl(gruppe.url)}" target="_blank" rel="noopener noreferrer" class="inline-link">${esc(
        gruppe.label
      )}</a>.</p>`
    : '';

  return `<div class="zeiten-tabelle">
  <table>
    <caption class="visually-hidden">Trainingszeiten und Treffpunkte</caption>
    <thead>
      <tr><th scope="col">Tag</th><th scope="col">Uhrzeit</th><th scope="col">Training</th><th scope="col">Treffpunkt</th></tr>
    </thead>
    <tbody>
      ${zeilen}
    </tbody>
  </table>
</div>
${spontan}`;
}

/**
 * Was in der Spalte "Training" steht: der eigene Name der Einheit, sonst der
 * Name des Angebots. Auf einer gefilterten Angebotsseite waere Letzterer
 * doppelt — dort steht er nur, wenn die Einheit einen eigenen Namen hat.
 */
function bezeichnung(t, slug) {
  if (t.titel) return esc(t.titel);
  return t.angebot && !slug ? esc(angebotName(t.angebot)) : '';
}

/**
 * Die Anschrift als Kartenlink. OpenStreetMap statt Google: es wird nichts
 * geladen, bevor jemand tippt, und die Seite bleibt auch beim Weiterleiten bei
 * ihrer Linie, keine Dritten einzubinden.
 */
function karte(t) {
  if (!t.adresse) return '';
  const ziel = 'https://www.openstreetmap.org/search?query=' + encodeURIComponent(t.adresse);
  return `<span class="zeiten-adresse">${esc(t.adresse)} ·
    <a href="${safeUrl(ziel)}" target="_blank" rel="noopener noreferrer" class="inline-link">Karte</a></span>`;
}

let angebotNamen = {};
function setzeAngebotNamen(map) {
  angebotNamen = map;
}
function angebotName(slug) {
  return angebotNamen[slug] || slug;
}

/** Öffnungszeiten für die strukturierten Daten — nur wenn es welche gibt. */
function oeffnungszeiten() {
  if (!hatTraining()) return null;
  return sortiert(daten.training).map((t) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: `https://schema.org/${TAG_SCHEMA[t.tag]}`,
    opens: t.von,
    closes: t.bis
  }));
}

module.exports = {
  pruefeDaten,
  hatTraining,
  festeEinheit,
  kommendeEvents,
  datumLang,
  trainingszeiten,
  oeffnungszeiten,
  setzeAngebotNamen,
  TAGE
};
