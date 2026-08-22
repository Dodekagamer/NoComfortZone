const site = require('./site.json');
const { SITE_URL } = require('./base-path');
const { esc, safeUrl } = require('./escape');
const { structuredData } = require('./structured-data');

function renderNav(currentUrl) {
  const items = site.nav
    .map((item) => {
      const active = item.url === currentUrl ? ' aria-current="page"' : '';
      return `<li><a href="${safeUrl(item.url)}"${active}>${esc(item.label)}</a></li>`;
    })
    .join('\n        ');
  return `<nav id="siteNav" aria-label="Hauptnavigation">
  <ul>
        ${items}
  </ul>
  <div class="nav-cta-mobile"><a href="/buchung/" class="btn solid">Mitmachen</a></div>
</nav>`;
}

function renderFooter() {
  const navLinks = site.nav
    .map((item) => `<a href="${safeUrl(item.url)}">${esc(item.label)}</a>`)
    .join('\n        ');
  const legalLinks = site.footerLegal
    .map((item) => `<a href="${safeUrl(item.url)}">${esc(item.label)}</a>`)
    .join('\n        ');
  return `<footer id="kontakt-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <h3>No Comfort Zone</h3>
        <p class="footer-claim">Eine Gemeinschaft von Menschen, die gemeinsam wachsen möchten. Nicht perfekt. Nicht elitär. Sondern ehrlich. Haki Sports ist unser professionelles 1:1-Coaching-Angebot innerhalb der Bewegung.</p>
      </div>
      <div>
        <h3>Kontakt</h3>
        <a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a>
        <a href="tel:${esc(site.contact.phoneHref)}">${esc(site.contact.phoneDisplay)}</a>
        <p>${esc(site.contact.address)}</p>
      </div>
      <div>
        <h3>Folgen &amp; mitreden</h3>
        ${site.social
          .map((s) => `<a href="${safeUrl(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>`)
          .join('\n        ')}
        ${site.groups
          .map((g) => `<a href="${safeUrl(g.url)}" target="_blank" rel="noopener noreferrer">WhatsApp: ${esc(g.label)}</a>`)
          .join('\n        ')}
      </div>
      <div>
        <h3>Navigation</h3>
        ${navLinks}
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 No Comfort Zone · ${esc(site.city)}</span>
      <span class="footer-legal">
        ${legalLinks}
      </span>
      <span>Sport ist unser Werkzeug. Der Mensch ist unser Mittelpunkt.</span>
    </div>
  </div>
</footer>`;
}

function renderPage({ title, description, shareTitle, robots, bodyClass, url, content }) {
  const bodyClassAttr = bodyClass ? ` class="${esc(bodyClass)}"` : '';
  const pageTitle = title || site.name;
  const pageDescription = description || site.defaultDescription;
  // Suchergebnisse schneiden den <title> bei rund 60 Zeichen ab, Social-Vorschauen
  // zeigen deutlich mehr. Deshalb darf eine Seite fuer og:/twitter: eine laengere
  // Fassung mitgeben — der Markenclaim bleibt dort vollstaendig erhalten.
  const socialTitle = shareTitle || pageTitle;
  // Die Formulare schicken die Anfrage per fetch an den Worker. Ohne passenden
  // connect-src wuerde die CSP genau das blockieren (default-src ist 'none').
  // Ist kein Endpunkt hinterlegt, bleibt es bei 'none' — dann laeuft die Seite
  // ueber den mailto-Weg und braucht keine Verbindung nach aussen.
  const connectSrc = (() => {
    if (!site.formEndpoint) return "'none'";
    let url;
    try {
      url = new URL(site.formEndpoint);
    } catch (err) {
      throw new Error(
        `site.json: formEndpoint ist keine gueltige URL: "${site.formEndpoint}"`
      );
    }
    // Nur https zulassen. Ein Tippfehler oder ein versehentlich eingefuegter
    // anderer Wert (z. B. "javascript:...") wuerde sonst still eine kaputte
    // Seite erzeugen: connect-src waere unbrauchbar und das Absenden schluege
    // ohne erkennbaren Grund fehl. Lieber der Build bricht ab.
    if (url.protocol !== 'https:') {
      throw new Error(
        `site.json: formEndpoint muss mit https:// beginnen, ist aber "${site.formEndpoint}"`
      );
    }
    return url.origin;
  })();
  // Die Fehlerseite soll nicht im Index landen (GitHub Pages liefert sie zwar
  // mit Status 404 aus, das Meta ist die zweite, unabhaengige Absicherung).
  const robotsMeta = robots ? `\n<meta name="robots" content="${esc(robots)}">` : '';
  const canonicalUrl = `${SITE_URL}${url}`;
  const ogImage = `${SITE_URL}/assets/img/hero-bg.jpg`;
  // Nur die Startseite zeigt das Hero-Foto — dort lohnt der Vorabruf, weil es
  // sonst erst nach dem CSS entdeckt wird (spürbar auf Mobilfunk).
  const preloadHero =
    url === '/'
      ? '\n<link rel="preload" as="image" href="/assets/img/hero-bg.webp" type="image/webp" fetchpriority="high">'
      : '';
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<!-- Kein 'unsafe-inline' mehr: die Seite kommt ohne Inline-Style-Attribute aus,
     dadurch greift CSS-Injection ins Leere. frame-ancestors fehlt bewusst —
     per <meta> ignorieren Browser die Direktive, und GitHub Pages kann keine
     echten HTTP-Header setzen. -->
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src ${connectSrc}; form-action 'none'; base-uri 'none'; object-src 'none'; frame-src 'none'; manifest-src 'self'">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="theme-color" content="#15161a">
<title>${esc(pageTitle)}</title>
<meta name="description" content="${esc(pageDescription)}">${robotsMeta}
<link rel="canonical" href="${esc(canonicalUrl)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(socialTitle)}">
<meta property="og:description" content="${esc(pageDescription)}">
<meta property="og:url" content="${esc(canonicalUrl)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:image:width" content="1500">
<meta property="og:image:height" content="730">
<meta property="og:image:alt" content="Gruppenfoto der No-Comfort-Zone-Community nach einem gemeinsamen Outdoor-Training in Karlsruhe">
<meta property="og:locale" content="de_DE">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(socialTitle)}">
<meta name="twitter:description" content="${esc(pageDescription)}">
<meta name="twitter:image" content="${esc(ogImage)}">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&amp;family=Space+Mono:wght@400;700&amp;family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/styles.css">${preloadHero}
${structuredData({ url, title: pageTitle })}
</head>
<body${bodyClassAttr}>

<a href="#top" class="skip-link">Zum Inhalt springen</a>

<header id="siteHeader">
  <div class="wrap navbar">
    <a href="/" class="logo" aria-label="No Comfort Zone — zur Startseite">NO COMFORT<span>.</span>ZONE</a>
    ${renderNav(url)}
    <div class="navbar-cta">
      <a href="/buchung/" class="btn solid small">Mitmachen</a>
      <button type="button" class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="siteNav" aria-label="Menü öffnen">☰</button>
    </div>
  </div>
  <div class="hazard-strip"></div>
</header>

<main id="top">
${content}
</main>

${renderFooter()}

<script src="/assets/js/main.js"></script>
</body>
</html>
`;
}

module.exports = { renderPage, site };
