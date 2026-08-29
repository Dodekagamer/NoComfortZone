const { site } = require('./layout');
const { esc, safeUrl } = require('./escape');

function euro(value) {
  if (value === undefined || value === null) return '';
  return Number(value).toLocaleString('de-DE');
}

function ctaBand(headline, buttonText, buttonHref, text, secondaryText, secondaryHref) {
  return `<div class="cta-band">
  <div class="wrap">
    <h2>${headline}</h2>
    ${text ? `<p>${text}</p>` : ''}
    <div class="cta-row">
      <a href="${buttonHref}" class="btn">${buttonText}</a>
      ${secondaryText ? `<a href="${secondaryHref}" class="btn">${secondaryText}</a>` : ''}
    </div>
  </div>
</div>`;
}

function quickAnswer(q, title, text, linkText, linkHref) {
  return `<div class="qf-card">
  <span class="qf-q">${q}</span>
  <h3>${title}</h3>
  <p>${text}</p>
  <a href="${linkHref}">${linkText} →</a>
</div>`;
}

function pillarCard(kind, tag, title, text, buttonText, buttonHref) {
  return `<div class="pillar-card ${kind}">
  <span class="pillar-tag">${tag}</span>
  <h3>${title}</h3>
  <p>${text}</p>
  <a href="${buttonHref}" class="btn solid">${buttonText}</a>
</div>`;
}

/* Werte aus pricing.json werden escaped — die Datei wird von Hand gepflegt.
   `priceText` schlaegt eine Zahl bewusst: Solange kein Verein eingetragen ist,
   gibt es keine festen Beitraege, und eine erfundene Zahl bleibt im Kopf
   haengen, das Wort "Beispielpreis" darunter nicht. Die Karte sagt dann
   stattdessen, was wirklich gilt. */
function priceValue(plan) {
  if (plan.priceText) return esc(plan.priceText);
  if (plan.price === 0) return `Kostenlos<span class="unit">/ ${esc(plan.unit)}</span>`;
  if (plan.price) return `€${esc(euro(plan.price))}<span class="unit">/ ${esc(plan.unit)}</span>`;
  return 'Auf Anfrage';
}

function priceCard(plan) {
  const features = (plan.features || []).map((f) => `<li>${esc(f)}</li>`).join('\n    ');
  /* Der Hinweis ueber der hervorgehobenen Karte kam frueher fest aus dem CSS
     ("Beliebt"). Auf einer kostenlosen Schnupperkarte ist das eine Behauptung,
     die niemand pruefen kann — deshalb sagt jetzt die Datendatei, was dort
     steht. */
  const hinweis = plan.highlight
    ? ` data-hinweis="${esc(plan.highlightLabel || 'Empfohlen')}"`
    : '';
  return `<div class="price-card${plan.highlight ? ' highlight' : ''}"${hinweis}>
  <span class="price-tagline">${esc(plan.tagline)}</span>
  <h3>${esc(plan.name)}</h3>
  <div class="price${plan.priceText ? ' price-offen' : ''}">${priceValue(plan)}</div>
  <span class="price-badge">${esc(plan.badge || 'Unverbindlich')}</span>
  <ul>
    ${features}
  </ul>
  <a href="/buchung/" class="btn solid">${esc(plan.name)} anfragen</a>
</div>`;
}

function pageHero(eyebrow, title, lead, ctaText, ctaHref, ctaText2, ctaHref2) {
  return `<div class="page-hero">
  <div class="wrap">
    <span class="eyebrow">${eyebrow}</span>
    <h1>${title}</h1>
    <p class="lead">${lead}</p>
    ${
      ctaText
        ? `<div class="cta-row">
      <a href="${ctaHref}" class="btn solid">${ctaText}</a>
      ${ctaText2 ? `<a href="${ctaHref2}" class="btn">${ctaText2}</a>` : ''}
    </div>`
        : ''
    }
  </div>
</div>`;
}

function offerCard(tag, title, text) {
  return `<div class="offer-card">
  <span class="tag">${tag}</span>
  <h3>${title}</h3>
  <p>${text}</p>
</div>`;
}

function step(num, title, text) {
  return `<div class="step">
  <span class="step-num">${num}</span>
  <h3>${title}</h3>
  <p>${text}</p>
</div>`;
}

/**
 * Anfrage-/Buchungsformular. type steuert Betreff der E-Mail/WhatsApp-Nachricht.
 * Kein Backend: Absenden öffnet mailto:-Link, WhatsApp-Button öffnet wa.me-Link.
 * Beide werden clientseitig in main.js aus den Feldwerten gebaut.
 */
function inquiryForm(formId, type, title, intro, messagePlaceholder) {
  const id = esc(formId);
  const mail = esc(site.contact.email);
  const endpoint = site.formEndpoint ? ` data-endpoint="${esc(site.formEndpoint)}"` : '';
  return `<form class="form" data-form-type="${esc(type)}" data-mailto="${mail}" data-whatsapp-number="${esc(site.contact.whatsappNumber)}"${endpoint} id="${id}" novalidate>
  <h3>${esc(title)}</h3>
  <p class="form-intro">${esc(intro)}</p>
  <div class="form-row">
    <div class="form-field">
      <label for="${id}-name">Name <span class="req" aria-hidden="true">*</span></label>
      <input type="text" id="${id}-name" name="name" autocomplete="name" autocapitalize="words" enterkeyhint="next" maxlength="80" required>
    </div>
    <div class="form-field">
      <label for="${id}-email">E-Mail <span class="req" aria-hidden="true">*</span></label>
      <input type="email" id="${id}-email" name="email" autocomplete="email" inputmode="email" spellcheck="false" autocapitalize="off" enterkeyhint="next" maxlength="120" required>
    </div>
  </div>
  <div class="form-row">
    <div class="form-field">
      <label for="${id}-phone">Telefon (optional)</label>
      <input type="tel" id="${id}-phone" name="phone" autocomplete="tel" inputmode="tel" enterkeyhint="next" maxlength="40">
    </div>
    <div class="form-field">
      <label for="${id}-preferred">Wunschtermin (optional)</label>
      <input type="text" id="${id}-preferred" name="preferred" placeholder="z. B. Di. abends" enterkeyhint="next" maxlength="80">
    </div>
  </div>
  <div class="form-field">
    <label for="${id}-message">Nachricht</label>
    <textarea id="${id}-message" name="message" placeholder="${esc(messagePlaceholder)}" enterkeyhint="done" maxlength="1200"></textarea>
  </div>
  <div class="form-field form-honeypot" aria-hidden="true">
    <label for="${id}-website">Bitte dieses Feld leer lassen</label>
    <input type="text" id="${id}-website" name="website" tabindex="-1" autocomplete="off">
  </div>
  <div class="form-actions">
    <button type="submit" class="btn solid">Anfrage senden</button>
    <button type="button" class="btn whatsapp" data-whatsapp-trigger>Senden + per WhatsApp melden</button>
  </div>
  <p class="form-status" id="${id}-status" data-form-status role="status" aria-live="polite"></p>
  <a class="btn whatsapp form-fallback" data-wa-fallback href="#" hidden>Dieselbe Anfrage per WhatsApp öffnen</a>
  <p class="form-note">Deine Anfrage wird direkt an uns übermittelt — du bekommst hier sofort eine Bestätigung mit deiner Vorgangsnummer. Mit dem zweiten Button meldest du dieselbe Anfrage zusätzlich per WhatsApp, damit wir sie sofort sehen; die Vorgangsnummer verbindet beide, es bleibt eine Anfrage. Wir speichern deine Daten nur, um dir zu antworten.</p>
  <noscript>
    <p class="form-note form-note-warn">Die Formulare brauchen JavaScript, um deine Eingaben vorzubereiten. Schreib uns stattdessen direkt an <a href="mailto:${mail}" class="inline-link">${mail}</a> oder ruf an: <a href="tel:${esc(site.contact.phoneHref)}" class="inline-link">${esc(site.contact.phoneDisplay)}</a> — Stichwort „${esc(type)}".</p>
  </noscript>
</form>`;
}

module.exports = {
  ctaBand,
  quickAnswer,
  pillarCard,
  priceCard,
  pageHero,
  offerCard,
  step,
  inquiryForm
};
