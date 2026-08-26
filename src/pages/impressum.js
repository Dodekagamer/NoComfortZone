const { site } = require('../lib/layout');
const { esc, safeUrl } = require('../lib/escape');

module.exports = {
  url: '/impressum/',
  title: 'Impressum — No Comfort Zone',
  description:
    'Impressum von No Comfort Zone aus Karlsruhe: Anbieterkennzeichnung nach § 5 TMG und § 18 MStV, Kontaktdaten und Hinweise zur Haftung.',
  content: () => `
<section>
  <div class="wrap legal">
    <span class="draft-badge">Struktur vollständig · Name/Anschrift &amp; USt-Status noch einzutragen</span>
    <h1>Impressum</h1>
    <h2>Angaben gemäß § 5 TMG</h2>
    <p>${esc(site.legal.responsibleName)}<br>
    ${esc(site.legal.street)}<br>
    ${esc(site.legal.postalCode)} ${esc(site.legal.city)}<br>
    Deutschland</p>

    <h2>Kontakt</h2>
    <p>E-Mail: <a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a><br>
    Telefon: <a href="tel:${esc(site.contact.phoneHref)}">${esc(site.contact.phoneDisplay)}</a></p>

    <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
    <p>${esc(site.legal.responsibleName)}<br>
    ${esc(site.legal.street)}<br>
    ${esc(site.legal.postalCode)} ${esc(site.legal.city)}</p>

    <h2>Umsatzsteuer</h2>
    <p>${esc(site.legal.vatStatus)}</p>

    <h2>Haftung für Inhalte</h2>
    <p>Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>

    <h2>Haftung für Links</h2>
    <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>

    <h2>Streitschlichtung</h2>
    <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>. Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>

    <p class="note-small">Hinweis: Dieses Impressum ist rechtlich vollständig strukturiert (§ 5 TMG / § 18 Abs. 2 MStV), es fehlen aber noch Name, Anschrift und der Umsatzsteuer-Status der verantwortlichen Person (siehe Platzhalter oben, direkt in <code>src/lib/site.json</code> unter <code>legal</code> eintragbar). Vor dem Live-Betrieb empfehlen wir zusätzlich eine kurze anwaltliche Prüfung, insbesondere solange noch kein Gewerbe angemeldet ist.</p>
  </div>
</section>
`
};
