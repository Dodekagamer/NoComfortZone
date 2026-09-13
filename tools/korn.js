/**
 * Erzeugt die Korn-Kachel, die auf den grossen Flaechen liegt
 * (src/assets/img/korn.png).
 *
 * Warum vorgerendert und mitversioniert: Der GitHub-Actions-Build soll ohne
 * Abhaengigkeiten auskommen. Anders als die Teilen-Bilder braucht diese Datei
 * aber keinen Browser — ein PNG mit Rauschen laesst sich mit Bordmitteln
 * schreiben (zlib steckt in Node).
 *
 * Neu erzeugen:
 *     node tools/korn.js
 *
 * Der Zufallsgenerator ist bewusst mit festem Startwert versehen: ein zweiter
 * Lauf erzeugt exakt dieselbe Datei. Sonst stuende bei jedem Aufruf eine
 * geaenderte Binaerdatei im Verzeichnis, ohne dass sich etwas geaendert haette.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const SEITE = 96;        // Kachelgroesse in Pixeln
const STUFEN = 8;        // Graustufen — mehr braucht es nicht, spart Platz
const STARTWERT = 0x4e435a;  // "NCZ"

/** mulberry32 — kurz, schnell, und bei gleichem Startwert immer gleich. */
function zufall(startwert) {
  let a = startwert >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CRC_TABELLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(puffer) {
  let c = -1;
  for (let i = 0; i < puffer.length; i++) c = CRC_TABELLE[(c ^ puffer[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

/** Ein PNG-Abschnitt: Laenge, Name, Inhalt, Pruefsumme. */
function abschnitt(name, inhalt) {
  const kopf = Buffer.alloc(8);
  kopf.writeUInt32BE(inhalt.length, 0);
  kopf.write(name, 4, 'ascii');
  const pruef = Buffer.alloc(4);
  pruef.writeUInt32BE(crc32(Buffer.concat([kopf.subarray(4), inhalt])), 0);
  return Buffer.concat([kopf, inhalt, pruef]);
}

function kachel() {
  const w = zufall(STARTWERT);

  // Farbtabelle: STUFEN Grautoene, gleichmaessig von Schwarz nach Weiss.
  const palette = Buffer.alloc(STUFEN * 3);
  for (let i = 0; i < STUFEN; i++) {
    const ton = Math.round((i * 255) / (STUFEN - 1));
    palette[i * 3] = ton; palette[i * 3 + 1] = ton; palette[i * 3 + 2] = ton;
  }

  /* 4 Bit pro Pixel: zwei Pixel teilen sich ein Byte. Das halbiert die Datei
     gegenueber 8 Bit, und mehr als 16 Farben gibt es hier ohnehin nicht.
     Jede Zeile beginnt mit einem Filter-Byte (0 = kein Filter; bei Rauschen
     bringt jeder Filter nur Nachteile). */
  /* Nicht gleichverteilt, sondern zu Dunkel hin verschoben: die meisten Punkte
     liegen nahe Schwarz, helle sind selten. Das ist wichtig, weil die Kachel
     mit fester Deckkraft aufliegt — eine Gleichverteilung haette einen Mittel-
     wert von 127 und damit jede dunkle Flaeche sichtbar aufgehellt. So bleibt
     die Helligkeit der Flaeche fast unveraendert, das Korn entsteht aus
     einzelnen helleren Punkten. */
  const stufe = (u) => Math.min(STUFEN - 1, Math.floor(u ** 3 * STUFEN));

  const proZeile = SEITE / 2;
  const roh = Buffer.alloc((proZeile + 1) * SEITE);
  let p = 0;
  for (let y = 0; y < SEITE; y++) {
    roh[p++] = 0;
    for (let x = 0; x < SEITE; x += 2) {
      roh[p++] = (stufe(w()) << 4) | stufe(w());
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(SEITE, 0);
  ihdr.writeUInt32BE(SEITE, 4);
  ihdr[8] = 4;   // Bittiefe
  ihdr[9] = 3;   // Farbtyp 3 = Farbtabelle
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    abschnitt('IHDR', ihdr),
    abschnitt('PLTE', palette),
    abschnitt('IDAT', zlib.deflateSync(roh, { level: 9 })),
    abschnitt('IEND', Buffer.alloc(0))
  ]);
}

const ziel = path.join(__dirname, '..', 'src', 'assets', 'img', 'korn.png');
const daten = kachel();
fs.writeFileSync(ziel, daten);
console.log(`korn.png: ${SEITE}x${SEITE}, ${(daten.length / 1024).toFixed(1)} KB`);
