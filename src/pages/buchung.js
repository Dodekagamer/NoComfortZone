const { pageHero, inquiryForm } = require('../lib/components');

module.exports = {
  url: '/buchung/',
  title: 'Buchung — Probetraining, Mitgliedschaft & Haki Sports',
  description:
    'Probetraining buchen, Mitglied werden oder Haki Sports 1:1 Coaching anfragen — alle Buchungswege von No Comfort Zone an einem Ort.',
  content: () => `
${pageHero(
  'Wie mache ich mit?',
  'Buchung',
  'Egal ob Probetraining, Mitgliedschaft oder 1:1 Coaching bei Haki Sports — wähle unten die passende Anfrage. Formular ausfüllen und per E-Mail oder WhatsApp senden, wir melden uns zeitnah zurück.'
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
      <h2>Mitglied werden</h2>
      <p>Du kennst uns schon oder willst direkt einsteigen? Hier kannst du deine Mitgliedschaft anfragen.</p>
    </div>
    ${inquiryForm('form-mitgliedschaft', 'Mitgliedschaft', 'Mitgliedschaft anfragen', 'Sag uns, welche Mitgliedschaft dich interessiert (z. B. Community oder Familie).', 'z. B. Interesse an Community-Mitgliedschaft')}
    <p class="form-note" style="margin-top:16px;">Details zu Leistungen & Preisen: <a href="/mitgliedschaft/" style="text-decoration:underline; text-decoration-color:var(--accent);">Mitgliedschaft & Preise</a></p>
  </div>
</section>

<div class="hazard-strip thin"></div>

<section class="theme-haki-section" id="haki-sports">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow" style="color:var(--safety);">Haki Sports · 1:1 Coaching</span>
      <h2>Haki Sports buchen</h2>
      <p>Professionelles Personal Training, individuell auf dich zugeschnitten. Details zum Angebot: <a href="/haki-sports/" style="text-decoration:underline;">Haki Sports ansehen</a>.</p>
    </div>
    ${inquiryForm('form-haki', 'Haki Sports Buchung', 'Haki Sports anfragen', 'Beschreibe kurz dein Ziel (z. B. Kraftaufbau, Gewichtsreduktion, Wettkampfvorbereitung) und deine bevorzugten Zeiten.', 'z. B. Ziel: Kraftaufbau, 2x pro Woche')}
  </div>
</section>
`
};
