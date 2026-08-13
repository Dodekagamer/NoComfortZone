const { pageHero, ctaBand } = require('../lib/components');

module.exports = {
  url: '/vision-werte/',
  title: 'Vision & Werte — No Comfort Zone',
  description:
    'Was ist No Comfort Zone? Unsere Mission, Geschichte und die sechs Werte, an denen wir uns jeden Tag messen lassen.',
  content: () => `
${pageHero(
  'Was ist No Comfort Zone?',
  'Sport ist unser Werkzeug. Der Mensch ist unser Ziel.',
  'No Comfort Zone ist eine wachsende Sport- und Gesundheitsbewegung aus Karlsruhe. Wir bringen Menschen zusammen — draußen, mitten in der Gesellschaft — und nutzen Sport als Werkzeug, um stärkere, disziplinierte und verbundene Menschen zu formen. Wir bauen keine Sportgruppe. Wir bauen eine Bewegung.',
  'Jetzt mitmachen',
  '/buchung/'
)}

<section class="mission">
  <div class="wrap">
    <blockquote>
      Sport ist nicht unser Ziel. Es ist <span class="tool">unser Werkzeug.</span><br>
      Unser Ziel sind <span class="center">stärkere Menschen.</span>
    </blockquote>
    <div class="credit">— Die Idee hinter No Comfort Zone</div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Unsere Geschichte</span>
      <h2>Warum es No Comfort Zone gibt</h2>
      <p>Wir haben gesehen, wie viele Menschen sich im klassischen Fitnessstudio allein, anonym oder überfordert fühlen. No Comfort Zone entstand aus der Überzeugung, dass Bewegung erst dann wirklich verändert, wenn sie mit Gemeinschaft, Ehrlichkeit und echter Entwicklung verbunden ist.</p>
    </div>
    <div class="callout">
      <p><strong>Der Blick nach vorn:</strong> No Comfort Zone wächst als Bewegung — mit dem Ziel, mittelfristig als eingetragener Verein (No-Comfort-Zone e.V.) organisiert zu sein, mit eigener App, Mitgliederbereich, Trainingskalender und Standorten über Karlsruhe hinaus. Was du heute siehst, ist der Anfang.</p>
    </div>
  </div>
</section>

<div class="hazard-strip thin"></div>

<section id="werte">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Wofür wir stehen</span>
      <h2>Unsere Werte</h2>
      <p>Kein perfektes Fitnessbild. Echte Menschen, echte Geschichten — und Prinzipien, an denen wir uns jeden Tag messen lassen.</p>
    </div>
    <div class="values-grid">
      <div class="value-card">
        <span class="num">01 / Gemeinschaft</span>
        <h3>Gemeinsam statt allein</h3>
        <p>Niemand sollte alleine trainieren oder sich ausgeschlossen fühlen. Bei uns zählt nicht, wie gut jemand heute ist — sondern wie weit wir gemeinsam kommen.</p>
      </div>
      <div class="value-card">
        <span class="num">02 / Gesundheit</span>
        <h3>Mehr als Fitness</h3>
        <p>Bewegung, Ernährung, mentale Stärke, Regeneration, soziale Beziehungen. Uns geht es um langfristige Gesundheit, nicht kurzfristige Erfolge.</p>
      </div>
      <div class="value-card">
        <span class="num">03 / Authentizität</span>
        <h3>Echt statt perfekt</h3>
        <p>Wir zeigen echte Menschen mit echten Geschichten. Erfolge werden gefeiert, Rückschläge gehören genauso dazu.</p>
      </div>
      <div class="value-card">
        <span class="num">04 / Disziplin</span>
        <h3>Motivation vergeht. Disziplin bleibt</h3>
        <p>Wir helfen dabei, Routinen aufzubauen und Verantwortung für die eigene Gesundheit zu übernehmen.</p>
      </div>
      <div class="value-card">
        <span class="num">05 / Entwicklung</span>
        <h3>Jeder kann wachsen</h3>
        <p>Unabhängig vom Ausgangspunkt fördern wir kontinuierliche Entwicklung — körperlich, mental, persönlich.</p>
      </div>
      <div class="value-card">
        <span class="num">06 / Verantwortung</span>
        <h3>Sicherheit. Qualität. Respekt.</h3>
        <p>Wir übernehmen Verantwortung gegenüber unserer Community — für Ehrlichkeit und respektvollen Umgang miteinander.</p>
      </div>
    </div>
  </div>
</section>

${ctaBand('Bereit, Teil der Bewegung zu werden?', 'Community entdecken', '/community/', '', 'Mitglied werden', '/mitgliedschaft/')}
`
};
