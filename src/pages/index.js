const { ctaBand, quickAnswer, pillarCard } = require('../lib/components');

module.exports = {
  url: '/',
  title: 'No Comfort Zone — Wir bauen keine Sportgruppe. Wir bauen eine Bewegung.',
  description:
    'No Comfort Zone Karlsruhe: Sport, Gemeinschaft und persönliche Entwicklung. Community-Training und professionelles 1:1 Coaching mit Haki Sports — draußen, mitten in der Gesellschaft.',
  content: () => `
<!-- SCROLL INTRO: gepinnte Hero-Sequenz, wechselt beim Scrollen -->
<section class="scroll-intro" id="vision">
  <div class="intro-pin">
    <div class="intro-sweep" id="introSweep"></div>

    <div class="intro-panel p1" id="p1">
      <span class="eyebrow" style="margin-bottom:18px;">Unsere Mission</span>
      <h2>Sport ist nicht<br>unser Ziel.</h2>
    </div>

    <div class="intro-panel p2" id="p2">
      <h2 class="tool">Es ist unser<br>Werkzeug.</h2>
    </div>

    <div class="intro-panel p3" id="p3">
      <h2>Unser Ziel sind<br><span class="center">stärkere Menschen.</span></h2>
    </div>

    <div class="intro-panel final" id="p4">
      <div class="wrap" style="padding:0;">
        <div class="hero-tag">Karlsruhe · Draußen · Für alle</div>
        <h1>Wir bauen keine Sportgruppe.<br>Wir bauen <em>eine Bewegung.</em></h1>
        <p class="lead">Sport verbindet Menschen, stärkt Charakter, schafft Disziplin und verändert Leben. No Comfort Zone bringt Menschen zusammen — unabhängig von Alter, Herkunft oder Leistungsniveau. Draußen, mitten in der Gesellschaft.</p>
        <div class="cta-row">
          <a href="/angebote/" class="btn solid">Angebote ansehen</a>
          <a href="/buchung/" class="btn">Erstes Training kostenlos</a>
        </div>
      </div>
    </div>

    <div class="scroll-cue" id="scrollCue">Scroll</div>
  </div>
</section>

<div class="hazard-strip thin"></div>

<!-- AUF EINEN BLICK: beantwortet die wichtigsten Fragen innerhalb von Sekunden -->
<section id="auf-einen-blick">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Auf einen Blick</span>
      <h2>Alles, was du wissen musst</h2>
      <p>Kein langes Suchen — hier die Kurzfassung. Für mehr Details führt jede Kachel direkt zur passenden Seite.</p>
    </div>
    <div class="quickfacts-grid">
      ${quickAnswer('Was ist No Comfort Zone?', 'Eine Bewegung, kein Fitnessstudio', 'Community-Training, Werte und Zusammenhalt — draußen, mitten in der Gesellschaft. Kein perfektes Fitnessbild, echte Menschen.', 'Vision & Werte ansehen', '/vision-werte/')}
      ${quickAnswer('Was ist Haki Sports?', 'Unser 1:1-Coaching-Angebot', 'Professionelles Personal Training innerhalb von No Comfort Zone — individuell, für alle, die gezielt an sich arbeiten wollen.', 'Haki Sports entdecken', '/haki-sports/')}
      ${quickAnswer('Für wen ist es?', 'Für jeden ein Platz', 'Junge Erwachsene, Jugendliche, Familien, Menschen ab 40, Unternehmen und Schulen — jeweils mit passendem Angebot.', 'Zielgruppen ansehen', '/zielgruppe/')}
      ${quickAnswer('Was bekomme ich?', 'Training, Community, Entwicklung', 'Boxen, Calisthenics, Outdoor-Training und mehr — plus eine Gemeinschaft, die dich trägt.', 'Angebote ansehen', '/angebote/')}
      ${quickAnswer('Was kostet es?', 'Transparente Mitgliedschaften', 'Faire, planbare Mitgliedschaften und Coaching-Pakete. Aktuelle Beispielpreise auf der Mitgliedschaftsseite.', 'Preise ansehen', '/mitgliedschaft/')}
      ${quickAnswer('Wie mache ich mit?', 'Erstes Training kostenlos', 'Probetraining buchen, uns kennenlernen, danach entscheiden. Kein Risiko, keine Verpflichtung.', 'Jetzt buchen', '/buchung/')}
    </div>
  </div>
</section>

<!-- ZWEI SÄULEN: No Comfort Zone vs. Haki Sports -->
<section class="pillars">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Zwei Säulen, ein Ziel</span>
      <h2>Community &amp; Coaching</h2>
      <p>No Comfort Zone und Haki Sports gehören zusammen — aber sie sind nicht dasselbe. So findest du sofort das Richtige für dich.</p>
    </div>
    <div class="pillar-grid">
      ${pillarCard('ncz', 'No Comfort Zone', 'Community. Bewegung. Zukünftiger Verein.', 'Gemeinsames Training, Gemeinschaft und persönliche Entwicklung — draußen, für alle Altersgruppen und Leistungsniveaus. Das ist der Kern unserer Bewegung.', 'Mitglied werden', '/mitgliedschaft/')}
      ${pillarCard('haki', 'Haki Sports', 'Professionelles 1:1 Coaching.', 'Individuelles Personal Training für alle, die gezielt und unter persönlicher Betreuung an ihren Zielen arbeiten wollen — als eigenständiges Angebot innerhalb von No Comfort Zone.', 'Haki Sports buchen', '/haki-sports/')}
    </div>
  </div>
</section>

<!-- WERTE -->
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
    <div style="margin-top:40px;">
      <a href="/vision-werte/" class="btn">Vision &amp; Werte im Detail</a>
    </div>
  </div>
</section>

<div class="hazard-strip thin"></div>

<!-- ANGEBOTE / ZIELGRUPPEN (Teaser) -->
<section id="angebote">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Für jeden ein Platz</span>
      <h2>Angebote nach Zielgruppe</h2>
      <p>No Comfort Zone richtet sich nicht an "alle" — sondern an Menschen, die sich verändern möchten.</p>
    </div>
    <div class="audience-list">
      <div class="audience-row">
        <span class="tag">18–35</span>
        <h3>Junge Erwachsene</h3>
        <p>Sport verbunden mit Gemeinschaft — Motivation, soziale Kontakte und gemeinsame Ziele statt Anonymität im Fitnessstudio.</p>
      </div>
      <div class="audience-row">
        <span class="tag">Jugend</span>
        <h3>Jugendliche</h3>
        <p>Boxen, Calisthenics und gemeinsames Training für Selbstvertrauen, Disziplin und Teamgeist — mit echten Vorbildern.</p>
      </div>
      <div class="audience-row">
        <span class="tag">Familie</span>
        <h3>Familien</h3>
        <p>Kindertraining, Familienmitgliedschaften und Veranstaltungen — Eltern und Kinder gemeinsam in Bewegung.</p>
      </div>
    </div>
    <div style="margin-top:40px; display:flex; gap:16px; flex-wrap:wrap;">
      <a href="/angebote/" class="btn solid">Alle Angebote ansehen</a>
      <a href="/zielgruppe/" class="btn">Alle Zielgruppen ansehen</a>
    </div>
  </div>
</section>

<!-- COMMUNITY -->
<section class="community" id="community">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Aus der Bewegung</span>
      <h2>Echte Stimmen</h2>
      <p>Kein Hochglanz. Nur echte Menschen, die gemeinsam gewachsen sind.</p>
    </div>
    <div class="testimonials">
      <div class="t-card">
        <p class="quote">"Ich bin heute stärker geworden — nicht nur körperlich, auch mental."</p>
        <div class="who">Trainingsteilnehmer:in, Karlsruhe</div>
      </div>
      <div class="t-card">
        <p class="quote">"Zum ersten Mal habe ich das Gefühl, Teil von etwas Größerem zu sein."</p>
        <div class="who">Teilnehmer:in, Familienprogramm</div>
      </div>
      <div class="t-card">
        <p class="quote">"Hier zählt nicht, wie gut ich heute bin — sondern wie weit wir gemeinsam kommen."</p>
        <div class="who">Teilnehmer:in, Jugendtraining</div>
      </div>
    </div>
    <div style="margin-top:40px;">
      <a href="/community/" class="btn solid">Mehr aus der Community</a>
    </div>
  </div>
</section>

${ctaBand('Verlass deine Komfortzone.', 'Jetzt kostenlos reinschnuppern', '/buchung/', '', 'Mitgliedschaften ansehen', '/mitgliedschaft/')}
`
};
