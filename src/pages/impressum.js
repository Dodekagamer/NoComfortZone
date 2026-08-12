const { site } = require('../lib/layout');

module.exports = {
  url: '/impressum/',
  title: 'Impressum — No Comfort Zone',
  description: 'Impressum von No Comfort Zone.',
  content: () => `
<section>
  <div class="wrap legal">
    <span class="draft-badge">Entwurf — rechtlich noch zu prüfen</span>
    <h2>Impressum</h2>
    <p>Angaben gemäß § 5 TMG. Dies ist ein Platzhaltertext und muss vor dem Live-Betrieb der Seite durch geprüfte, vollständige und rechtsverbindliche Angaben ersetzt werden (u. a. Rechtsform, vertretungsberechtigte Person, ggf. Registereintrag, USt-IdNr.).</p>

    <h2>Verantwortlich</h2>
    <p>No Comfort Zone<br>
    ${site.contact.address}<br>
    E-Mail: <a href="mailto:${site.contact.email}">${site.contact.email}</a><br>
    Telefon: ${site.contact.phoneDisplay}</p>

    <h2>Haftungshinweis</h2>
    <p>Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.</p>
  </div>
</section>
`
};
