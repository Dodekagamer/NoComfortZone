const { pageHero, ctaBand } = require('../lib/components');
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

<section class="community" id="stimmen">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Aus der Bewegung</span>
      <h2>Echte Stimmen</h2>
      <p>Drei Menschen, die schon eine Weile dabei sind — und beschreiben, was sich für sie verändert hat.</p>
    </div>
    <div class="testimonials">
      <div class="t-card">
        <p class="quote">„Ich bin heute stärker geworden — nicht nur körperlich, auch mental.“</p>
        <div class="who">Trainingsteilnehmer:in, Karlsruhe</div>
      </div>
      <div class="t-card">
        <p class="quote">„Zum ersten Mal habe ich das Gefühl, Teil von etwas Größerem zu sein.“</p>
        <div class="who">Teilnehmer:in, Familienprogramm</div>
      </div>
      <div class="t-card">
        <p class="quote">„Hier zählt nicht, wie gut ich heute bin — sondern wie weit wir gemeinsam kommen.“</p>
        <div class="who">Teilnehmer:in, Jugendtraining</div>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Der nächste Schritt</span>
      <h2>Auf dem Weg zum Verein</h2>
      <p>No Comfort Zone ist heute eine Bewegung — und soll mittelfristig als No-Comfort-Zone e.V. offiziell organisiert sein, um Mitgliedern, Ehrenamtlichen und Partnern eine feste Struktur zu geben.</p>
    </div>
    <div class="coming-soon">
      <span class="eyebrow">Kommende Events</span>
      <p>Hier erscheinen bald gemeinsame Veranstaltungen, Challenges und Community-Treffen. Termine und kurzfristige Absprachen laufen bis dahin über unsere WhatsApp-Gruppen.</p>
    </div>
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
