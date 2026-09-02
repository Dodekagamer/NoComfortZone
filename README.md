# No Comfort Zone

Website von **No Comfort Zone** — Community, Bewegung und zukünftiger Verein — mit **Haki Sports** als eigenständigem 1:1-Coaching-Angebot innerhalb der Bewegung.

Statisch generierte, mehrseitige Website. Kein Framework, keine externen npm-Abhängigkeiten — der Build läuft mit reinem Node.js.

## Struktur

```
build.js                Baut die Website: liest src/pages/*.js, schreibt _site/
serve.js                Lokaler Vorschau-Server (ohne Abhängigkeiten)
.github/workflows/      Deploy nach GitHub Pages bei jedem Push auf main
src/
  lib/
    site.json           Navigation, Kontakt, Social-Links, Gruppen
    pricing.json        Mitgliedschaften und Coaching-Pakete
    offers.json         Die sechs Angebote samt Detailseiten-Inhalt
    layout.js           HTML-Grundgerüst: Head, CSP, Header, Footer
    components.js       Bausteine (Preis-Karte, Formulare, Hero, CTA-Band)
    escape.js           esc() und safeUrl() für alles aus den Datendateien
    structured-data.js  JSON-LD (Organisation, Website, Brotkrumen)
    base-path.js        /NoComfortZone bzw. leer bei eigener Domain
    minify.js           Entfernt Kommentare aus dem ausgelieferten Code
  pages/                Je Datei eine Seite; angebot-detail.js erzeugt sechs
  assets/
    css/styles.css      Design-System und alle Komponenten
    js/main.js          Menü, Hero-Sequenz, Einblendungen, Formularversand
    js/enhance.js       Winziges Vorab-Skript, wird ins HTML eingebettet
    fonts/              Anton, Space Mono, Inter (woff2, SIL OFL)
    img/                Hero in drei Breiten, Angebotsfotos, Platzhalter
worker/                 Cloudflare Worker für den garantierten Versand
  src/index.js          Nimmt das Formular an, verschickt über Brevo (EU)
  wrangler.toml         Empfänger, erlaubte Herkunft, Absenderadresse
  README.md             Einrichtung Schritt für Schritt
```

Jede Datei in `src/pages/` exportiert `{ url, title, description, content }` — `build.js` rendert sie mit dem gemeinsamen Layout und schreibt sie nach `_site/<url>/index.html`.

## Entwicklung

```bash
node build.js     # baut die Website nach _site/
node serve.js      # startet einen lokalen Vorschau-Server auf http://localhost:8080/NoComfortZone/
```

Keine `npm install` nötig — es gibt keine externen Abhängigkeiten. Der Vorschau-Server akzeptiert sowohl `/` als auch den echten Live-Pfad `/NoComfortZone/`.

## Sicherheit

- **Keine Drittanbieter, gar keine.** JavaScript, CSS, Schriften und Bilder kommen ausnahmslos vom eigenen Server; die Scroll-Animation der Startseite ist eigener Code (kein GSAP/CDN), die Schriften liegen lokal (kein Google Fonts). Beim Aufruf einer Seite geht keine einzige Anfrage an eine fremde Domain — nachgemessen im Browser.
- **Content-Security-Policy** als `<meta>` in `src/lib/layout.js`: `default-src 'none'`, `script-src 'self'` plus SHA-256-Abdruck des einen Inline-Skripts, `style-src 'self'` und `font-src 'self'` (beide ohne `'unsafe-inline'` und ohne fremde Domain), dazu `object-src`/`base-uri`/`form-action`/`frame-src` auf `'none'`. Damit die Policy so streng bleiben kann, enthält die Seite **keine Inline-Style-Attribute** — Layout-Abstände laufen über Utility-Klassen in `styles.css`. `frame-ancestors` fehlt bewusst: die Direktive wirkt nur als echter HTTP-Header, und GitHub Pages kann keine Header setzen. Wer Clickjacking-Schutz braucht, muss hinter einen Proxy/CDN mit Header-Kontrolle (z. B. Cloudflare) wechseln.
- **Daten aus `site.json`/`pricing.json` werden HTML-escaped** (`src/lib/escape.js`). Ihr könnt dort beliebigen Text eintragen — `Müller & Sohn`, Anführungszeichen, spitze Klammern — ohne die Seite zu zerlegen oder Markup einzuschleusen. URLs laufen zusätzlich durch `safeUrl()`, das nur `http(s):`, `mailto:`, `tel:` und relative Pfade durchlässt (ein versehentliches `javascript:` wird zu `#`). Inhalte in `src/pages/` sind bewusst ausgenommen — das ist Code und darf Markup enthalten.
- **Formulare**: Ist in `site.json` ein `formEndpoint` hinterlegt, geht die Anfrage per `fetch` an den Cloudflare Worker in `worker/` (siehe `worker/README.md`) und wird von dort über Brevo als E-Mail zugestellt — mit echter Empfangsbestätigung auf der Seite. Ist das Feld leer, fällt alles automatisch auf den `mailto:`/`wa.me`-Weg zurück. Beide Wege sind gegen CRLF- und Parameter-Injection getestet; Längenbegrenzungen verhindern überlange URLs, die Browser stillschweigend abschneiden würden. `formEndpoint` muss `https://` sein — sonst bricht der Build ab, statt stillschweigend kaputte Formulare auszuliefern.
- **Der Worker** begrenzt auf 5 Anfragen pro IP und 10 Minuten, weist Bodys über 16 KB ab, akzeptiert nur die bekannten Formulararten und entfernt Steuerzeichen aus allem, was in E-Mail-Kopfzeilen landet. Wichtig zu wissen: `ALLOWED_ORIGINS` allein ist **kein** Schutz — der Origin-Header lässt sich außerhalb eines Browsers frei setzen; die Bremse pro IP ist die eigentliche Absicherung.
- **Externe Links** tragen durchgängig `rel="noopener noreferrer"`.
- **GitHub-Actions-Rechte** sind minimal (`contents:read`, `pages:write`, `id-token:write`), und die Actions hängen an **Commit-SHAs** statt an beweglichen Tags — ein übernommenes Action-Repository kann `v4` umhängen, einen SHA nicht. Hinter jedem SHA steht als Kommentar die gemeinte Version; zum Aktualisieren siehe den Hinweis oben in `.github/workflows/pages.yml`.

## Deployment

`.github/workflows/pages.yml` baut die Seite bei jedem Push auf `main` und deployt `_site/` auf GitHub Pages. In den Repository-Einstellungen muss unter **Settings → Pages** die Quelle einmalig auf **GitHub Actions** gestellt werden.

**Live-URL:** `https://dodekagamer.github.io/NoComfortZone/`

GitHub Pages liefert dieses Repo (kein `<owner>.github.io`-Repo, keine eigene Domain) unter diesem Unterpfad aus. Deshalb rechnet `build.js` alle internen Links/Asset-Pfade über `src/lib/base-path.js` auf `/NoComfortZone` um (`SITE_BASE_PATH`/`SITE_ORIGIN` per Env-Variable überschreibbar). **Falls später eine eigene Domain per CNAME eingerichtet wird**, `SITE_BASE_PATH=""` und `SITE_ORIGIN` auf die eigene Domain setzen (z. B. als Env-Variablen im Workflow) — sonst zeigen alle Links weiterhin auf `/NoComfortZone/...`.

## Wichtige Hinweise vor dem echten Live-Betrieb

- **Preise** (`src/lib/pricing.json`): aktuell klar markierte Beispielpreise ("Beispielpreis"-Badge auf der Seite). Vor dem Launch durch echte Konditionen ersetzen.
- **Impressum / Datenschutz** (`src/pages/impressum.js`, `datenschutz.js`): rechtlich vollständig strukturiert (§ 5 TMG / DSGVO), es fehlen aber noch **Name, Anschrift und USt-Status** der verantwortlichen Person — direkt in `src/lib/site.json` unter `legal` eintragen (`responsibleName`, `street`, `postalCode`, `vatStatus`). Vor dem echten Live-Betrieb zusätzlich kurz rechtlich prüfen lassen, insbesondere solange noch kein Gewerbe angemeldet ist.
- **Formulare / garantierter Versand**: Solange `formEndpoint` in `src/lib/site.json` leer ist, öffnen die Formulare nur eine vorausgefüllte E-Mail bzw. WhatsApp-Nachricht — ob sie abgeschickt wird, erfährt niemand. Für garantierte Zustellung den Worker aus `worker/` einrichten (Anleitung: `worker/README.md`, ca. 20 Minuten) und die Adresse eintragen. Kontaktdaten weiterhin in `src/lib/site.json` pflegen.
  Der Datenschutztext passt sich automatisch an: Cloudflare und Brevo werden erst als Auftragsverarbeiter genannt, wenn der Endpunkt gesetzt ist.

## Analytics / Besucherzahlen (vorbereitet, bewusst nicht aktiviert)

Die Seite erhebt **keine** Daten, und GitHub Pages stellt euch keine Server-Logs bereit — ihr habt aktuell also keine Zahlen zu Besuchern. Wenn ihr das ändern wollt, ist eine cookielose, EU-gehostete Lösung der unkomplizierteste Weg (kein Cookie-Banner nötig, sofern keine Endgeräte-Daten gespeichert werden):

- **GoatCounter** (`goatcounter.com`, kostenlos für nicht-kommerzielle Nutzung) oder
- **Umami** / **Plausible** (selbst hostbar oder als EU-Cloud)

Einbindung in `src/lib/layout.js` direkt vor `</body>`, Beispiel GoatCounter:

```html
<script data-goatcounter="https://EUERNAME.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
```

Dann zusätzlich nötig:
1. **CSP erweitern** (ebenfalls `layout.js`): `script-src 'self' https://gc.zgo.at;` und `connect-src https://EUERNAME.goatcounter.com;` — sonst blockiert die Content-Security-Policy das Skript.
2. **Datenschutzerklärung ergänzen** (`src/pages/datenschutz.js`) — den Abschnitt „Cookies & Tracking" ersetzen durch:

   > **Reichweitenmessung:** Wir nutzen [Anbieter] zur anonymen Reichweitenmessung. Dabei werden keine Cookies gesetzt und keine personenbezogenen Profile gebildet; die IP-Adresse wird ausschließlich anonymisiert verarbeitet, um Besuche zu zählen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an statistischer Auswertung der Reichweite). Serverstandort: [Land].

3. **Rechtlich prüfen lassen:** § 25 TTDSG verlangt eine Einwilligung, sobald Informationen auf dem Endgerät gespeichert oder ausgelesen werden. Rein serverseitiges, cookieloses Zählen fällt nach verbreiteter Auslegung nicht darunter — verlasst euch darauf aber nicht ungeprüft, wenn ihr ein Tool mit LocalStorage/Cookies wählt.

## Schriften

Anton, Space Mono und Inter liegen als woff2 in `src/assets/fonts/` und werden vom eigenen Server ausgeliefert — **nichts kommt von Google**. Damit entfällt sowohl die IP-Übertragung an Google (in Deutschland das bekannte Abmahnrisiko) als auch eine render-blockierende Anfrage an eine fremde Domain vor dem ersten Bild.

Es liegen genau die sechs Schnitte im Projekt, die das CSS auch benutzt (Anton 400, Space Mono 400/700, Inter 400/700/800), jeweils nur der Latin-Ausschnitt — zusammen rund 124 KB. Die `@font-face`-Regeln stehen ganz oben in `src/assets/css/styles.css`, die zwei für das erste Bild nötigen Dateien werden in `src/lib/layout.js` per `<link rel="preload">` vorgezogen.

Alle drei Familien stehen unter der **SIL Open Font License 1.1**. Die Lizenztexte liegen als `LICENSE-*.txt` im selben Ordner und müssen dort bleiben — das ist Bedingung der Lizenz.

Einen weiteren Schnitt hinzufügen: die woff2-Datei nach `src/assets/fonts/` legen, eine `@font-face`-Regel in `styles.css` ergänzen, fertig. Die CSP erlaubt Schriften nur noch von `'self'`; eine externe Quelle würde blockiert.

## Geplante Erweiterungen

Die Struktur ist bewusst so angelegt, dass sie sich ohne Refactor erweitern lässt: No-Comfort-Zone-Verein, App, Mitgliederbereich, Online-Zahlungen, Trainingskalender, Events, Partnerangebote, Merchandise-Shop, digitale Trainingsangebote, weitere Standorte — jeweils als neue Seite unter `src/pages/` und/oder neue Einträge in `src/lib/*.json`.
