const site = require('./site.json');

function renderNav(currentUrl) {
  const items = site.nav
    .map((item) => {
      const active = item.url === currentUrl ? ' aria-current="page"' : '';
      return `<li><a href="${item.url}"${active}>${item.label}</a></li>`;
    })
    .join('\n        ');
  return `<nav id="siteNav">
  <ul>
        ${items}
  </ul>
</nav>`;
}

function renderFooter() {
  const navLinks = site.nav.map((item) => `<a href="${item.url}">${item.label}</a>`).join('\n        ');
  const legalLinks = site.footerLegal
    .map((item) => `<a href="${item.url}">${item.label}</a>`)
    .join('\n        ');
  return `<footer id="kontakt-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <h3>No Comfort Zone</h3>
        <p style="max-width:38ch; opacity:0.75;">Eine Gemeinschaft von Menschen, die gemeinsam wachsen möchten. Nicht perfekt. Nicht elitär. Sondern ehrlich. Haki Sports ist unser professionelles 1:1-Coaching-Angebot innerhalb der Bewegung.</p>
      </div>
      <div>
        <h3>Kontakt</h3>
        <a href="mailto:${site.contact.email}">${site.contact.email}</a>
        <a href="tel:${site.contact.phoneHref}">${site.contact.phoneDisplay}</a>
        <p>${site.contact.address}</p>
      </div>
      <div>
        <h3>Navigation</h3>
        ${navLinks}
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 No Comfort Zone · ${site.city}</span>
      <span class="footer-legal">
        ${legalLinks}
      </span>
      <span>Sport ist unser Werkzeug. Der Mensch ist unser Mittelpunkt.</span>
    </div>
  </div>
</footer>`;
}

function renderPage({ title, description, bodyClass, url, content }) {
  const bodyClassAttr = bodyClass ? ` class="${bodyClass}"` : '';
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title || site.name}</title>
<meta name="description" content="${description || site.defaultDescription}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/styles.css">
</head>
<body${bodyClassAttr}>

<header id="siteHeader">
  <div class="wrap navbar">
    <a href="/" class="logo">NO COMFORT<span>.</span>ZONE</a>
    ${renderNav(url)}
    <div class="navbar-cta">
      <a href="/buchung/" class="btn solid small">Mitmachen</a>
      <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="siteNav" aria-label="Menü öffnen">☰</button>
    </div>
  </div>
</header>
<div class="hazard-strip"></div>

<main id="top">
${content}
</main>

${renderFooter()}

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="/assets/js/main.js"></script>
</body>
</html>
`;
}

module.exports = { renderPage, site };
