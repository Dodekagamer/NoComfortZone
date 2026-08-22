const { pageHero, ctaBand } = require('../lib/components');

function audienceRow(tag, title, text, ctaText, ctaHref) {
  return `<div class="audience-row">
  <span class="tag">${tag}</span>
  <h3>${title}</h3>
  <div>
    <p>${text}</p>
    <a href="${ctaHref}" class="row-cta">${ctaText} →</a>
  </div>
</div>`;
}

module.exports = {
  url: '/zielgruppe/',
  title: 'Zielgruppe — Für wen ist No Comfort Zone? ',
  description:
    'No Comfort Zone richtet sich an junge Erwachsene, Jugendliche, Familien, Menschen ab 40, Unternehmen und Schulen — mit jeweils passenden Angeboten.',
  content: () => `
${pageHero(
  'Für wen ist es?',
  'No Comfort Zone ist für jeden ein Platz.',
  'Wir richten uns nicht an „alle“ — sondern an Menschen, die sich verändern möchten. Egal ob jung, älter, allein, in der Familie oder als Organisation: Es gibt ein passendes Angebot.',
  'Passendes Angebot finden',
  '/angebote/'
)}

<section>
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Im Überblick</span>
      <h2>Sechs Wege zu uns</h2>
      <p>Such dir die Gruppe, die am ehesten zu deiner Situation passt — der Einstieg ist überall das kostenlose Probetraining.</p>
    </div>
    <div class="audience-list">
      ${audienceRow('18–35', 'Junge Erwachsene', 'Sport verbunden mit Gemeinschaft — Motivation, soziale Kontakte und gemeinsame Ziele statt Anonymität im Fitnessstudio. Du bekommst: feste Trainingsgruppe, echte Vorbilder, sichtbare Fortschritte.', 'Probetraining buchen', '/buchung/')}
      ${audienceRow('Jugend', 'Jugendliche', 'Boxen, Calisthenics und gemeinsames Training für Selbstvertrauen, Disziplin und Teamgeist — mit echten Vorbildern. Du bekommst: sicheren Rahmen, klare Regeln, echten Zusammenhalt.', 'Probetraining buchen', '/buchung/')}
      ${audienceRow('Familie', 'Familien', 'Kindertraining, Familienmitgliedschaften und Veranstaltungen — Eltern und Kinder gemeinsam in Bewegung. Du bekommst: gemeinsame Zeit, altersgerechte Programme, Familienrabatt.', 'Mitgliedschaft ansehen', '/mitgliedschaft/')}
      ${audienceRow('40+', 'Menschen ab 40', 'Präventionsangebote, Mobility, funktionelles Training und Krankenkassenkurse für ein langfristig aktives Leben. Du bekommst: angepasste Intensität, Fokus auf Gesundheit statt Leistung.', 'Angebote ansehen', '/angebote/')}
      ${audienceRow('B2B', 'Unternehmen', 'Firmenfitness, Workshops und Gesundheitsangebote für das betriebliche Gesundheitsmanagement. Du bekommst: individuelle Kooperationsmodelle für dein Team.', 'Kooperation anfragen', '/kontakt/#unternehmen-schulen')}
      ${audienceRow('Schulen', 'Schulen &amp; soziale Einrichtungen', 'Schul-AGs, Jugendhilfe und Kooperationen, damit Kinder früh lernen, wie wichtig Bewegung für ihre Entwicklung ist. Du bekommst: erfahrene Trainer, altersgerechte Konzepte.', 'Kooperation anfragen', '/kontakt/#unternehmen-schulen')}
    </div>
  </div>
</section>

${ctaBand('Dein Platz wartet.', 'Jetzt Probetraining buchen', '/buchung/', '', 'Alle Angebote ansehen', '/angebote/')}
`
};
