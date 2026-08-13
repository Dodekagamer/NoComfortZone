const { pageHero, step, priceCard, ctaBand } = require('../lib/components');
const pricing = require('../lib/pricing.json');

module.exports = {
  url: '/haki-sports/',
  title: 'Haki Sports — Professionelles 1:1 Coaching',
  description:
    'Haki Sports ist das professionelle 1:1-Coaching-Angebot innerhalb von No Comfort Zone — individuelles Personal Training statt Community-Gruppentraining.',
  bodyClass: 'theme-haki',
  content: () => `
${pageHero(
  'Was ist Haki Sports?',
  'Professionelles 1:1 Coaching.',
  'Haki Sports ist das eigenständige Personal-Training-Angebot innerhalb von No Comfort Zone. Kein Gruppentraining, keine Community-Session — sondern individuelle Betreuung, ganz auf dich und deine Ziele zugeschnitten.',
  'Haki Sports buchen',
  '/buchung/#haki-sports'
)}

<section>
  <div class="wrap">
    <div class="callout">
      <p><strong>Wichtig zu wissen:</strong> No Comfort Zone ist unsere Community und Bewegung — offene Gruppentrainings, Mitgliedschaften, Zusammenhalt. Haki Sports ist etwas anderes: professionelles 1:1-Coaching für Menschen, die individuell und unter persönlicher Anleitung an sich arbeiten wollen. Community-Angebote findest du unter <a href="/angebote/">Angebote</a>.</p>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">So läuft's ab</span>
      <h2>Dein Weg zum Coaching</h2>
    </div>
    <div class="steps">
      ${step('01', 'Erstgespräch', 'Wir klären deine Ziele, deinen Trainingsstand und deine zeitlichen Möglichkeiten — unverbindlich und persönlich.')}
      ${step('02', 'Individueller Trainingsplan', 'Du bekommst einen auf dich zugeschnittenen Plan, abgestimmt auf deine Ziele und deinen Alltag.')}
      ${step('03', 'Laufendes Coaching', 'Regelmäßige 1:1-Einheiten mit persönlicher Betreuung, Anpassung und Fortschrittskontrolle.')}
    </div>
  </div>
</section>

<div class="hazard-strip thin"></div>

<section>
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Coaching-Pakete</span>
      <h2>Was kostet Haki Sports?</h2>
    </div>
    <span class="price-note">${pricing.note}</span>
    <div class="pricing-grid">
      ${pricing.hakiCoaching.map((plan) => priceCard(plan)).join('\n      ')}
    </div>
  </div>
</section>

${ctaBand('Bereit für individuelles Coaching?', 'Haki Sports anfragen', '/buchung/#haki-sports', '', 'Zurück zu No Comfort Zone', '/vision-werte/')}
`
};
