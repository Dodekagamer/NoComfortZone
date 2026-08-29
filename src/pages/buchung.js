const { pageHero, inquiryForm } = require('../lib/components');

module.exports = {
  url: '/buchung/',
  title: 'Buchung — Probetraining, Mitgliedschaft & Haki Sports',
  description:
    'Probetraining anfragen, sich für die spätere Mitgliedschaft vormerken lassen oder Haki Sports 1:1 Coaching buchen — alle Wege zu No Comfort Zone an einem Ort.',
  content: () => `
${pageHero(
  'Wie mache ich mit?',
  'Buchung',
  'Probetraining, Vormerkung für die spätere Mitgliedschaft oder 1:1 Coaching bei Haki Sports — wähle unten die passende Anfrage. Formular ausfüllen und per E-Mail oder WhatsApp senden, wir melden uns zeitnah zurück.'
)}

<section id="probetraining">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Community-Training</span>
      <h2>Probetraining buchen</h2>
      <p>Ein kostenloses, unverbindliches Training zum Kennenlernen von No Comfort Zone.</p>
    </div>
    ${inquiryForm('form-probetraining', 'Probetraining', 'Probetraining anfragen', 'Erzähl uns kurz, welches Training dich interessiert und wann es dir passt.', 'z. B. Interesse an Boxen, dienstags abends')}
  </div>
</section>

<div class="hazard-strip thin"></div>

<section id="mitgliedschaft-buchen">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Community-Mitgliedschaft</span>
      <h2>Auf die Mitgliedschaft warten</h2>
      <p>Feste Mitgliedschaften gibt es erst, wenn No Comfort Zone als Verein eingetragen ist. Wenn du dann von Anfang an dabei sein willst, sag hier Bescheid — wir melden uns, sobald es losgeht.</p>
    </div>
    ${inquiryForm('form-mitgliedschaft', 'Mitgliedschaft', 'Vormerken lassen', 'Sag uns, was dich interessieren würde (z. B. Community oder Familie) — dann melden wir uns, sobald Mitgliedschaften starten.', 'z. B. Interesse an Community-Mitgliedschaft')}
    <p class="form-note stack-top-sm">Wo wir gerade stehen: <a href="/mitgliedschaft/" class="inline-link">Mitgliedschaft &amp; Beiträge</a></p>
  </div>
</section>

<div class="hazard-strip thin"></div>

<section class="theme-haki-section" id="haki-sports">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Haki Sports · 1:1 Coaching</span>
      <h2>Haki Sports buchen</h2>
      <p>Professionelles Personal Training, individuell auf dich zugeschnitten. Details zum Angebot: <a href="/haki-sports/" class="inline-link">Haki Sports ansehen</a>.</p>
    </div>
    ${inquiryForm('form-haki', 'Haki Sports Buchung', 'Haki Sports anfragen', 'Beschreibe kurz dein Ziel (z. B. Kraftaufbau, Gewichtsreduktion, Wettkampfvorbereitung) und deine bevorzugten Zeiten.', 'z. B. Ziel: Kraftaufbau, 2x pro Woche')}
  </div>
</section>
`
};
