const { pageHero, ctaBand } = require('../lib/components');
const { esc } = require('../lib/escape');
const { offers } = require('../lib/offers.json');

module.exports = {
  url: '/angebote/',
  title: 'Angebote — No Comfort Zone',
  description:
    'Boxen, Calisthenics, Outdoor-Training, Kindertraining und Präventionskurse — die Community-Angebote von No Comfort Zone im Überblick.',
  content: () => `
${pageHero(
  'Was bekomme ich?',
  'Unsere Angebote',
  'No Comfort Zone bündelt Community-Training für alle Alters- und Leistungsstufen. Draußen, in der Gruppe, mit echten Trainern und echtem Zusammenhalt.',
  'Probetraining buchen',
  '/buchung/'
)}

<section>
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Community-Training</span>
      <h2>Programme im Überblick</h2>
      <p>Alle Angebote sind Teil der No-Comfort-Zone-Community — buchbar über eine Mitgliedschaft oder als Probetraining. Tipp auf ein Angebot für alle Details.</p>
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

${ctaBand('Finde dein Angebot.', 'Zielgruppen ansehen', '/zielgruppe/', '', 'Mitgliedschaft & Preise', '/mitgliedschaft/')}
`
};
