/* No Comfort Zone — main.js
   1) Mobile-Navigation (Toggle-Button, wird für alle Seiten gebraucht)
   2) GSAP-Scrollytelling-Hero (nur aktiv, wenn .scroll-intro im DOM ist = Startseite)
   3) Anfrage-/Buchungsformulare -> mailto: und WhatsApp (wa.me), kein Backend
*/

(function initMobileNav() {
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  if (!header || !toggle || !nav) return;

  function closeMenu() {
    header.removeAttribute('data-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  function openMenu() {
    header.setAttribute('data-open', 'true');
    toggle.setAttribute('aria-expanded', 'true');
  }

  toggle.addEventListener('click', () => {
    if (header.getAttribute('data-open') === 'true') closeMenu();
    else openMenu();
  });
  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();

(function initScrollytellingHero() {
  const introSection = document.querySelector('.scroll-intro');
  if (!introSection) return; // nur auf der Startseite vorhanden

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const p1 = document.getElementById('p1');
  const p2 = document.getElementById('p2');
  const p3 = document.getElementById('p3');
  const p4 = document.getElementById('p4');
  const sweep = document.getElementById('introSweep');
  const cue = document.getElementById('scrollCue');

  if (prefersReduced || typeof gsap === 'undefined') {
    [p1, p2, p3].forEach(p => { if (p) p.style.display = 'none'; });
    if (p4) p4.style.opacity = 1;
    if (cue) cue.style.display = 'none';
    introSection.style.height = '100vh';
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.scroll-intro',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6
    }
  });

  tl.to(p1, { opacity: 0, y: -30, duration: 1 }, 1)
    .fromTo(p2, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, 1)
    .to(p2, { opacity: 0, y: -30, duration: 1 }, 2.4)
    .fromTo(p3, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, 2.4)
    .to(p3, { opacity: 0, y: -30, duration: 1 }, 3.8)
    .fromTo(p4, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2 }, 3.8);

  gsap.to(sweep, {
    xPercent: 260,
    ease: 'none',
    scrollTrigger: {
      trigger: '.scroll-intro',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6
    }
  });

  ScrollTrigger.create({
    trigger: '.scroll-intro',
    start: 'top top',
    end: '+=80',
    scrub: true,
    onUpdate: self => { if (cue) cue.style.opacity = 1 - self.progress; }
  });
})();

(function initInquiryForms() {
  const forms = document.querySelectorAll('form[data-form-type]');
  if (!forms.length) return;

  function buildMessage(form) {
    const type = form.getAttribute('data-form-type');
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const phone = (data.get('phone') || '').toString().trim();
    const preferred = (data.get('preferred') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();

    const lines = [
      `Anfrage: ${type}`,
      `Name: ${name}`,
      `E-Mail: ${email}`
    ];
    if (phone) lines.push(`Telefon: ${phone}`);
    if (preferred) lines.push(`Wunschtermin: ${preferred}`);
    if (message) lines.push('', 'Nachricht:', message);

    return {
      subject: `[Anfrage: ${type}]${name ? ' ' + name : ''}`,
      body: lines.join('\n'),
      name, email
    };
  }

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const to = form.getAttribute('data-mailto');
      const { subject, body } = buildMessage(form);
      const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    });

    const waBtn = form.querySelector('[data-whatsapp-trigger]');
    if (waBtn) {
      waBtn.addEventListener('click', () => {
        const number = form.getAttribute('data-whatsapp-number');
        const { subject, body } = buildMessage(form);
        const text = `${subject}\n\n${body}`;
        const waUrl = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
        window.open(waUrl, '_blank', 'noopener');
      });
    }
  });
})();
