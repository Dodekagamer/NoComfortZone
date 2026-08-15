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
  const FADE = 0.1; // Überblendbreite zwischen zwei Panels

  function opacityFor(index, progress) {
    const start = STOPS[index];
    const end = index < STOPS.length - 1 ? STOPS[index + 1] : Infinity;
    if (progress < start - FADE) return 0;
    if (progress < start) return (progress - (start - FADE)) / FADE; // einblenden
    if (progress < end - FADE) return 1;
    if (end === Infinity) return 1;
    return Math.max(0, 1 - (progress - (end - FADE)) / FADE); // ausblenden
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

  function buildMessage(form) {
    const type = form.getAttribute('data-form-type');
    const data = new FormData(form);
    const value = (key) => (data.get(key) || '').toString().trim();
    const name = value('name');
    const lines = [`Anfrage: ${type}`, `Name: ${name}`, `E-Mail: ${value('email')}`];
    if (value('phone')) lines.push(`Telefon: ${value('phone')}`);
    if (value('preferred')) lines.push(`Wunschtermin: ${value('preferred')}`);
    if (value('message')) lines.push('', 'Nachricht:', value('message'));

    return {
      subject: `[Anfrage: ${type}]${name ? ' ' + name : ''}`,
      body: lines.join('\n')
    };
  }

  forms.forEach((form) => {
    const status = form.querySelector('[data-form-status]');
    const mail = form.getAttribute('data-mailto');
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

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // novalidate im Markup -> wir lösen die Prüfung selbst aus, damit die
      // Meldung erst nach dem Absenden erscheint und nicht beim Tippen.
      const invalid = markValidity();
      if (invalid) {
        say('Bitte fülle Name und E-Mail aus, dann kann es losgehen.', 'warn');
        invalid.focus();
        return;
      }
      try {
        const { subject, body } = buildMessage(form);
        say('Dein E-Mail-Programm sollte sich jetzt öffnen …');
        window.location.href =
          `mailto:${mail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        // Öffnet sich nichts (kein Mailprogramm eingerichtet — auf dem Handy
        // häufig), bleibt die Seite sichtbar. Dann den Weg per Hand anbieten.
        window.setTimeout(() => {
          if (!document.hidden) {
            say(
              'Falls sich kein E-Mail-Programm geöffnet hat: schreib uns direkt an ' +
                mail +
                ' — oder nutze den WhatsApp-Button.',
              'warn'
            );
          }
        }, 1500);
      } catch (err) {
        console.error('Anfrage konnte nicht vorbereitet werden:', err);
        say('Das hat leider nicht geklappt. Schreib uns bitte direkt an ' + mail + '.', 'warn');
      }
    });

    const waBtn = form.querySelector('[data-whatsapp-trigger]');
    if (waBtn) {
      waBtn.addEventListener('click', () => {
        const invalid = markValidity();
        if (invalid) {
          say('Bitte fülle Name und E-Mail aus, dann kann es losgehen.', 'warn');
          invalid.focus();
          return;
        }
        try {
          const { subject, body } = buildMessage(form);
          const text = `${subject}\n\n${body}`;
          const win = window.open(
            `https://wa.me/${form.getAttribute('data-whatsapp-number')}?text=${encodeURIComponent(text)}`,
            '_blank',
            'noopener'
          );
          say(
            win
              ? 'WhatsApp wird geöffnet …'
              : 'Dein Browser hat das Fenster blockiert — bitte Pop-ups erlauben oder per E-Mail schreiben.',
            win ? null : 'warn'
          );
        } catch (err) {
          console.error('WhatsApp-Anfrage konnte nicht vorbereitet werden:', err);
          say('Das hat leider nicht geklappt. Schreib uns bitte direkt an ' + mail + '.', 'warn');
        }
      });
    }
  });
})();
