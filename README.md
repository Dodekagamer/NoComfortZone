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

## Wichtige Hinweise vor dem echten Live-Betrieb

- **Preise** (`src/lib/pricing.json`): aktuell klar markierte Beispielpreise ("Beispielpreis"-Badge auf der Seite). Vor dem Launch durch echte Konditionen ersetzen.
- **Impressum / Datenschutz** (`src/pages/impressum.js`, `datenschutz.js`): Platzhalter-Entwürfe, rechtlich noch zu prüfen (z. B. durch einen Anwalt), bevor die Seite live geht.
- **Formulare**: Buchungs-/Kontaktformulare senden nicht an ein Backend, sondern öffnen eine vorausgefüllte E-Mail (`mailto:`) oder WhatsApp-Nachricht (`wa.me`). Kontaktdaten in `src/lib/site.json` pflegen.

## Geplante Erweiterungen

Die Struktur ist bewusst so angelegt, dass sie sich ohne Refactor erweitern lässt: No-Comfort-Zone-Verein, App, Mitgliederbereich, Online-Zahlungen, Trainingskalender, Events, Partnerangebote, Merchandise-Shop, digitale Trainingsangebote, weitere Standorte — jeweils als neue Seite unter `src/pages/` und/oder neue Einträge in `src/lib/*.json`.
