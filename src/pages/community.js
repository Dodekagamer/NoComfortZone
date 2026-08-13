const { pageHero, ctaBand } = require('../lib/components');

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
      <p>Kein Hochglanz. Nur echte Menschen, die gemeinsam gewachsen sind.</p>
    </div>
    <div class="testimonials">
      <div class="t-card">
        <p class="quote">"Ich bin heute stärker geworden — nicht nur körperlich, auch mental."</p>
        <div class="who">Trainingsteilnehmer:in, Karlsruhe</div>
      </div>
      <div class="t-card">
        <p class="quote">"Zum ersten Mal habe ich das Gefühl, Teil von etwas Größerem zu sein."</p>
        <div class="who">Teilnehmer:in, Familienprogramm</div>
      </div>
      <div class="t-card">
        <p class="quote">"Hier zählt nicht, wie gut ich heute bin — sondern wie weit wir gemeinsam kommen."</p>
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
      <p>Hier erscheinen bald gemeinsame Veranstaltungen, Challenges und Community-Treffen. Willst du informiert werden, sobald etwas ansteht?</p>
      <div style="margin-top:20px;">
        <a href="/kontakt/" class="btn small">Auf dem Laufenden bleiben</a>
      </div>
    </div>
  </div>
</section>

${ctaBand('Werde Teil von No Comfort Zone.', 'Mitgliedschaft ansehen', '/mitgliedschaft/', '', 'Probetraining buchen', '/buchung/')}
`
};
