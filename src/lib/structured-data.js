const site = require('./site.json');
const { SITE_URL } = require('./base-path');

/**
 * JSON-LD für Suchmaschinen und KI-Assistenten (Google, Gemini, ChatGPT,
 * Perplexity …). Die lesen strukturierte Daten aus, um Angebote überhaupt
 * als lokales Angebot zu erkennen und in Antworten zu empfehlen.
 *
 * Bewusst zurückhaltend: Es wird nur ausgegeben, was auch stimmt. Solange in
 * site.json noch Platzhalter stehen (Anschrift!), wird KEINE Adresse und
 * KEIN Preis ausgezeichnet — falsche strukturierte Daten sind schlimmer als
 * gar keine (Google wertet das als Spam-Signal). Sobald die echte Anschrift
 * eingetragen ist, ergänzt `postalAddress()` sie automatisch und der Typ
 * wechselt zu SportsActivityLocation — dann sind auch lokale Rich Results
 * und ein Eintrag in Kartenantworten möglich.
 */
function isPlaceholder(value) {
  return typeof value !== 'string' || value.trim() === '' || value.includes('[');
}

function postalAddress() {
  const { street, postalCode, city } = site.legal || {};
  if (isPlaceholder(street) || isPlaceholder(postalCode)) return null;
  return {
    '@type': 'PostalAddress',
    streetAddress: street,
    postalCode: postalCode,
    addressLocality: city || site.city,
    addressCountry: 'DE'
  };
}

function organization() {
  const address = postalAddress();
  const node = {
    '@type': address ? 'SportsActivityLocation' : 'Organization',
    '@id': `${SITE_URL}/#organisation`,
    name: site.name,
    description: site.defaultDescription,
    url: `${SITE_URL}/`,
    email: site.contact.email,
    telephone: '+' + site.contact.whatsappNumber,
    image: `${SITE_URL}/assets/img/hero-bg.jpg`,
    areaServed: { '@type': 'City', name: site.city },
    knowsAbout: ['Boxen', 'Calisthenics', 'Outdoor-Training', 'Personal Training', 'Prävention']
  };
  if (address) node.address = address;

  const socials = (site.social || [])
    .filter((s) => !s.placeholder && /^https?:/i.test(s.url || ''))
    .map((s) => s.url);
  if (socials.length) node.sameAs = socials;

  return node;
}

function website() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: site.name,
    inLanguage: 'de-DE',
    publisher: { '@id': `${SITE_URL}/#organisation` }
  };
}

function breadcrumb(url, title) {
  if (url === '/') return null;
  const label = String(title || '').split('—')[0].trim() || url;
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Start', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: label, item: `${SITE_URL}${url}` }
    ]
  };
}

/** Liefert den fertigen <script type="application/ld+json">-Block für eine Seite. */
function structuredData({ url, title }) {
  const graph = [organization(), website()];
  const crumbs = breadcrumb(url, title);
  if (crumbs) graph.push(crumbs);

  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  // </script> im JSON kann das Skript-Tag vorzeitig beenden — hier kommt zwar
  // nur eigener Text rein, die Absicherung kostet aber nichts.
  const safe = json.replace(/<\//g, '<\\/');
  return `<script type="application/ld+json">${safe}</script>`;
}

module.exports = { structuredData };
