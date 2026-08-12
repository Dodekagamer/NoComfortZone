const { pageHero, inquiryForm } = require('../lib/components');
const { site } = require('../lib/layout');

module.exports = {
  url: '/kontakt/',
  title: 'Kontakt — No Comfort Zone',
  description:
    'Kontaktiere No Comfort Zone: allgemeine Anfragen sowie Kooperationsanfragen für Unternehmen und Schulen.',
  content: () => `
${pageHero(
  'Wie erreiche ich euch?',
  'Kontakt',
  'Ob Frage, Feedback oder Kooperationsanfrage — wir freuen uns, von dir zu hören.'
)}

<section>
  <div class="wrap">
    <div class="footer-grid" style="margin-bottom:50px;">
      <div>
        <h3>Direkt erreichen</h3>
        <a href="mailto:${site.contact.email}">${site.contact.email}</a>
        <a href="tel:${site.contact.phoneHref}">${site.contact.phoneDisplay}</a>
        <p>${site.contact.address}</p>
      </div>
      <div>
        <h3>Social</h3>
        ${site.social.map((s) => `<a href="${s.url}">${s.label}${s.placeholder ? ' (bald)' : ''}</a>`).join('\n        ')}
      </div>
    </div>
    ${inquiryForm('form-kontakt', 'Allgemeine Anfrage', 'Allgemeine Anfrage', 'Schreib uns, wobei wir helfen können.', 'Deine Nachricht an uns')}
  </div>
</section>

<div class="hazard-strip thin"></div>

<section id="unternehmen-schulen">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Kooperationen</span>
      <h2>Unternehmen &amp; Schulen</h2>
      <p>Ob betriebliches Gesundheitsmanagement, Firmenfitness, Schul-AGs oder Jugendhilfe-Kooperationen — wir entwickeln gemeinsam mit euch ein passendes Angebot für eure Organisation.</p>
    </div>
    ${inquiryForm('form-b2b', 'Unternehmen/Schule Kooperation', 'Kooperation anfragen', 'Erzähl uns von deiner Organisation und was du dir vorstellst (z. B. Firmenfitness, Schul-AG, Workshop).', 'z. B. Firmenfitness für 20 Mitarbeitende, wöchentlich')}
  </div>
</section>
`
};
