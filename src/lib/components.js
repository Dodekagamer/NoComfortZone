const { site } = require('./layout');

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

function priceValue(plan) {
  if (plan.price === 0) return 'Kostenlos';
  if (plan.price) return `€${euro(plan.price)}<span class="unit">/ ${plan.unit}</span>`;
  return `Individuell<span class="unit">${plan.unit}</span>`;
}

function priceCard(plan) {
  const features = plan.features.map((f) => `<li>${f}</li>`).join('\n    ');
  return `<div class="price-card${plan.highlight ? ' highlight' : ''}">
  <span class="price-tagline">${plan.tagline}</span>
  <h3>${plan.name}</h3>
  <div class="price">${priceValue(plan)}</div>
  <span class="price-badge">Beispielpreis</span>
  <ul>
    ${features}
  </ul>
  <a href="/buchung/" class="btn solid">Anfragen</a>
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
  return `<form class="form" data-form-type="${type}" data-mailto="${site.contact.email}" data-whatsapp-number="${site.contact.whatsappNumber}" id="${formId}">
  <h3>${title}</h3>
  <p class="form-intro">${intro}</p>
  <div class="form-row">
    <div class="form-field">
      <label for="${formId}-name">Name</label>
      <input type="text" id="${formId}-name" name="name" required>
    </div>
    <div class="form-field">
      <label for="${formId}-email">E-Mail</label>
      <input type="email" id="${formId}-email" name="email" required>
    </div>
  </div>
  <div class="form-row">
    <div class="form-field">
      <label for="${formId}-phone">Telefon (optional)</label>
      <input type="tel" id="${formId}-phone" name="phone">
    </div>
    <div class="form-field">
      <label for="${formId}-preferred">Wunschtermin (optional)</label>
      <input type="text" id="${formId}-preferred" name="preferred" placeholder="z. B. Di. abends">
    </div>
  </div>
  <div class="form-field">
    <label for="${formId}-message">Nachricht</label>
    <textarea id="${formId}-message" name="message" placeholder="${messagePlaceholder}"></textarea>
  </div>
  <div class="form-actions">
    <button type="submit" class="btn solid">Per E-Mail senden</button>
    <button type="button" class="btn whatsapp" data-whatsapp-trigger>Per WhatsApp anfragen</button>
  </div>
  <p class="form-note">Öffnet dein E-Mail-Programm bzw. WhatsApp mit vorausgefüllter Nachricht an ${site.contact.email} — kein automatischer Versand, keine Datenspeicherung durch uns.</p>
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
