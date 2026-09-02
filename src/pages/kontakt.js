const { pageHero, inquiryForm } = require('../lib/components');
const site = require('../lib/site.json');
const { esc, safeUrl } = require('../lib/escape');

module.exports = {
  url: '/kontakt/',
  title: 'Kontakt — No Comfort Zone',
  description:
    'Kontaktiere No Comfort Zone: allgemeine Anfragen sowie Kooperationsanfragen für Unternehmen und Schulen.',
  content: () => `
${pageHero(
  'Wie erreiche ich euch?',
  'Kontakt',
  'Ob Frage, Feedback oder Kooperationsanfrage — wir freuen uns, von dir zu hören. Viele Antworten stehen schon in den häufigen Fragen.',
  'Häufige Fragen ansehen',
  '/haeufige-fragen/'
)}

<section>
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Direkter Draht</span>
      <h2>So erreichst du uns</h2>
    </div>
    <div class="footer-grid">
      <div>
        <h3>Direkt erreichen</h3>
        <a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a>
        <a href="tel:${esc(site.contact.phoneHref)}">${esc(site.contact.phoneDisplay)}</a>
        <p>${esc(site.contact.address)}</p>
      </div>
      <div>
        <h3>Social Media</h3>
        ${site.social
          .map((s) => `<a href="${safeUrl(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>`)
          .join('\n        ')}
      </div>
      <div>
        <h3>WhatsApp-Gruppen</h3>
        ${site.groups
          .map((g) => `<a href="${safeUrl(g.url)}" target="_blank" rel="noopener noreferrer">${esc(g.label)}</a>`)
          .join('\n        ')}
      </div>
    </div>
    ${inquiryForm('kontakt')}
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
    ${inquiryForm('b2b')}
  </div>
</section>
`
};
