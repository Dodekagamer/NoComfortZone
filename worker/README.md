# Anfrage-Versand einrichten

Damit die Formulare **garantiert** ankommen, braucht die Website einen kleinen
Dienst, der die Anfrage entgegennimmt und als E-Mail verschickt. GitHub Pages
kann das nicht — dort liegen nur statische Dateien.

Wir nutzen dafür zwei kostenlose Dienste mit Servern in der EU:

| Dienst | Wofür | Kosten |
|---|---|---|
| **Cloudflare Workers** | nimmt das Formular entgegen | kostenlos (100.000 Anfragen/Tag) |
| **Brevo** (Frankreich) | verschickt die E-Mail | kostenlos (300 E-Mails/Tag) |

Einrichtung dauert etwa 20 Minuten und ist einmalig.

---

## Schritt 1 — Brevo-Konto anlegen

1. Auf <https://www.brevo.com> registrieren (kostenloser Plan reicht).
2. **Absender verifizieren:** Menü *Senders, Domains & Dedicated IPs* →
   *Senders* → *Add a sender*. Trage dort `nocomfortzone@gmail.com` ein und
   bestätige die Mail, die Brevo an diese Adresse schickt.
   Ohne diesen Schritt lehnt Brevo den Versand ab.
3. **API-Schlüssel erzeugen:** Menü *SMTP & API* → *API Keys* →
   *Generate a new API key*. Den Schlüssel kopieren — er wird nur einmal
   angezeigt.

> Der Schlüssel ist ein Passwort. Nicht ins Repository schreiben, nicht per
> WhatsApp verschicken.

## Schritt 2 — Auftragsverarbeitungsvertrag (AVV)

Brevo und Cloudflare verarbeiten personenbezogene Daten in eurem Auftrag. Beide
stellen den Vertrag online bereit, er muss nur akzeptiert werden:

- Brevo: Konto → *Settings* → *Privacy & Data* → *Data Processing Agreement*
- Cloudflare: Dashboard → *Manage Account* → *Configurations* → *Data Protection*

Das ist Pflicht nach Art. 28 DSGVO. Beides ist ein Klick, kostet nichts.

## Schritt 3 — Worker veröffentlichen

Am Rechner, im Ordner `worker/`:

```bash
npx wrangler login       # öffnet den Browser, einmalig anmelden
npx wrangler deploy      # veröffentlicht den Worker
npx wrangler secret put BREVO_API_KEY    # Schlüssel aus Schritt 1 einfügen
```

`wrangler deploy` gibt am Ende eine Adresse aus, etwa:

```
https://nocomfortzone-anfragen.DEIN-NAME.workers.dev
```

**Diese Adresse brauchst du im nächsten Schritt.**

## Schritt 4 — Website mit dem Worker verbinden

In `src/lib/site.json` die Adresse aus Schritt 3 eintragen:

```json
"formEndpoint": "https://nocomfortzone-anfragen.DEIN-NAME.workers.dev"
```

Dann committen und pushen. Fertig — ab dem nächsten Deploy laufen die Anfragen
über den Worker.

**Solange das Feld leer ist, passiert nichts Schlimmes:** die Formulare nutzen
dann automatisch weiter den bisherigen Weg über das E-Mail-Programm. Die Seite
funktioniert also vorher wie nachher.

---

## Wer bekommt die Anfragen?

Steht in `wrangler.toml` unter `RECIPIENTS`, kommagetrennt. Aktuell bekommen
beide Verantwortlichen jede Anfrage über die gemeinsame Adresse.

Sobald es getrennte Adressen gibt, einfach ergänzen und neu deployen:

```toml
RECIPIENTS = "vereinsleitung@nocomfort.example, haki@nocomfort.example"
```

Jede E-Mail ist im Betreff gekennzeichnet, damit sofort klar ist, wer zuständig
ist:

```
[NCZ]  Probetraining — Max Mustermann (#K7M2QX)
[HAKI] Haki Sports Buchung — Max Mustermann (#K7M2QX)
```

`[HAKI]` bekommen nur Anfragen aus dem Haki-Sports-Formular, alles andere
`[NCZ]`. **Antworten** geht direkt an die anfragende Person — der Reply-To ist
entsprechend gesetzt.

### Gmail-Filter (optional)

Damit sich die Anfragen im gemeinsamen Postfach automatisch sortieren:

1. Gmail → Suchfeld → Filtersymbol
2. Bei *Betreff* eintragen: `[HAKI]` → *Filter erstellen* → *Label zuweisen:
   Haki Sports*
3. Dasselbe mit `[NCZ]` → Label *No Comfort Zone*

---

## Schutz vor Spam

Der Worker nimmt nicht alles an:

- Anfragen nur von der eigenen Website (`ALLOWED_ORIGINS`)
- nur die fünf bekannten Formulararten — beliebiger Text kommt nicht durch
- ein für Menschen unsichtbares Feld; ausgefüllt = Bot, wird verworfen
- Formulare, die in unter drei Sekunden ausgefüllt wurden, werden verworfen
- alle Felder werden auf ihre Maximallänge gekürzt
- Zeilenumbrüche im Betreff werden entfernt

Für zusätzlichen Schutz lässt sich im Cloudflare-Dashboard unter *Security →
WAF → Rate limiting rules* eine Grenze setzen, z. B. 5 Anfragen pro IP und
Stunde.

## Prüfen, ob es läuft

```bash
npx wrangler tail        # zeigt die Aufrufe live mit
```

Danach auf der Website eine Testanfrage abschicken. Erwartung: auf der Seite
erscheint „Angekommen! Vorgang #…", und die E-Mail liegt im Postfach.
