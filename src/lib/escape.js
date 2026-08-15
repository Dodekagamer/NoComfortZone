/**
 * HTML-Escaping für alles, was aus Datendateien (site.json, pricing.json) in
 * die Seite eingesetzt wird.
 *
 * Warum: Diese Werte werden von Hand gepflegt (Name, Anschrift, Preise,
 * Social-Links). Ein & in einer Adresse ("Müller & Sohn") erzeugt ungültiges
 * HTML, ein " zerlegt ein Attribut, ein < könnte Markup einschleusen. Escaping
 * an dieser Grenze macht die Datendateien unkritisch — man kann dort beliebigen
 * Text eintragen, ohne die Seite kaputt zu machen.
 *
 * Bewusst NICHT auf die Seiteninhalte in src/pages/ angewandt: die sind Code
 * und enthalten absichtlich Markup (<br>, &amp;, …).
 */
function esc(value) {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Zusätzliche Absicherung für URLs aus Datendateien: erlaubt nur harmlose
 * Schemata bzw. relative Pfade. Verhindert, dass ein versehentlich (oder
 * böswillig) eingetragenes `javascript:` in einem href landet.
 */
function safeUrl(value) {
  const url = String(value === undefined || value === null ? '' : value).trim();
  if (/^(https?:|mailto:|tel:)/i.test(url)) return esc(url);
  if (/^[/#]/.test(url)) return esc(url); // relativer Pfad oder Anker
  return '#';
}

module.exports = { esc, safeUrl };
