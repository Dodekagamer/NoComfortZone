const { pageHero, ctaBand } = require('../lib/components');
const { kommendeEvents, datumLang } = require('../lib/termine');
const { hatStimmen, stimmenKarten } = require('../lib/stimmen');
const site = require('../lib/site.json');
const { esc, safeUrl } = require('../lib/escape');

module.exports = {
  url: '/community/',
  title: 'Community — No Comfort Zone',
  description:
    'Echte Stimmen aus der No-Comfort-Zone-Bewegung. Zugehörigkeit, Zusammenhalt und der Weg zum eingetragenen Verein.',
  content: () => `
${pageHero(
  'Wie fühlt sich No Comfort Zone an?',
  'Community',
  'Kein Hochglanz. Nur echte Menschen, die gemeinsam gewachsen sind. Das ist der Kern unserer Bewegung — und der Grund, warum wir langfristig ein Verein werden wollen.',
  'Jetzt Teil werden',
  '/buchung/'
)}

${
  hatStimmen()
    ? `<section class="community" id="stimmen">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Aus der Bewegung</span>
      <h2>Echte Stimmen</h2>
      <p>Menschen, die schon eine Weile dabei sind — und beschreiben, was sich für sie verändert hat.</p>
    </div>
    ${stimmenKarten()}
  </div>
</section>`
    : ''
}

<section>
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Der nächste Schritt</span>
      <h2>Auf dem Weg zum Verein</h2>
      <p>No Comfort Zone ist heute eine Bewegung — und soll mittelfristig als No-Comfort-Zone e.V. offiziell organisiert sein, um Mitgliedern, Ehrenamtlichen und Partnern eine feste Struktur zu geben.</p>
    </div>
    ${kommendeEvents().length
      ? `<div class="event-liste">
      ${kommendeEvents()
        .map(
          (e) => `<article class="event">
        <time class="event-datum" datetime="${esc(e.datum)}">${esc(datumLang(e.datum))}</time>
        <h3>${esc(e.titel)}</h3>
        ${e.ort ? `<p class="event-ort">${esc(e.ort)}</p>` : ''}
        ${e.text ? `<p>${esc(e.text)}</p>` : ''}
      </article>`
        )
        .join('\n      ')}
    </div>`
      : `<div class="coming-soon">
      <span class="eyebrow">Kommende Events</span>
      <p>Aktuell steht kein gemeinsamer Termin fest. Veranstaltungen, Challenges und Treffen sprechen wir in den WhatsApp-Gruppen ab — dort erfährst du es zuerst.</p>
    </div>`}
  </div>
</section>

<div class="hazard-strip thin"></div>

<section id="kanaele">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Mitreden</span>
      <h2>Unsere Kanäle</h2>
      <p>Hier passiert der Alltag der Bewegung: Trainingstermine, Absprachen, Eindrücke. Der schnellste Weg, dabei zu sein.</p>
    </div>
    <div class="offer-grid">
      ${site.groups
        .map(
          (g) => `<div class="offer-card">
        <span class="tag">WhatsApp-Gruppe</span>
        <h3>${esc(g.label)}</h3>
        <p>${esc(g.note)}</p>
        <p class="stack-top-sm"><a href="${safeUrl(g.url)}" class="btn small" target="_blank" rel="noopener noreferrer">Gruppe beitreten</a></p>
      </div>`
        )
        .join('\n      ')}
      ${site.social
        .map(
          (s) => `<div class="offer-card">
        <span class="tag">${s.url.includes('youtube') ? 'YouTube' : 'Instagram'}</span>
        <h3>${esc(s.label.replace(/^(Instagram|YouTube):\s*/, ''))}</h3>
        <p>${
          s.url.includes('youtube')
            ? 'Videos von Sessions und Einblicke in die Bewegung.'
            : s.brand === 'haki'
              ? 'Einblicke ins 1:1-Coaching von Haki Sports.'
              : 'Bilder und Momente aus dem Community-Training.'
        }</p>
        <p class="stack-top-sm"><a href="${safeUrl(s.url)}" class="btn small" target="_blank" rel="noopener noreferrer">Ansehen</a></p>
      </div>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>

${ctaBand('Werde Teil von No Comfort Zone.', 'Mitgliedschaft ansehen', '/mitgliedschaft/', '', 'Probetraining buchen', '/buchung/')}
`
};
