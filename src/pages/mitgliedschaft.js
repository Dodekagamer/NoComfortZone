const { pageHero, priceCard, step, ctaBand } = require('../lib/components');
const pricing = require('../lib/pricing.json');

module.exports = {
  url: '/mitgliedschaft/',
  title: 'Mitgliedschaft & Preise — No Comfort Zone',
  description:
    'Was kostet No Comfort Zone und wie wirst du Mitglied? Mitgliedschaftsstufen, Leistungen und die nächsten Schritte im Überblick.',
  content: () => `
${pageHero(
  'Was kostet es? Wie werde ich Mitglied?',
  'Mitgliedschaft & Preise',
  'Transparente, planbare Mitgliedschaften ohne versteckte Kosten. Wähle die Stufe, die zu dir passt — jederzeit monatlich kündbar.',
  'Jetzt Probetraining buchen',
  '/buchung/'
)}

<section>
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Community-Mitgliedschaften</span>
      <h2>Deine Mitgliedschaft</h2>
    </div>
    <span class="price-note">${pricing.note}</span>
    <div class="pricing-grid">
      ${pricing.nczMemberships.map((plan) => priceCard(plan)).join('\n      ')}
    </div>
  </div>
</section>

<div class="hazard-strip thin"></div>

<section>
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">So einfach geht’s</span>
      <h2>Wie werde ich Mitglied?</h2>
    </div>
    <div class="steps">
      ${step('01', 'Probetraining buchen', 'Du meldest dich unverbindlich zu einem kostenlosen Probetraining an — über das Buchungsformular oder direkt per WhatsApp.')}
      ${step('02', 'Kennenlern-Gespräch', 'Wir lernen uns kennen, klären deine Ziele und finden die passende Mitgliedschaft oder das passende Angebot für dich.')}
      ${step('03', 'Anmeldung & Loslegen', 'Du entscheidest dich für deine Mitgliedschaft, wir richten alles ein — und du bist Teil der Bewegung.')}
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="callout">
      <p><strong>Bald verfügbar:</strong> Online-Anmeldung und -Zahlung direkt über die Website, ein eigener Mitgliederbereich sowie ein digitaler Trainingskalender sind für die nächste Ausbaustufe von No Comfort Zone geplant. Aktuell läuft die Anmeldung persönlich über das Kennenlern-Gespräch.</p>
    </div>
  </div>
</section>

${ctaBand('Bereit für den ersten Schritt?', 'Probetraining buchen', '/buchung/', '', 'Fragen? Kontakt aufnehmen', '/kontakt/')}
`
};
