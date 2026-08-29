const { pageHero, priceCard, step, ctaBand, inquiryForm } = require('../lib/components');
const pricing = require('../lib/pricing.json');

module.exports = {
  url: '/mitgliedschaft/',
  title: 'Mitgliedschaft & Preise — No Comfort Zone',
  description:
    'Was kostet No Comfort Zone und wie wirst du Teil davon? Das erste Training ist kostenlos — feste Beiträge gibt es erst, wenn der Verein steht.',
  content: () => `
${pageHero(
  'Was kostet es? Wie werde ich Mitglied?',
  'Mitgliedschaft & Preise',
  'Das erste Training ist kostenlos und unverbindlich. Feste Monatsbeiträge gibt es erst, wenn No Comfort Zone als Verein eingetragen ist — bis dahin sagen wir dir ehrlich, wo wir stehen.',
  'Jetzt Probetraining buchen',
  '#anfrage'
)}

<section>
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Community-Mitgliedschaften</span>
      <h2>Heute mitmachen, später Mitglied werden</h2>
      <p>${pricing.noteText}</p>
    </div>
    <span class="price-note">${pricing.noteBadge}</span>
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
      <h2>Wie machst du mit?</h2>
    </div>
    <div class="steps">
      ${step('01', 'Probetraining buchen', 'Du meldest dich unverbindlich zu einem kostenlosen Probetraining an — über das Buchungsformular oder direkt per WhatsApp.')}
      ${step('02', 'Kennenlern-Gespräch', 'Wir lernen uns kennen, klären deine Ziele und finden das passende Training für dich — Gruppe oder 1:1 mit Haki Sports.')}
      ${step('03', 'Dabeibleiben', 'Passt es für beide Seiten, kommst du einfach weiter zum Training. Sobald der Verein steht, wird daraus eine richtige Mitgliedschaft — du erfährst es zuerst.')}
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="callout">
      <p><strong>Woran wir arbeiten:</strong> die Eintragung als Verein (No-Comfort-Zone e.&nbsp;V.) und darauf aufbauend echte Mitgliedschaften, Online-Anmeldung und -Zahlung, ein Mitgliederbereich und ein digitaler Trainingskalender. Bis dahin läuft alles persönlich — über das Kennenlern-Gespräch und die WhatsApp-Gruppe.</p>
    </div>
  </div>
</section>

<div class="hazard-strip thin"></div>

<section id="anfrage">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Direkt hier</span>
      <h2>Erstes Training anfragen</h2>
      <p>Kostenlos und unverbindlich. Du musst dich zu nichts entscheiden — auch nicht zu einer Mitgliedschaft, die es noch gar nicht gibt.</p>
    </div>
    ${inquiryForm(
      'form-probetraining',
      'Probetraining',
      'Probetraining anfragen',
      'Erzähl uns kurz, welches Training dich interessiert und wann es dir passt.',
      'z. B. Interesse an Boxen, dienstags abends'
    )}
  </div>
</section>

${ctaBand('Noch Fragen offen?', 'Häufige Fragen lesen', '/haeufige-fragen/', '', 'Kontakt aufnehmen', '/kontakt/')}
`
};
