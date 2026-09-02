const { pageHero, ctaBand, inquiryForm } = require('../lib/components');
const site = require('../lib/site.json');
const { esc, safeUrl } = require('../lib/escape');
const { offers } = require('../lib/offers.json');

module.exports = {
  url: '/angebote/',
  title: 'Angebote — No Comfort Zone',
  description:
    'Boxen, Calisthenics, Outdoor-Training, Kindertraining, Präventionskurse und Community-Events — alle Angebote von No Comfort Zone im Überblick.',
  content: () => `
${pageHero(
  'Was bekomme ich?',
  'Unsere Angebote',
  'No Comfort Zone bündelt Community-Training für alle Alters- und Leistungsstufen. Draußen, in der Gruppe, mit echten Trainern und echtem Zusammenhalt.',
  'Probetraining anfragen',
  '#anfrage'
)}

<section>
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Community-Training</span>
      <h2>Programme im Überblick</h2>
      <p>Alle Angebote sind Teil der No-Comfort-Zone-Community. Das erste Training ist immer kostenlos — tipp auf ein Angebot für alle Details.</p>
    </div>
    <div class="offer-grid">
      ${offers
        .map(
          (o) => `<a class="offer-card is-link" href="/angebote/${esc(o.slug)}/">
        <span class="tag">${esc(o.tag)}</span>
        <h3>${esc(o.title)}</h3>
        <p>${esc(o.teaser)}</p>
        <span class="offer-more">Mehr erfahren →</span>
      </a>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="callout">
      <p><strong>Sucht ihr 1:1-Personal-Training?</strong> Die Angebote oben sind Community-/Gruppenprogramme von No Comfort Zone. Für individuelles, professionelles 1:1-Coaching gibt es <a href="/haki-sports/" class="inline-link">Haki Sports</a> — unser eigenständiges Personal-Training-Angebot innerhalb der Bewegung.</p>
    </div>
  </div>
</section>

<div class="hazard-strip thin"></div>

<section id="anfrage">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Direkt hier</span>
      <h2>Erstes Training anfragen</h2>
      <p>Kostenlos und unverbindlich. Schreib dazu, was dich interessiert — wir melden uns mit dem nächsten passenden Termin.</p>
    </div>
    ${inquiryForm('probetraining')}
    ${(() => {
      const gruppe = site.groups && site.groups[0];
      return gruppe
        ? `<p class="form-nebenweg">Noch nicht bereit für ein Formular? Komm einfach in die
      WhatsApp-Gruppe <a href="${safeUrl(gruppe.url)}" target="_blank" rel="noopener noreferrer" class="inline-link">${esc(gruppe.label)}</a>
      — dort laufen Termine und kurzfristige Absprachen.</p>`
        : '';
    })()}
  </div>
</section>

${ctaBand('Für wen ist das alles?', 'Zielgruppen ansehen', '/zielgruppe/', '', 'Häufige Fragen', '/haeufige-fragen/')}
`
};
