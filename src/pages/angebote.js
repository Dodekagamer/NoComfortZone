const { pageHero, offerCard, ctaBand } = require('../lib/components');

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
      <p>Alle Angebote sind Teil der No-Comfort-Zone-Community — buchbar über eine Mitgliedschaft oder als Probetraining.</p>
    </div>
    <div class="offer-grid">
      ${offerCard('Kampfsport', 'Boxen', 'Technik, Kondition und Kopf frei bekommen — im Gruppentraining unter Anleitung, für Einsteiger und Fortgeschrittene.')}
      ${offerCard('Bodyweight', 'Calisthenics', 'Krafttraining mit dem eigenen Körpergewicht, draußen an der frischen Luft — Aufbau von Kraft, Beweglichkeit und Körperkontrolle.')}
      ${offerCard('Outdoor', 'Outdoor-Training', 'Funktionelles Ganzkörpertraining im Freien, mitten in der Gesellschaft statt im geschlossenen Studio.')}
      ${offerCard('Kids', 'Kindertraining', 'Bewegung, Teamgeist und Selbstvertrauen für Kinder und Jugendliche — spielerisch und altersgerecht.')}
      ${offerCard('Prävention', 'Präventionskurse (40+)', 'Mobility, funktionelles Training und Krankenkassenkurse für ein langfristig aktives Leben.')}
      ${offerCard('Events', 'Community-Events', 'Gemeinsame Veranstaltungen, Challenges und Treffen abseits des regulären Trainings — Details folgen laufend.')}
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="callout">
      <p><strong>Sucht ihr 1:1-Personal-Training?</strong> Die Angebote oben sind Community-/Gruppenprogramme von No Comfort Zone. Für individuelles, professionelles 1:1-Coaching gibt es <a href="/haki-sports/">Haki Sports</a> — unser eigenständiges Personal-Training-Angebot innerhalb der Bewegung.</p>
    </div>
  </div>
</section>

${ctaBand('Finde dein Angebot.', 'Zielgruppen ansehen', '/zielgruppe/', '', 'Mitgliedschaft & Preise', '/mitgliedschaft/')}
`
};
