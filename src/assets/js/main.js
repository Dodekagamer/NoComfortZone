/* No Comfort Zone — main.js
   1) Progressive Enhancement: markiert <html> als "js", damit CSS die
      Scroll-Sequenz aktivieren kann. Ohne JS bleibt der fertige Hero sichtbar.
   2) Mobile-Navigation (Toggle, Scroll-Lock, Schließen bei Klick daneben)
   3) Scroll-Sequenz des Heros — eigener Code, keine externe Bibliothek
   4) Anfrage-/Buchungsformulare -> mailto: und WhatsApp (wa.me), kein Backend
*/

// (1) so früh wie möglich, damit es kein Aufblitzen gibt
document.documentElement.classList.add('js');

(function initMobileNav() {
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  if (!header || !toggle || !nav) return;

  function closeMenu() {
    header.removeAttribute('data-open');
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menü öffnen');
  }
  function openMenu() {
    header.setAttribute('data-open', 'true');
    document.body.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Menü schließen');
  }
  function isOpen() {
    return header.getAttribute('data-open') === 'true';
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isOpen()) {
      closeMenu();
    } else {
      openMenu();
      // Fokus ins Menü, damit Tastatur-/Screenreader-Nutzer direkt drin sind
      const first = nav.querySelector('a');
      if (first) first.focus();
    }
  });

  // Klick auf einen Menüpunkt schließt das Menü
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu();
  });

  // Klick/Tap außerhalb des Headers schließt das Menü
  document.addEventListener('click', (e) => {
    if (isOpen() && !header.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      closeMenu();
      toggle.focus();
    }
  });

  // Beim Wechsel auf Desktop-Breite aufräumen (sonst bliebe der Scroll-Lock)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 980 && isOpen()) closeMenu();
  });
})();

/**
 * Hero-Scroll-Sequenz (nur auf der Startseite).
 * Ersetzt die frühere GSAP/ScrollTrigger-Einbindung durch eigenen Code:
 * kein externes Skript, kein Supply-Chain-Risiko, keine Verbindung zu Dritten.
 * Ablauf unverändert: Panel 1 -> 2 -> 3 -> finaler Hero, dazu der Warnstreifen-
 * Sweep und der ausblendende Scroll-Hinweis.
 */
/* (2b) Inhalte beim Hereinscrollen einblenden.
   Die Startposition setzt bereits enhance.js ueber die Klasse "anim" — hier
   wird sie elementweise wieder aufgehoben, sobald ein Abschnitt ins Bild
   kommt. Nur opacity und transform werden bewegt: beide erzeugen kein
   Nachrechnen des Layouts, der Inhalt springt also nicht (CLS bleibt 0).
   Die Auswahl unten muss mit der Liste in styles.css uebereinstimmen. */
(function initEinblenden() {
  const wurzel = document.documentElement;
  if (!wurzel.classList.contains('anim')) return; // reduzierte Bewegung o. Ae.

  const AUSWAHL = [
    '.section-head',
    '.offer-grid > *',
    '.values-grid > *',
    '.quickfacts-grid > *',
    '.pillar-grid > *',
    '.testimonials > *',
    '.audience-row',
    '.pricing-grid > *',
    '.offer-detail-text',
    '.offer-detail-media',
    '.callout',
    '.steps > *',
    '.cta-band .wrap',
    '.form'
  ].join(',');

  const ziele = [...document.querySelectorAll(AUSWAHL)];
  // Uebernahme signalisieren, damit das Sicherheitsnetz in enhance.js ruht.
  wurzel.classList.add('anim-aktiv');

  if (!('IntersectionObserver' in window) || !ziele.length) {
    wurzel.classList.remove('anim');
    return;
  }

  ziele.forEach((el) => el.classList.add('einblenden'));

  const beobachter = new IntersectionObserver(
    (eintraege) => {
      eintraege.forEach((e) => {
        if (!e.isIntersecting) return;
        // Geschwister leicht versetzt starten lassen — das wirkt geordnet
        // statt wie ein gleichzeitiges Aufploppen. Gedeckelt, damit spaete
        // Elemente einer langen Reihe nicht spuerbar hinterherhinken.
        const geschwister = [...(e.target.parentElement ? e.target.parentElement.children : [])];
        const platz = Math.min(geschwister.indexOf(e.target), 5);
        e.target.style.transitionDelay = platz > 0 ? platz * 60 + 'ms' : '';
        e.target.classList.add('ist-da');
        beobachter.unobserve(e.target);
      });
    },
    // Etwas frueher ausloesen, damit die Bewegung fertig ist, wenn der
    // Abschnitt wirklich im Blick liegt.
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
  );

  ziele.forEach((el) => beobachter.observe(el));
})();

(function initHeroSequence() {
  const section = document.querySelector('.scroll-intro');
  if (!section) return;

  const panels = ['p1', 'p2', 'p3', 'p4'].map((id) => document.getElementById(id));
  if (panels.some((p) => !p)) return;

  const sweep = document.getElementById('introSweep');
  const cue = document.getElementById('scrollCue');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reduzierte Bewegung: Sequenz überspringen, Endzustand direkt zeigen.
  if (prefersReduced) {
    document.documentElement.classList.remove('js');
    return;
  }

  // Anteil der Gesamtstrecke, den jedes Panel sichtbar ist.
  const STOPS = [0, 0.3, 0.58, 0.82];
  const FADE = 0.12; // Überblendbreite zwischen zwei Panels

  // Weiche Kurve statt linear: der Wechsel beginnt und endet sanft, wodurch
  // die Sequenz ruhiger wirkt — besonders am Handy, wo pro Wischgeste ein
  // größerer Teil der Strecke zurückgelegt wird.
  const easeInOut = (t) => t * t * (3 - 2 * t);

  function opacityFor(index, progress) {
    const start = STOPS[index];
    const end = index < STOPS.length - 1 ? STOPS[index + 1] : Infinity;
    if (progress < start - FADE) return 0;
    if (progress < start) return easeInOut((progress - (start - FADE)) / FADE); // einblenden
    if (progress < end - FADE) return 1;
    if (end === Infinity) return 1;
    return easeInOut(Math.max(0, 1 - (progress - (end - FADE)) / FADE)); // ausblenden
  }

  let ticking = false;
  function update() {
    ticking = false;
    const rect = section.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    const progress = scrollable <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / scrollable));

    panels.forEach((panel, i) => {
      const o = opacityFor(i, progress);
      panel.style.opacity = o;
      // leichte Vertikalbewegung wie zuvor
      panel.style.transform = `translateY(${(1 - o) * (progress > STOPS[i] ? -24 : 24)}px)`;
    });

    if (sweep) sweep.style.transform = `translateX(${-120 + progress * 380}%)`;
    if (cue) cue.style.opacity = Math.max(0, 1 - progress * 12);
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

(function initInquiryForms() {
  const forms = document.querySelectorAll('form[data-form-type]');
  if (!forms.length) return;

  /**
   * Kurze, gut vorlesbare Vorgangsnummer. Sie ist der einzige Zweck dieser
   * Funktion: dieselbe Anfrage läuft über zwei Kanäle ein, und die Nummer
   * macht auf einen Blick klar, dass es EIN Vorgang ist und keine zwei.
   */
  function makeRef() {
    const zeit = Date.now().toString(36).slice(-4);
    const zufall = Math.random().toString(36).slice(2, 5);
    // Bewusst ohne Marken-Praefix: der Betreff kennzeichnet bereits [NCZ] oder
    // [HAKI], ein zusaetzliches "NCZ-" in der Nummer waere bei Haki-Anfragen
    // irrefuehrend.
    return (zeit + zufall).toUpperCase();
  }

  function formData(form) {
    const data = new FormData(form);
    const value = (key) => (data.get(key) || '').toString().trim();
    return {
      typ: form.getAttribute('data-form-type'),
      name: value('name'),
      email: value('email'),
      phone: value('phone'),
      preferred: value('preferred'),
      message: value('message')
    };
  }

  /**
   * Die vollständige Anfrage. `anderer` benennt den Kanal, über den zusätzlich
   * eine Kurznotiz eingeht — aber NUR, wenn sie auch wirklich rausgeht. Wird
   * hier nichts übergeben, entfällt der Hinweis: eine angekündigte zweite
   * Nachricht, die nie ankommt, lässt die Empfänger sonst darauf warten.
   */
  function vollNachricht(form, ref, anderer) {
    const d = formData(form);
    const lines = [`Anfrage: ${d.typ}`, `Vorgang: #${ref}`, `Name: ${d.name}`, `E-Mail: ${d.email}`];
    if (d.phone) lines.push(`Telefon: ${d.phone}`);
    if (d.preferred) lines.push(`Wunschtermin: ${d.preferred}`);
    if (d.message) lines.push('', 'Nachricht:', d.message);
    if (anderer) {
      lines.push(
        '',
        '--',
        `Zu diesem Vorgang geht euch zusätzlich eine kurze Notiz per ${anderer} zu.`,
        `Gleiche Vorgangsnummer #${ref} — es ist dieselbe Anfrage, bitte nur einmal bearbeiten.`
      );
    }
    return {
      subject: `[Anfrage: ${d.typ}]${d.name ? ' ' + d.name : ''} (#${ref})`,
      body: lines.join('\n')
    };
  }

  /**
   * Die Kurznotiz fuer den zweiten Kanal. Bewusst KEINE Kopie der Anfrage:
   * nur Vorgangsnummer, Betreff und der Hinweis, wo die vollen Angaben liegen.
   * So sieht der Empfänger sofort, dass nichts doppelt zu bearbeiten ist.
   */
  function notizNachricht(form, ref, wo) {
    const d = formData(form);
    const body = [
      `Kurze Notiz zu Vorgang #${ref}.`,
      '',
      `Die vollständige Anfrage „${d.typ}“${d.name ? ' von ' + d.name : ''} ist gerade per ${wo} rausgegangen — dort stehen alle Angaben.`,
      'Dies hier ist nur der Hinweis, damit ihr sie schnell seht.',
      'Es ist dieselbe Anfrage, bitte nur einmal bearbeiten.'
    ].join('\n');
    return {
      subject: `[Notiz zu #${ref}] ${d.typ}${d.name ? ' — ' + d.name : ''}`,
      body
    };
  }

  forms.forEach((form) => {
    const status = form.querySelector('[data-form-status]');
    const mail = form.getAttribute('data-mailto');
    const waNummer = form.getAttribute('data-whatsapp-number');
    const waFallback = form.querySelector('[data-wa-fallback]');
    const endpoint = form.getAttribute('data-endpoint') || '';
    // Zeitpunkt des Seitenaufbaus — der Worker erkennt daran automatische
    // Einsendungen, die das Formular in Sekundenbruchteilen ausfuellen.
    const geladenSeit = Date.now();
    const fields = form.querySelectorAll('input, textarea');

    function say(message, kind) {
      if (!status) return;
      status.textContent = message;
      status.className = 'form-status' + (kind ? ' is-' + kind : '');
    }

    /**
     * WCAG 3.3.1: fehlerhafte Felder müssen auch für Screenreader als
     * fehlerhaft erkennbar sein und auf die Meldung verweisen — nicht nur
     * über den (rein visuellen) Browser-Hinweis.
     */
    function markValidity() {
      let firstInvalid = null;
      fields.forEach((f) => {
        const bad = !f.checkValidity();
        if (bad) {
          f.setAttribute('aria-invalid', 'true');
          if (status && status.id) f.setAttribute('aria-describedby', status.id);
          if (!firstInvalid) firstInvalid = f;
        } else {
          f.removeAttribute('aria-invalid');
          f.removeAttribute('aria-describedby');
        }
      });
      return firstInvalid;
    }

    // Beim Korrigieren die Fehlermarkierung wieder entfernen
    fields.forEach((f) => {
      f.addEventListener('input', () => {
        if (f.getAttribute('aria-invalid') && f.checkValidity()) {
          f.removeAttribute('aria-invalid');
          f.removeAttribute('aria-describedby');
        }
      });
    });

    function waUrl(text) {
      return `https://wa.me/${waNummer}?text=${encodeURIComponent(text)}`;
    }

    function mailUrl(msg) {
      return `mailto:${mail}?subject=${encodeURIComponent(msg.subject)}&body=${encodeURIComponent(msg.body)}`;
    }

    function bereit() {
      const invalid = markValidity();
      if (invalid) {
        say('Bitte fülle Name und E-Mail aus, dann kann es losgehen.', 'warn');
        invalid.focus();
        return false;
      }
      return true;
    }

    // Wird ein fokussierter Button deaktiviert, faellt der Fokus auf den
    // Seitenanfang zurueck — wer per Tastatur bedient, muesste sich danach neu
    // durch die Seite arbeiten. Deshalb merken und hinterher zuruecksetzen.
    let fokusVorSperre = null;
    function buttonsSperren(gesperrt) {
      if (gesperrt) fokusVorSperre = document.activeElement;
      form.querySelectorAll('button').forEach((b) => {
        b.disabled = gesperrt;
      });
      if (!gesperrt && fokusVorSperre && form.contains(fokusVorSperre)) {
        fokusVorSperre.focus();
        fokusVorSperre = null;
      }
    }

    /**
     * Garantierter Versand über den Worker. Erst dessen Bestätigung heißt,
     * dass die Anfrage wirklich angekommen ist — anders als beim mailto-Weg,
     * bei dem wir nur ein Programm öffnen und nie erfahren, ob abgeschickt
     * wurde. Schlägt der Dienst fehl, fangen wir es mit mailto ab, damit die
     * Anfrage trotzdem nicht verloren geht.
     */
    async function perDienstSenden(ref) {
      const d = formData(form);
      // Ohne Zeitlimit blieben die Buttons bei einem haengenden Dienst dauerhaft
      // gesperrt und die Person waere handlungsunfaehig.
      const abbruch = new AbortController();
      const uhr = window.setTimeout(() => abbruch.abort(), 15000);
      let res;
      try {
        res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: abbruch.signal,
          body: JSON.stringify({
            typ: d.typ,
            name: d.name,
            email: d.email,
            phone: d.phone,
            preferred: d.preferred,
            message: d.message,
            ref: ref,
            website: (form.querySelector('[name="website"]') || {}).value || '',
            dauer: Date.now() - geladenSeit
          })
        });
      } finally {
        window.clearTimeout(uhr);
      }
      const daten = await res.json().catch(() => ({}));
      if (!res.ok || !daten.ok) {
        const fehler = new Error('Dienst meldet Fehler: ' + (daten.fehler || res.status));
        fehler.status = res.status;
        throw fehler;
      }
    }

    function whatsappOeffnen(text) {
      const win = window.open(waUrl(text), '_blank');
      if (win) {
        win.opener = null;
        if (waFallback) waFallback.hidden = true;
        return true;
      }
      // Popup blockiert: dieser Schritt braucht einen echten Klick.
      if (waFallback) {
        waFallback.href = waUrl(text);
        waFallback.hidden = false;
      }
      return false;
    }

    /**
     * `mitWhatsapp` steuert nur den Zusatzweg. Die E-Mail geht in beiden
     * Fällen an beide Verantwortlichen — sie ist der verlässliche Kanal.
     */
    async function senden(mitWhatsapp) {
      if (!bereit()) return;
      const ref = makeRef();
      const notiz = notizNachricht(form, ref, 'E-Mail');
      const waText = `${notiz.subject}\n\n${notiz.body}`;

      // Ohne eingerichteten Dienst bleibt es beim bisherigen mailto-Weg.
      if (!endpoint) {
        try {
          // Erst oeffnen, dann die Mail bauen: nur ein tatsaechlich geoeffnetes
          // WhatsApp-Fenster darf in der Mail angekuendigt werden.
          const waGeoeffnet = mitWhatsapp && waNummer ? whatsappOeffnen(waText) : false;
          window.location.href = mailUrl(vollNachricht(form, ref, waGeoeffnet ? 'WhatsApp' : null));
          say(`Vorgang #${ref}: Dein E-Mail-Programm sollte sich jetzt öffnen …`);
        } catch (err) {
          console.error('Anfrage konnte nicht vorbereitet werden:', err);
          say('Das hat leider nicht geklappt. Schreib uns bitte direkt an ' + mail + '.', 'warn');
        }
        return;
      }

      buttonsSperren(true);
      say('Anfrage wird gesendet …');
      try {
        await perDienstSenden(ref);
        let text = `Angekommen! Vorgang #${ref} — wir melden uns bei dir.`;
        if (mitWhatsapp && waNummer) {
          text += whatsappOeffnen(waText)
            ? ' WhatsApp öffnet sich mit der passenden Kurznachricht.'
            : ' WhatsApp hat der Browser blockiert — der Button darunter öffnet sie.';
        }
        say(text, 'ok');
        form.reset();
      } catch (err) {
        console.error('Versand fehlgeschlagen:', err);
        // Auffangnetz: Anfrage nicht verlieren, sondern über mailto anbieten.
        // Hier wird kein WhatsApp geoeffnet, also auch keins ankuendigen.
        window.location.href = mailUrl(vollNachricht(form, ref, null));
        say(
          (err && err.status === 429
            ? 'Von hier kamen gerade sehr viele Anfragen, deshalb haben wir kurz gebremst. '
            : 'Der direkte Versand hat nicht geklappt. ') +
            `Wir haben stattdessen dein E-Mail-Programm geöffnet — bitte einmal ` +
            `abschicken. Vorgang #${ref}.`,
          'warn'
        );
      } finally {
        buttonsSperren(false);
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // novalidate im Markup -> wir lösen die Prüfung selbst aus, damit die
      // Meldung erst nach dem Absenden erscheint und nicht beim Tippen.
      senden(false);
    });

    const waBtn = form.querySelector('[data-whatsapp-trigger]');
    if (waBtn) waBtn.addEventListener('click', () => senden(true));
  });
})();
