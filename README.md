# No Comfort Zone

Website von **No Comfort Zone** — Community, Bewegung und zukünftiger Verein — mit **Haki Sports** als eigenständigem 1:1-Coaching-Angebot innerhalb der Bewegung.

Statisch generierte, mehrseitige Website. Kein Framework, keine externen npm-Abhängigkeiten — der Build läuft mit reinem Node.js.

## Struktur

```
build.js            Build-Skript (liest src/pages/*.js, schreibt _site/)
serve.js             Lokaler Vorschau-Server (kein Dependency nötig)
src/
  lib/
    site.json         Globale Daten: Navigation, Kontakt, Social-Links
    pricing.json       Mitgliedschafts- & Coaching-Preise (Platzhalter, s. u.)
    layout.js           HTML-Grundgerüst (Head, Header/Nav, Footer, Scripts)
    components.js        Wiederverwendbare Bausteine (Preis-Karte, Formular, ...)
  pages/
    index.js            Startseite
    vision-werte.js, angebote.js, zielgruppe.js, mitgliedschaft.js,
    buchung.js, community.js, haki-sports.js, kontakt.js,
    impressum.js, datenschutz.js
  assets/
    css/styles.css       Design-System (Farben, Fonts, Komponenten)
    js/main.js            Mobile-Nav, Scroll-Hero (GSAP), Formular-Handler
    img/hero-bg.jpg        Hero-Hintergrundbild
    favicon.svg
```

Jede Datei in `src/pages/` exportiert `{ url, title, description, content }` — `build.js` rendert sie mit dem gemeinsamen Layout und schreibt sie nach `_site/<url>/index.html`.

## Entwicklung

```bash
node build.js     # baut die Website nach _site/
node serve.js      # startet einen lokalen Vorschau-Server auf http://localhost:8080/NoComfortZone/
```

Keine `npm install` nötig — es gibt keine externen Abhängigkeiten. Der Vorschau-Server akzeptiert sowohl `/` als auch den echten Live-Pfad `/NoComfortZone/`.

## Sicherheit

- **Keine externen Skripte.** Alles JavaScript kommt vom eigenen Server; die Scroll-Animation der Startseite ist eigener Code (kein GSAP/CDN mehr) — damit kein Supply-Chain-Risiko über Dritt-CDNs.
- **Content-Security-Policy** als `<meta>` in `src/lib/layout.js`: `default-src 'none'`, `script-src 'self'`, `style-src` ohne `'unsafe-inline'`, dazu `object-src`/`base-uri`/`form-action`/`frame-src` auf `'none'`. Damit die Policy so streng bleiben kann, enthält die Seite **keine Inline-Style-Attribute** — Layout-Abstände laufen über Utility-Klassen in `styles.css`. `frame-ancestors` fehlt bewusst: die Direktive wirkt nur als echter HTTP-Header, und GitHub Pages kann keine Header setzen. Wer Clickjacking-Schutz braucht, muss hinter einen Proxy/CDN mit Header-Kontrolle (z. B. Cloudflare) wechseln.
- **Daten aus `site.json`/`pricing.json` werden HTML-escaped** (`src/lib/escape.js`). Ihr könnt dort beliebigen Text eintragen — `Müller & Sohn`, Anführungszeichen, spitze Klammern — ohne die Seite zu zerlegen oder Markup einzuschleusen. URLs laufen zusätzlich durch `safeUrl()`, das nur `http(s):`, `mailto:`, `tel:` und relative Pfade durchlässt (ein versehentliches `javascript:` wird zu `#`). Inhalte in `src/pages/` sind bewusst ausgenommen — das ist Code und darf Markup enthalten.
- **Formulare** senden nichts an einen Server; Eingaben werden ausschließlich URL-encodiert in `mailto:`/`wa.me`-Links eingesetzt (getestet gegen CRLF- und Parameter-Injection). Längenbegrenzungen verhindern überlange URLs, die Browser stillschweigend abschneiden würden.
- **Externe Links** tragen durchgängig `rel="noopener noreferrer"`.
- **GitHub-Actions-Rechte** sind minimal (`contents:read`, `pages:write`, `id-token:write`). Die Actions sind auf Major-Tags (`@v4`) statt auf Commit-SHAs gepinnt — bei den offiziellen `actions/*` ein bewusst akzeptiertes Restrisiko; für maximale Härtung könnte man auf SHAs pinnen.

## Deployment

`.github/workflows/pages.yml` baut die Seite bei jedem Push auf `main` und deployt `_site/` auf GitHub Pages. In den Repository-Einstellungen muss unter **Settings → Pages** die Quelle einmalig auf **GitHub Actions** gestellt werden.

**Live-URL:** `https://dodekagamer.github.io/NoComfortZone/`

GitHub Pages liefert dieses Repo (kein `<owner>.github.io`-Repo, keine eigene Domain) unter diesem Unterpfad aus. Deshalb rechnet `build.js` alle internen Links/Asset-Pfade über `src/lib/base-path.js` auf `/NoComfortZone` um (`SITE_BASE_PATH`/`SITE_ORIGIN` per Env-Variable überschreibbar). **Falls später eine eigene Domain per CNAME eingerichtet wird**, `SITE_BASE_PATH=""` und `SITE_ORIGIN` auf die eigene Domain setzen (z. B. als Env-Variablen im Workflow) — sonst zeigen alle Links weiterhin auf `/NoComfortZone/...`.

## Wichtige Hinweise vor dem echten Live-Betrieb

- **Preise** (`src/lib/pricing.json`): aktuell klar markierte Beispielpreise ("Beispielpreis"-Badge auf der Seite). Vor dem Launch durch echte Konditionen ersetzen.
- **Impressum / Datenschutz** (`src/pages/impressum.js`, `datenschutz.js`): rechtlich vollständig strukturiert (§ 5 TMG / DSGVO), es fehlen aber noch **Name, Anschrift und USt-Status** der verantwortlichen Person — direkt in `src/lib/site.json` unter `legal` eintragen (`responsibleName`, `street`, `postalCode`, `vatStatus`). Vor dem echten Live-Betrieb zusätzlich kurz rechtlich prüfen lassen, insbesondere solange noch kein Gewerbe angemeldet ist.
- **Formulare**: Buchungs-/Kontaktformulare senden nicht an ein Backend, sondern öffnen eine vorausgefüllte E-Mail (`mailto:`) oder WhatsApp-Nachricht (`wa.me`). Kontaktdaten in `src/lib/site.json` pflegen.

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

## Fonts lokal einbinden (vorbereitet, noch nicht ausgeführt)

Die Website lädt die Schriftarten (Anton, Space Mono, Inter) von Google Fonts — offengelegt in `datenschutz.js`, aber in Deutschland ein bekanntes Abmahnrisiko. Empfehlung: lokal einbinden. Das konnte in der Entwicklungsumgebung, in der diese Seite gebaut wurde, nicht automatisch erledigt werden (kein Netzwerkzugriff auf `fonts.gstatic.com`) — daher hier die fertige Anleitung zum Nachziehen.

> GSAP wird **nicht mehr** benötigt: die Scroll-Animation der Startseite läuft seit dem Mobile-Update mit eigenem Code in `src/assets/js/main.js`, ohne externe Bibliothek.

1. **Schriftdateien herunterladen** (als `.woff2`) und in `src/assets/fonts/` ablegen:
   - Anton (400)
   - Space Mono (400, 700)
   - Inter (400, 500, 600, 700, 800)

   Am einfachsten über [google-webfonts-helper](https://gwfh.mranftl.com/fonts) — dort die jeweilige Schriftart, die genannten Schnitte und "modern" (woff2) auswählen und herunterladen.

2. **In `src/assets/css/styles.css`** ein `@font-face`-Set für jede Datei ergänzen (oben in der Datei, vor `:root`), z. B.:
   ```css
   @font-face { font-family:'Anton'; src:url('../fonts/anton-v25-latin-regular.woff2') format('woff2'); font-weight:400; font-display:swap; }
   /* ... eine @font-face-Regel pro Schriftschnitt */
   ```
   Relative Pfade (`../fonts/…`) verwenden — die funktionieren unabhängig vom Base-Path.

3. **In `src/lib/layout.js`** die drei Google-Fonts-`<link>`-Tags (`preconnect` ×2 + `stylesheet`) entfernen — die `@font-face`-Regeln aus Schritt 2 übernehmen das jetzt.

4. **CSP in `src/lib/layout.js` verschärfen**: `style-src` und `font-src` brauchen die Google-Domains dann nicht mehr:
   ```
   default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; form-action 'none'; base-uri 'none'; object-src 'none'
   ```

5. **In `src/pages/datenschutz.js`** den Abschnitt „Externe Schriftarten (Google Fonts)" entfernen — danach lädt die Seite nichts mehr von Dritten.

6. `node build.js && node serve.js` und optisch prüfen, dass alle Schriften weiterhin korrekt aussehen.

7. `node build.js` neu bauen und visuell prüfen, dass alle Fonts/Animationen weiterhin korrekt aussehen.

## Geplante Erweiterungen

Die Struktur ist bewusst so angelegt, dass sie sich ohne Refactor erweitern lässt: No-Comfort-Zone-Verein, App, Mitgliederbereich, Online-Zahlungen, Trainingskalender, Events, Partnerangebote, Merchandise-Shop, digitale Trainingsangebote, weitere Standorte — jeweils als neue Seite unter `src/pages/` und/oder neue Einträge in `src/lib/*.json`.
