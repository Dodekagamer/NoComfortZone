const { pageHero, ctaBand } = require('../lib/components');
const { esc, safeUrl } = require('../lib/escape');
const site = require('../lib/site.json');

/* Antworten stehen nur hier drin, wenn sie belegt sind — durch die Seite selbst
   oder durch eine Aussage von No Comfort Zone. Wo etwas noch nicht feststeht
   (Trainingszeiten, Beiträge), sagt die Antwort genau das, statt etwas
   Plausibles zu erfinden.

   Die Antworten werden bewusst als HTML eingesetzt (nicht escaped), damit
   Links und Hervorhebungen darin funktionieren. Das ist nur sicher, solange
   sie hier im Quelltext stehen. Wandern sie einmal in eine Datendatei oder
   ein Redaktionssystem, muss vorher escaped werden. */
const fragen = [
  {
    f: 'Muss ich Mitglied sein, um mitzumachen?',
    a: `Nein. Dein erstes Training ist kostenlos und unverbindlich — du musst dich vorher zu nichts
        anmelden und danach zu nichts verpflichten. Feste Mitgliedschaften gibt es aktuell ohnehin
        noch nicht, siehe die nächste Frage.`
  },
  {
    f: 'Seid ihr ein eingetragener Verein?',
    a: `Noch nicht. No Comfort Zone ist heute eine Bewegung und eine Trainingsgemeinschaft. Die
        Eintragung als <strong>No-Comfort-Zone e.&nbsp;V.</strong> ist das Ziel — erst damit gibt es
        echte Mitgliedschaften, Beiträge und eine feste Struktur. Wo wir stehen, steht offen auf der
        Seite <a href="/mitgliedschaft/" class="inline-link">Mitgliedschaft</a>.`
  },
  {
    f: 'Was kostet das Ganze?',
    a: `Das erste Training kostet nichts. Darüber hinaus gibt es noch keine festen Beiträge, weil es
        noch keinen Verein gibt — und wir stellen hier bewusst keine erfundenen Zahlen hin. Sobald
        Beiträge feststehen, erfährst du es rechtzeitig und vorher.`
  },
  {
    f: 'Ich bin unsportlich und war lange nicht mehr aktiv. Passt das trotzdem?',
    a: `Ja. Das Training ist offen für alle Alters- und Leistungsstufen — vom ersten Versuch bis zum
        ambitionierten Training. Genau dafür gibt es die Gruppe: Niemand fängt oben an, und niemand
        trainiert allein.`
  },
  {
    f: 'Wo und wann trainiert ihr?',
    a: `Draußen in Karlsruhe. Treffpunkte und Termine stimmen wir aktuell direkt ab — am schnellsten
        über unsere WhatsApp-Gruppe, sonst über das Formular. Sobald feste Zeiten stehen,
        veröffentlichen wir sie hier auf der Seite.`
  },
  {
    f: 'Was brauche ich für das erste Training?',
    a: `Sportsachen, die dreckig werden dürfen, und etwas zu trinken. Wenn für ein bestimmtes Angebot
        mehr nötig ist — zum Beispiel Handschuhe fürs Boxen — sagen wir dir das vorher. Du musst
        nichts kaufen, um einmal mitzumachen.`
  },
  {
    f: 'Was ist der Unterschied zwischen No Comfort Zone und Haki Sports?',
    a: `<strong>No Comfort Zone</strong> ist die Gemeinschaft: offene Gruppentrainings, gemeinsame
        Events, Zusammenhalt. <strong>Haki Sports</strong> ist etwas anderes — professionelles
        1:1-Coaching für Menschen, die individuell und unter persönlicher Anleitung an sich arbeiten
        wollen. Mehr dazu auf der Seite <a href="/haki-sports/" class="inline-link">Haki Sports</a>.`
  },
  {
    f: 'Gibt es etwas für Kinder und Jugendliche?',
    a: `Ja — Kindertraining und Angebote für Jugendliche gehören von Anfang an dazu. Einen Überblick
        gibt es unter <a href="/angebote/" class="inline-link">Angebote</a>, die Einordnung nach
        Lebenssituation unter <a href="/zielgruppe/" class="inline-link">Zielgruppe</a>.`
  },
  {
    f: 'Wie melde ich mich an?',
    a: `Für ein Probetraining reicht eine kurze Nachricht: über das
        <a href="/buchung/" class="inline-link">Anfrageformular</a> oder direkt per WhatsApp. Eine
        förmliche Anmeldung gibt es nicht — du sagst uns Bescheid, wir sagen dir, wann es losgeht.`
  },
  {
    f: 'Ich vertrete ein Unternehmen oder eine Schule. Geht das?',
    a: `Ja. Für Firmenfitness, Schul-AGs, Workshops und ähnliche Kooperationen gibt es ein eigenes
        Formular auf der Seite <a href="/kontakt/" class="inline-link">Kontakt</a>. Schreib kurz, um
        wen es geht und was ihr euch vorstellt — wir melden uns.`
  }
];

module.exports = {
  url: '/haeufige-fragen/',
  title: 'Häufige Fragen — No Comfort Zone',
  description:
    'Muss ich Mitglied sein? Was kostet es? Wo trainiert ihr? Die häufigsten Fragen zu No Comfort Zone und Haki Sports — offen beantwortet.',
  content: () => `
${pageHero(
  'Bevor du fragst',
  'Häufige Fragen',
  'Die Fragen, die uns am häufigsten gestellt werden — ehrlich beantwortet, auch da, wo die Antwort noch „steht nicht fest“ lautet.',
  'Erstes Training anfragen',
  '/angebote/#anfrage'
)}

<section>
  <div class="wrap">
    <div class="faq">
      ${fragen
        .map(
          (q, i) => `<details class="faq-item"${i === 0 ? ' open' : ''}>
        <summary>${esc(q.f)}</summary>
        <div class="faq-antwort"><p>${q.a.replace(/\s+/g, ' ').trim()}</p></div>
      </details>`
        )
        .join('\n      ')}
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="callout">
      <p><strong>Deine Frage steht nicht dabei?</strong> Schreib uns an
      <a href="mailto:${esc(site.contact.email)}" class="inline-link">${esc(site.contact.email)}</a>,
      per WhatsApp oder über das <a href="/kontakt/" class="inline-link">Kontaktformular</a>. Wir
      antworten auch auf unbequeme Fragen.${
        site.groups && site.groups[0]
          ? ` Am schnellsten geht es in der WhatsApp-Gruppe <a href="${safeUrl(
              site.groups[0].url
            )}" target="_blank" rel="noopener noreferrer" class="inline-link">${esc(
              site.groups[0].label
            )}</a>.`
          : ''
      }</p>
    </div>
  </div>
</section>

${ctaBand('Am Ende hilft nur hingehen.', 'Erstes Training anfragen', '/angebote/#anfrage', '', 'Angebote ansehen', '/angebote/')}
`
};
