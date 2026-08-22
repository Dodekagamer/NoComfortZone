/**
 * No Comfort Zone — Anfrage-Versand
 *
 * Cloudflare Worker, der die Formulare der Website entgegennimmt und die
 * Anfrage per Brevo (Server in der EU) an die Verantwortlichen schickt.
 * Erst dieser Dienst macht den Versand garantiert: die Website bekommt eine
 * echte Bestätigung zurück, statt nur ein E-Mail-Programm zu öffnen.
 *
 * Einrichtung: siehe worker/README.md
 */

/** Nur diese Formulararten werden angenommen — verhindert, dass beliebiger
 *  Text von außen als Betreff verschickt wird. Der Bereich steuert, ob die
 *  Anfrage als [NCZ] oder [HAKI] gekennzeichnet wird. */
const FORMULARE = {
  'Probetraining': 'NCZ',
  'Mitgliedschaft': 'NCZ',
  'Allgemeine Anfrage': 'NCZ',
  'Unternehmen/Schule Kooperation': 'NCZ',
  'Haki Sports Buchung': 'HAKI'
};

const GRENZEN = { name: 80, email: 120, phone: 40, preferred: 80, message: 1200, ref: 16 };

/** Mindestzeit zwischen Seitenaufbau und Absenden. Menschen brauchen zum
 *  Ausfüllen länger als drei Sekunden, automatische Skripte nicht. */
const MIN_AUSFUELLZEIT_MS = 3000;

function cors(origin, erlaubte) {
  const ok = erlaubte.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin : erlaubte[0] || '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
}

function antwort(daten, status, headers) {
  return new Response(JSON.stringify(daten), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers }
  });
}

/** Betreffzeilen dürfen keine Zeilenumbrüche enthalten (Header-Injection). */
function einzeilig(text) {
  return String(text || '').replace(/[\r\n\t]+/g, ' ').trim();
}

function kuerzen(wert, max) {
  return String(wert == null ? '' : wert).trim().slice(0, max);
}

function baueText({ typ, bereich, ref, name, email, phone, preferred, message }) {
  const zeilen = [
    `Anfrage: ${typ}`,
    `Bereich: ${bereich === 'HAKI' ? 'Haki Sports' : 'No Comfort Zone'}`,
    `Vorgang: #${ref}`,
    '',
    `Name: ${name}`,
    `E-Mail: ${email}`
  ];
  if (phone) zeilen.push(`Telefon: ${phone}`);
  if (preferred) zeilen.push(`Wunschtermin: ${preferred}`);
  if (message) zeilen.push('', 'Nachricht:', message);
  zeilen.push(
    '',
    '--',
    'Diese Anfrage kam über das Formular auf nocomfortzone.',
    'Auf diese E-Mail zu antworten schreibt direkt an die anfragende Person.',
    bereich === 'HAKI'
      ? 'Zuständig: Haki Sports.'
      : 'Zuständig: No Comfort Zone (Vereinsleitung).'
  );
  return zeilen.join('\n');
}

export default {
  async fetch(request, env) {
    const erlaubte = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    const origin = request.headers.get('Origin') || '';
    const headers = cors(origin, erlaubte);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') return antwort({ ok: false, fehler: 'method' }, 405, headers);
    if (erlaubte.length && !erlaubte.includes(origin)) {
      return antwort({ ok: false, fehler: 'origin' }, 403, headers);
    }

    let daten;
    try {
      daten = await request.json();
    } catch (e) {
      return antwort({ ok: false, fehler: 'json' }, 400, headers);
    }

    // Honigtopf: ein für Menschen unsichtbares Feld. Ist es ausgefüllt, war es
    // ein Bot. Wir antworten bewusst mit ok, damit er nichts dazulernt.
    if (kuerzen(daten.website, 200)) return antwort({ ok: true, ref: null }, 200, headers);

    const dauer = Number(daten.dauer);
    if (Number.isFinite(dauer) && dauer >= 0 && dauer < MIN_AUSFUELLZEIT_MS) {
      return antwort({ ok: true, ref: null }, 200, headers);
    }

    const typ = kuerzen(daten.typ, 60);
    const bereich = FORMULARE[typ];
    if (!bereich) return antwort({ ok: false, fehler: 'typ' }, 400, headers);

    const name = kuerzen(daten.name, GRENZEN.name);
    const email = kuerzen(daten.email, GRENZEN.email);
    const phone = kuerzen(daten.phone, GRENZEN.phone);
    const preferred = kuerzen(daten.preferred, GRENZEN.preferred);
    const message = kuerzen(daten.message, GRENZEN.message);
    const ref = (kuerzen(daten.ref, GRENZEN.ref).match(/[A-Z0-9-]+/) || [''])[0];

    if (!name || !/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email) || !ref) {
      return antwort({ ok: false, fehler: 'felder' }, 400, headers);
    }

    const empfaenger = (env.RECIPIENTS || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (!empfaenger.length || !env.BREVO_API_KEY || !env.SENDER_EMAIL) {
      return antwort({ ok: false, fehler: 'konfiguration' }, 500, headers);
    }

    const betreff = einzeilig(`[${bereich}] ${typ} — ${name} (#${ref})`);
    const nutzlast = {
      sender: { name: 'No Comfort Zone Website', email: env.SENDER_EMAIL },
      to: empfaenger.map((e) => ({ email: e })),
      // Antworten geht direkt an die anfragende Person.
      replyTo: { email, name },
      subject: betreff,
      textContent: baueText({ typ, bereich, ref, name, email, phone, preferred, message })
    };

    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': env.BREVO_API_KEY,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(nutzlast)
      });
      if (!res.ok) {
        // Details bewusst nur ins Log, nicht an den Browser zurück.
        console.error('Brevo-Fehler', res.status, await res.text());
        return antwort({ ok: false, fehler: 'versand' }, 502, headers);
      }
    } catch (err) {
      console.error('Brevo nicht erreichbar', err);
      return antwort({ ok: false, fehler: 'versand' }, 502, headers);
    }

    return antwort({ ok: true, ref }, 200, headers);
  }
};
