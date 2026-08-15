const { site } = require('../lib/layout');
const { esc } = require('../lib/escape');

module.exports = {
  url: '/barrierefreiheit/',
  title: 'Barrierefreiheit — No Comfort Zone',
  description:
    'Erklärung zur Barrierefreiheit der Website von No Comfort Zone: Stand der Umsetzung nach WCAG 2.1 AA, bekannte Einschränkungen und Kontakt für Rückmeldungen.',
  content: () => `
<section>
  <div class="wrap legal">
    <h1>Erklärung zur Barrierefreiheit</h1>
    <p>Wir möchten, dass diese Website für alle nutzbar ist — unabhängig von Sehvermögen, Motorik oder verwendeter Technik. Diese Erklärung beschreibt den aktuellen Stand.</p>

    <h2>Angestrebter Standard</h2>
    <p>Diese Website orientiert sich an den <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Stufe AA</strong>, dem Maßstab, auf den auch die europäische Norm EN 301 549 und das deutsche Barrierefreiheitsstärkungsgesetz (BFSG) verweisen. Ergänzend sind die neueren Kriterien aus WCAG 2.2 zu Zielgrößen und Fokussichtbarkeit umgesetzt.</p>

    <h2>Was bereits umgesetzt ist</h2>
    <ul>
      <li><strong>Kontraste:</strong> Alle Texte erfüllen mindestens 4,5:1, Bedienelemente wie Eingabefelder mindestens 3:1.</li>
      <li><strong>Tastaturbedienung:</strong> Die gesamte Website ist ohne Maus bedienbar. Der Fokus ist jederzeit deutlich sichtbar, das Menü lässt sich mit <kbd>Esc</kbd> schließen.</li>
      <li><strong>Sprungmarke:</strong> Ganz am Anfang jeder Seite führt ein Link direkt zum Inhalt und überspringt die Navigation.</li>
      <li><strong>Struktur:</strong> Jede Seite hat genau eine Hauptüberschrift, darunter eine logische Gliederung. Bereiche wie Navigation, Inhalt und Fußzeile sind technisch als solche ausgezeichnet.</li>
      <li><strong>Vergrößerung:</strong> Der Inhalt bleibt bis 320 Pixel Breite und bei 200 % Schriftgröße vollständig nutzbar, ohne seitliches Scrollen.</li>
      <li><strong>Formulare:</strong> Alle Felder haben sichtbare Beschriftungen, Pflichtfelder sind gekennzeichnet, Fehler werden im Text benannt und dem jeweiligen Feld technisch zugeordnet — nicht nur farblich.</li>
      <li><strong>Bewegung:</strong> Wer im Betriebssystem „Bewegung reduzieren" eingestellt hat, bekommt die Startseite ohne Scroll-Animation.</li>
      <li><strong>Ohne JavaScript:</strong> Inhalte und Kontaktwege bleiben auch dann erreichbar, wenn JavaScript blockiert ist.</li>
      <li><strong>Touch-Bedienung:</strong> Alle Schaltflächen und Links sind mindestens 44 × 44 Pixel groß.</li>
    </ul>

    <h2>Bekannte Einschränkungen</h2>
    <ul>
      <li>Die Schriftarten werden derzeit über Google Fonts geladen. Bei blockierter Verbindung greifen Systemschriften — die Lesbarkeit bleibt erhalten, das Layout kann leicht abweichen.</li>
      <li>Das Hintergrundfoto der Startseite ist gestalterisch und trägt keine eigene Information; es hat daher bewusst keine Bildbeschreibung.</li>
      <li>Die Inhalte sind in deutscher Sprache verfasst. Eine Fassung in Leichter Sprache oder Gebärdensprache gibt es noch nicht.</li>
    </ul>

    <h2>Rückmeldung und Kontakt</h2>
    <p>Ist dir etwas aufgefallen, das nicht barrierefrei nutzbar ist? Sag uns bitte Bescheid — wir bessern nach:</p>
    <p>E-Mail: <a href="mailto:${esc(site.contact.email)}" class="inline-link">${esc(site.contact.email)}</a><br>
    Telefon: <a href="tel:${esc(site.contact.phoneHref)}" class="inline-link">${esc(site.contact.phoneDisplay)}</a></p>
    <p>Wenn du auf deine Rückmeldung keine zufriedenstellende Antwort erhältst, kannst du dich an die Schlichtungsstelle nach § 16 BGG wenden: <a href="https://www.schlichtungsstelle-bgg.de/" target="_blank" rel="noopener noreferrer" class="inline-link">schlichtungsstelle-bgg.de</a>.</p>

    <p class="note-small">Diese Erklärung wurde zuletzt im August 2026 überprüft. Die Prüfung erfolgte durch eigene Tests (Tastaturbedienung, Kontrastmessung, Darstellung bei 320 Pixel Breite und 200 % Schriftgröße), nicht durch eine externe Zertifizierungsstelle.</p>
  </div>
</section>
`
};
