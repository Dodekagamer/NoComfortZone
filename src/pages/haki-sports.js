const { pageHero, step, priceCard, ctaBand, inquiryForm } = require('../lib/components');
const site = require('../lib/site.json');
const { esc, safeUrl } = require('../lib/escape');
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
  'Haki Sports anfragen',
  '#anfrage'
)}

<section>
  <div class="wrap">
    <div class="callout">
      <p><strong>Wichtig zu wissen:</strong> No Comfort Zone ist unsere Community und Bewegung — offene Gruppentrainings, gemeinsame Events, Zusammenhalt. Haki Sports ist etwas anderes: professionelles 1:1-Coaching für Menschen, die individuell und unter persönlicher Anleitung an sich arbeiten wollen. Community-Angebote findest du unter <a href="/angebote/">Angebote</a>.</p>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">So läuft’s ab</span>
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
      <p>${esc(pricing.hakiNoteText)}</p>
    </div>
    <span class="price-note">${esc(pricing.hakiNoteBadge)}</span>
    <div class="pricing-grid">
      ${pricing.hakiCoaching.map((plan) => priceCard(plan)).join('\n      ')}
    </div>
  </div>
</section>

${(() => {
  const ig = site.social.find((s) => s.brand === 'haki');
  return ig
    ? `<section>
  <div class="wrap">
    <div class="callout">
      <p><strong>Einblicke ins Coaching:</strong> Auf Instagram zeigt Haki Sports Trainingsausschnitte und Fortschritte aus dem 1:1-Coaching — <a href="${safeUrl(ig.url)}" target="_blank" rel="noopener noreferrer" class="inline-link">@haki.sports</a>.</p>
    </div>
  </div>
</section>`
    : '';
})()}

<div class="hazard-strip thin"></div>

<section id="anfrage">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Direkt hier</span>
      <h2>Erstgespräch anfragen</h2>
      <p>Unverbindlich. Im Gespräch klären wir dein Ziel, den passenden Umfang — und erst dann den Preis.</p>
    </div>
    ${inquiryForm('haki')}
  </div>
</section>

${ctaBand('Lieber erst die Bewegung dahinter kennenlernen?', 'No Comfort Zone entdecken', '/vision-werte/', '', 'Häufige Fragen', '/haeufige-fragen/')}
`
};
