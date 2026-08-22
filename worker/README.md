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

### ⚠ Wichtig: Der Absender entscheidet, ob die Mail ankommt

Aktuell steht als Absender `nocomfortzone@gmail.com`. Das funktioniert
technisch, ist aber die schwächste Stelle des ganzen Aufbaus — und zwar aus
einem Grund, der sich nicht wegkonfigurieren lässt:

**Eine Mail lässt sich nur für eine Domain beglaubigen, die man selbst
kontrolliert.** `gmail.com` gehört Google, nicht euch. Brevo kann dort also
nicht als berechtigter Absender hinterlegt werden. Die üblichen Prüfungen
(SPF, DKIM, DMARC) schlagen deshalb fehl, und Mailanbieter stufen solche
Nachrichten gern als Spam oder Phishing ein. Verschärfend kommt hinzu, dass
Absender und Empfänger dieselbe Adresse wären — ein Muster, das Gmail
besonders streng behandelt.

**Konsequenz:** Die Anfrage geht zwar garantiert raus, landet aber
möglicherweise im Spam-Ordner. Prüft das nach dem ersten Testversand
ausdrücklich mit.

Zwei Wege, das zu lösen — der erste ist der richtige:

1. **Eigene Domain verwenden** (z. B. `anfragen@eure-domain.de`) und sie in
   Brevo verifizieren. Brevo zeigt dann die DNS-Einträge an, die einzutragen
   sind; danach sind die Mails ordentlich beglaubigt und landen zuverlässig im
   Posteingang. Eine Domain kostet wenige Euro im Jahr und steht ohnehin auf
   eurer Liste.
2. **Übergangslösung, solange es keine Domain gibt:** Nach dem ersten
   Testversand im Gmail-Postfach nachsehen. Landet die Mail im Spam, dort
   *„Kein Spam"* wählen und zusätzlich einen Filter anlegen
   (Suchfeld → Filtersymbol → Absender eintragen → *Nie an Spam senden*).
   Das wirkt nur für dieses eine Postfach — genau das ist hier aber der Fall,
   weil beide Verantwortliche darauf zugreifen.

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

- **höchstens 5 Anfragen pro IP-Adresse in 10 Minuten** — danach `429`
- Anfragen über 16 KB werden abgewiesen, bevor sie gelesen werden
- Anfragen nur von der eigenen Website (`ALLOWED_ORIGINS`)
- nur die fünf bekannten Formulararten — beliebiger Text kommt nicht durch
- ein für Menschen unsichtbares Feld; ausgefüllt = Bot, wird verworfen
- Formulare, die in unter drei Sekunden ausgefüllt wurden, werden verworfen
- alle Felder werden auf ihre Maximallänge gekürzt
- Steuerzeichen werden entfernt, damit nichts in E-Mail-Kopfzeilen eingeschleust
  werden kann

### Warum die Bremse wichtig ist

`ALLOWED_ORIGINS` schützt nur im Browser. Ein Skript kann diesen Wert frei
setzen — wer die Adresse des Workers kennt, könnte sonst beliebig viele
E-Mails auslösen, das Brevo-Tageskontingent aufbrauchen und damit echte
Anfragen blockieren. Die Bremse pro IP verhindert genau das.

**Was sie leistet und was nicht:** Sie zählt im Cache, je Cloudflare-Rechen­
zentrum, und liest-ändert-schreibt dabei nicht atomar. Gegen den normalen Fall —
jemand schickt hintereinander zu viele Anfragen — wirkt sie zuverlässig
(gemessen: ab der sechsten Anfrage `429`). Gegen einen **gleichzeitigen Schwall**
wirkt sie nicht: werden zwölf Anfragen im selben Moment abgeschickt, kommen alle
durch, weil jede den Zähler liest, bevor eine ihn erhöht hat.

Wer diese Lücke schließen will, hat zwei Wege:

1. **Cloudflare-Dashboard**, *Security → WAF → Rate limiting rules* — dort greift
   die Begrenzung vor dem Worker und ist nicht umgehbar. Der einfachere Weg.
2. **Durable Objects** statt Cache — technisch exakt, aber deutlich mehr Aufwand.

Für den Anfang reicht die eingebaute Bremse: sie verhindert das realistische
Szenario, dass ein Skript in Ruhe das Tageskontingent leerschickt.

Bewusst so gebaut: Ist der Cache selbst nicht erreichbar, lässt der Worker die
Anfrage **durch** statt sie abzulehnen. Eine kaputte Zählung soll nicht dazu
führen, dass niemand mehr ein Formular abschicken kann. Der Fehler landet im
Log (`npx wrangler tail`).

Die Werte stehen oben in `src/index.js` (`BREMSE_ANZAHL`, `BREMSE_FENSTER_S`)
und lassen sich dort anpassen.

## Prüfen, ob es läuft

```bash
npx wrangler tail        # zeigt die Aufrufe live mit
```

Danach auf der Website eine Testanfrage abschicken. Erwartung: auf der Seite
erscheint „Angekommen! Vorgang #…", und die E-Mail liegt im Postfach.
