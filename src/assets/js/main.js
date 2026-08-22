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
    return ('NCZ-' + zeit + zufall).toUpperCase();
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
   * Die vollständige Anfrage — geht über den Kanal raus, den die Person
   * angeklickt hat. `anderer` benennt den Kanal, über den zusätzlich die
   * Notiz eingeht, damit beim Empfänger klar ist, was gleich noch kommt.
   */
  function vollNachricht(form, ref, anderer) {
    const d = formData(form);
    const lines = [`Anfrage: ${d.typ}`, `Vorgang: ${ref}`, `Name: ${d.name}`, `E-Mail: ${d.email}`];
    if (d.phone) lines.push(`Telefon: ${d.phone}`);
    if (d.preferred) lines.push(`Wunschtermin: ${d.preferred}`);
    if (d.message) lines.push('', 'Nachricht:', d.message);
    lines.push(
      '',
      '--',
      `Zu diesem Vorgang geht euch zusätzlich eine kurze Notiz per ${anderer} zu.`,
      `Gleiche Vorgangsnummer ${ref} — es ist dieselbe Anfrage, bitte nur einmal bearbeiten.`
    );
    return {
      subject: `[Anfrage: ${d.typ}]${d.name ? ' ' + d.name : ''} (${ref})`,
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
      `Kurze Notiz zu Vorgang ${ref}.`,
      '',
      `Die vollständige Anfrage „${d.typ}“${d.name ? ' von ' + d.name : ''} ist gerade per ${wo} rausgegangen — dort stehen alle Angaben.`,
      'Dies hier ist nur der Hinweis, damit ihr sie schnell seht.',
      'Es ist dieselbe Anfrage, bitte nur einmal bearbeiten.'
    ].join('\n');
    return {
      subject: `[Notiz zu ${ref}] ${d.typ}${d.name ? ' — ' + d.name : ''}`,
      body
    };
  }

  forms.forEach((form) => {
    const status = form.querySelector('[data-form-status]');
    const mail = form.getAttribute('data-mailto');
    const waNummer = form.getAttribute('data-whatsapp-number');
    const waFallback = form.querySelector('[data-wa-fallback]');
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

    /**
     * Verschickt die Anfrage über BEIDE Wege. `primaer` bestimmt nur, welcher
     * Kanal die vollständige Anfrage bekommt — der andere bekommt die Notiz.
     *
     * Reihenfolge ist wichtig: window.open muss direkt in der Klick-/Submit-
     * Verarbeitung passieren, sonst greift der Popup-Blocker. Das mailto:
     * danach navigiert die Seite nicht sichtbar weg, also überlebt der Status.
     */
    function senden(primaer) {
      if (!bereit()) return;
      const ref = makeRef();
      const mitWhatsapp = !!waNummer;

      try {
        if (!mitWhatsapp) {
          window.location.href = mailUrl(vollNachricht(form, ref, 'E-Mail'));
          say(`Dein E-Mail-Programm sollte sich jetzt öffnen … (Vorgang ${ref})`);
          return;
        }

        const waText = primaer === 'whatsapp'
          ? (() => { const m = vollNachricht(form, ref, 'E-Mail'); return `${m.subject}\n\n${m.body}`; })()
          : (() => { const m = notizNachricht(form, ref, 'E-Mail'); return `${m.subject}\n\n${m.body}`; })();
        const mailMsg = primaer === 'whatsapp'
          ? notizNachricht(form, ref, 'WhatsApp')
          : vollNachricht(form, ref, 'WhatsApp');

        // Kein 'noopener' im Feature-String: damit gäbe window.open laut
        // Spezifikation IMMER null zurück, und wir könnten einen echten
        // Popup-Blocker nicht von einem geöffneten Fenster unterscheiden.
        // opener danach selbst zu kappen erreicht dasselbe Schutzziel.
        const win = window.open(waUrl(waText), '_blank');
        if (win) win.opener = null;
        window.location.href = mailUrl(mailMsg);

        if (win) {
          if (waFallback) waFallback.hidden = true;
          say(
            `Vorgang ${ref}: Die vollständige Anfrage geht per ` +
              (primaer === 'whatsapp' ? 'WhatsApp' : 'E-Mail') +
              ' raus, eine kurze Notiz zusätzlich per ' +
              (primaer === 'whatsapp' ? 'E-Mail' : 'WhatsApp') +
              ' — beide mit derselben Vorgangsnummer.'
          );
        } else if (waFallback) {
          // Popup blockiert: der WhatsApp-Teil braucht einen echten Klick.
          waFallback.href = waUrl(waText);
          waFallback.hidden = false;
          say(
            `Vorgang ${ref}: Die E-Mail ist vorbereitet. WhatsApp hat der Browser ` +
              'blockiert — mit dem Button darunter schickst du dieselbe Anfrage auch dort.',
            'warn'
          );
        }

        // Öffnet sich kein Mailprogramm (auf dem Handy häufig), bleibt die
        // Seite sichtbar. Dann den Weg per Hand anbieten.
        window.setTimeout(() => {
          if (!document.hidden && win) {
            say(
              `Vorgang ${ref}: Falls sich kein E-Mail-Programm geöffnet hat, schreib uns ` +
                `direkt an ${mail} und nenn die Vorgangsnummer — der WhatsApp-Teil ist raus.`,
              'warn'
            );
          }
        }, 1500);
      } catch (err) {
        console.error('Anfrage konnte nicht vorbereitet werden:', err);
        say('Das hat leider nicht geklappt. Schreib uns bitte direkt an ' + mail + '.', 'warn');
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // novalidate im Markup -> wir lösen die Prüfung selbst aus, damit die
      // Meldung erst nach dem Absenden erscheint und nicht beim Tippen.
      senden('mail');
    });

    const waBtn = form.querySelector('[data-whatsapp-trigger]');
    if (waBtn) waBtn.addEventListener('click', () => senden('whatsapp'));
  });
})();
