const { site } = require('../lib/layout');

module.exports = {
  url: '/datenschutz/',
  title: 'Datenschutz — No Comfort Zone',
  description: 'Datenschutzerklärung von No Comfort Zone.',
  content: () => `
<section>
  <div class="wrap legal">
    <span class="draft-badge">Entwurf — rechtlich noch zu prüfen</span>
    <h2>Datenschutzerklärung</h2>
    <p>Dies ist ein Platzhaltertext und muss vor dem Live-Betrieb der Seite durch eine vollständige, DSGVO-konforme Datenschutzerklärung ersetzt werden.</p>

    <h2>Verantwortliche Stelle</h2>
    <p>No Comfort Zone, ${site.contact.address}, <a href="mailto:${site.contact.email}">${site.contact.email}</a></p>

    <h2>Kontaktformulare &amp; Buchungsanfragen</h2>
    <p>Die Anfrage-/Buchungsformulare dieser Website senden keine Daten an einen Server. Beim Absenden öffnet sich dein E-Mail-Programm bzw. WhatsApp mit einer vorausgefüllten Nachricht an ${site.contact.email} — die von dir eingegebenen Daten werden ausschließlich über den von dir gewählten Kanal (E-Mail oder WhatsApp) direkt an uns übermittelt, nicht über diese Website gespeichert oder verarbeitet.</p>

    <h2>Hosting &amp; Cookies</h2>
    <p>Diese Website bindet Google Fonts sowie das Animations-Framework GSAP über externe CDN-Server ein. Beim Aufruf der Seite kann dadurch eine Verbindung zu diesen Anbietern hergestellt werden. Eine eigene Cookie- oder Trackingnutzung durch No Comfort Zone findet aktuell nicht statt.</p>

    <h2>Deine Rechte</h2>
    <p>Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung deiner personenbezogenen Daten. Wende dich dazu an <a href="mailto:${site.contact.email}">${site.contact.email}</a>.</p>
  </div>
</section>
`
};
