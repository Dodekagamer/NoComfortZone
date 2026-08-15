const { site } = require('../lib/layout');
const { esc, safeUrl } = require('../lib/escape');

module.exports = {
  url: '/datenschutz/',
  title: 'Datenschutz — No Comfort Zone',
  description: 'Datenschutzerklärung von No Comfort Zone gemäß DSGVO.',
  content: () => `
<section>
  <div class="wrap legal">
    <span class="draft-badge">Struktur vollständig · Name/Anschrift noch einzutragen</span>
    <h2>Datenschutzerklärung</h2>
    <p>Wir freuen uns über dein Interesse an No Comfort Zone. Der Schutz deiner personenbezogenen Daten ist uns wichtig. Nachfolgend informieren wir dich gemäß Art. 13 DSGVO über die Verarbeitung deiner Daten beim Besuch dieser Website.</p>

    <h2>Verantwortlicher</h2>
    <p>${esc(site.legal.responsibleName)}<br>
    ${esc(site.legal.street)}<br>
    ${esc(site.legal.postalCode)} ${esc(site.legal.city)}<br>
    E-Mail: <a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a><br>
    Telefon: <a href="tel:${esc(site.contact.phoneHref)}">${esc(site.contact.phoneDisplay)}</a></p>

    <h2>Hosting (GitHub Pages)</h2>
    <p>Diese Website wird über GitHub Pages gehostet (Anbieter: GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA). Beim Aufruf der Seite verarbeitet GitHub als Hosting-Anbieter automatisch technische Zugriffsdaten (u. a. IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, verwendeter Browser) in Server-Logfiles. Dies ist für den technischen Betrieb und die sichere Auslieferung der Website erforderlich (Art. 6 Abs. 1 lit. f DSGVO, berechtigtes Interesse an einem funktionsfähigen und sicheren Betrieb der Website). Details zur Datenverarbeitung durch GitHub: <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub Privacy Statement</a>.</p>

    <h2>Kontakt- &amp; Buchungsformulare</h2>
    <p>Die Anfrage-/Buchungsformulare dieser Website (z. B. Probetraining, Mitgliedschaft, Haki Sports, Unternehmens-/Schulanfragen) senden keine Daten an einen Server und werden von uns nicht auf dieser Website gespeichert. Beim Absenden öffnet sich clientseitig dein E-Mail-Programm bzw. WhatsApp mit einer vorausgefüllten Nachricht an ${esc(site.contact.email)} bzw. ${esc(site.contact.phoneDisplay)}. Die von dir eingegebenen Daten (z. B. Name, E-Mail-Adresse, Nachricht) werden ausschließlich über den von dir gewählten Kanal — dein eigenes E-Mail-Programm oder WhatsApp — direkt an uns übermittelt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Bearbeitung deiner Anfrage bzw. Anbahnung eines Vertrags) bzw. Art. 6 Abs. 1 lit. f DSGVO für allgemeine Anfragen. Für die anschließende Kommunikation per E-Mail oder WhatsApp gelten die Datenschutzbestimmungen des jeweiligen Anbieters.</p>

    <h2>Externe Schriftarten (Google Fonts)</h2>
    <p>Diese Website bindet aktuell Schriftarten (Anton, Space Mono, Inter) über Google Fonts ein, die beim Aufruf der Seite direkt von Servern von Google (fonts.googleapis.com, fonts.gstatic.com) geladen werden. Dabei wird deine IP-Adresse an Google übertragen; Google kann technische Daten wie IP-Adresse, Browsereinstellungen und Aufrufzeitpunkt erheben. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer einheitlichen, performanten Darstellung der Website). Mehr Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Datenschutzerklärung von Google</a>. <strong>Wir planen kurzfristig die Umstellung auf lokal auf unserem eigenen Server gehostete Schriftarten</strong>, wodurch diese Datenübertragung an Google vollständig entfällt — dieser Abschnitt wird dann entsprechend aktualisiert bzw. entfernt.</p>

    <h2>Cookies &amp; Tracking</h2>
    <p>Diese Website setzt keine Cookies und kein Tracking (z. B. Analytics, Reichweitenmessung) ein. Alle Skripte werden von unserem eigenen Server ausgeliefert; außer den oben genannten Schriftarten werden keine Inhalte von Drittanbietern nachgeladen.</p>

    <h2>Speicherdauer</h2>
    <p>Daten aus Kontakt-/Buchungsformularen werden nicht auf dieser Website gespeichert (siehe oben). Technische Zugriffsdaten (Server-Logfiles) werden nach den Vorgaben des Hosting-Anbieters GitHub verarbeitet und automatisiert gelöscht bzw. anonymisiert.</p>

    <h2>Deine Rechte</h2>
    <p>Du hast jederzeit das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO) sowie Widerspruch gegen die Verarbeitung (Art. 21 DSGVO) bezüglich deiner personenbezogenen Daten. Wende dich dazu an <a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a>.</p>

    <h2>Beschwerderecht bei der Aufsichtsbehörde</h2>
    <p>Du hast außerdem das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig ist:<br>
    Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg<br>
    Königstraße 10a, 70173 Stuttgart<br>
    <a href="https://www.baden-wuerttemberg.datenschutz.de/" target="_blank" rel="noopener noreferrer">www.baden-wuerttemberg.datenschutz.de</a></p>

    <h2>Änderungen dieser Datenschutzerklärung</h2>
    <p>Wir passen diese Datenschutzerklärung an, sobald sich die Datenverarbeitung auf dieser Website ändert (z. B. bei Umstellung auf lokal gehostete Schriftarten/Skripte oder Einführung neuer Funktionen wie Online-Zahlung oder eines Mitgliederbereichs).</p>

    <p class="note-small">Hinweis: Diese Erklärung ist inhaltlich vollständig strukturiert, es fehlen aber noch Name und Anschrift der verantwortlichen Person (Platzhalter oben, direkt in <code>src/lib/site.json</code> unter <code>legal</code> eintragbar). Vor dem Live-Betrieb empfehlen wir zusätzlich eine kurze rechtliche Prüfung.</p>
  </div>
</section>
`
};
