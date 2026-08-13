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
node serve.js      # startet einen lokalen Vorschau-Server auf http://localhost:8080
```

Keine `npm install` nötig — es gibt keine externen Abhängigkeiten.

## Deployment

`.github/workflows/pages.yml` baut die Seite bei jedem Push auf `main` und deployt `_site/` auf GitHub Pages. In den Repository-Einstellungen muss unter **Settings → Pages** die Quelle einmalig auf **GitHub Actions** gestellt werden.

**Live-URL:** `https://dodekagamer.github.io/NoComfortZone/`

GitHub Pages liefert dieses Repo (kein `<owner>.github.io`-Repo, keine eigene Domain) unter diesem Unterpfad aus. Deshalb rechnet `build.js` alle internen Links/Asset-Pfade über `src/lib/base-path.js` auf `/NoComfortZone` um (`SITE_BASE_PATH`/`SITE_ORIGIN` per Env-Variable überschreibbar). **Falls später eine eigene Domain per CNAME eingerichtet wird**, `SITE_BASE_PATH=""` und `SITE_ORIGIN` auf die eigene Domain setzen (z. B. als Env-Variablen im Workflow) — sonst zeigen alle Links weiterhin auf `/NoComfortZone/...`.

## Wichtige Hinweise vor dem echten Live-Betrieb

- **Preise** (`src/lib/pricing.json`): aktuell klar markierte Beispielpreise ("Beispielpreis"-Badge auf der Seite). Vor dem Launch durch echte Konditionen ersetzen.
- **Impressum / Datenschutz** (`src/pages/impressum.js`, `datenschutz.js`): rechtlich vollständig strukturiert (§ 5 TMG / DSGVO), es fehlen aber noch **Name, Anschrift und USt-Status** der verantwortlichen Person — direkt in `src/lib/site.json` unter `legal` eintragen (`responsibleName`, `street`, `postalCode`, `vatStatus`). Vor dem echten Live-Betrieb zusätzlich kurz rechtlich prüfen lassen, insbesondere solange noch kein Gewerbe angemeldet ist.
- **Formulare**: Buchungs-/Kontaktformulare senden nicht an ein Backend, sondern öffnen eine vorausgefüllte E-Mail (`mailto:`) oder WhatsApp-Nachricht (`wa.me`). Kontaktdaten in `src/lib/site.json` pflegen.

## Fonts & Skripte lokal einbinden (vorbereitet, noch nicht ausgeführt)

Die Website lädt aktuell die Schriftarten (Anton, Space Mono, Inter) von Google Fonts und das Animations-Framework GSAP von cdnjs.cloudflare.com — beides wird in `datenschutz.js` korrekt offengelegt, ist aber ein bekanntes Abmahnrisiko (Google Fonts) und macht die Seite von externen Servern abhängig. Empfehlung: lokal einbinden. Das konnte in der Entwicklungsumgebung, in der diese Seite gebaut wurde, nicht automatisch erledigt werden (kein Netzwerkzugriff auf `fonts.gstatic.com`/`cdnjs.cloudflare.com`) — daher hier die fertige Anleitung zum Nachziehen:

1. **Schriftdateien herunterladen** (als `.woff2`) und in `src/assets/fonts/` ablegen:
   - Anton (400)
   - Space Mono (400, 700)
   - Inter (400, 500, 600, 700, 800)

   Am einfachsten über [google-webfonts-helper](https://gwfh.mranftl.com/fonts) — dort die jeweilige Schriftart, die genannten Schnitte und "modern" (woff2) auswählen und herunterladen.

2. **GSAP-Dateien herunterladen** (Version 3.12.5, passend zum aktuell verlinkten CDN) und ablegen unter:
   - `src/assets/js/vendor/gsap.min.js`
   - `src/assets/js/vendor/ScrollTrigger.min.js`

   Quelle: [gsap.com/install](https://gsap.com/install) oder `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js` bzw. `.../ScrollTrigger.min.js` direkt herunterladen.

3. **In `src/assets/css/styles.css`** ein `@font-face`-Set für jede Datei ergänzen (oben in der Datei, vor `:root`), z. B.:
   ```css
   @font-face { font-family:'Anton'; src:url('/assets/fonts/anton-v25-latin-regular.woff2') format('woff2'); font-weight:400; font-display:swap; }
   /* ... eine @font-face-Regel pro Schriftschnitt */
   ```

4. **In `src/lib/layout.js`** die drei Google-Fonts-`<link>`-Tags (`preconnect` ×2 + `stylesheet`) entfernen — die `@font-face`-Regeln aus Schritt 3 übernehmen das jetzt.

5. **In `src/lib/layout.js`** die beiden `<script src="https://cdnjs...">`-Tags ersetzen durch:
   ```html
   <script src="/assets/js/vendor/gsap.min.js"></script>
   <script src="/assets/js/vendor/ScrollTrigger.min.js"></script>
   ```

6. **In `src/pages/datenschutz.js`** die Abschnitte "Externe Schriftarten (Google Fonts)" und "Externes Animations-Skript (GSAP)" entfernen bzw. durch einen kurzen Satz ersetzen, dass Schriftarten und Skripte lokal ausgeliefert werden und keine Verbindung zu Drittservern mehr besteht.

7. `node build.js` neu bauen und visuell prüfen, dass alle Fonts/Animationen weiterhin korrekt aussehen.

## Geplante Erweiterungen

Die Struktur ist bewusst so angelegt, dass sie sich ohne Refactor erweitern lässt: No-Comfort-Zone-Verein, App, Mitgliederbereich, Online-Zahlungen, Trainingskalender, Events, Partnerangebote, Merchandise-Shop, digitale Trainingsangebote, weitere Standorte — jeweils als neue Seite unter `src/pages/` und/oder neue Einträge in `src/lib/*.json`.
