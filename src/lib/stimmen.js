/**
 * Stimmen aus der Community.
 *
 * Hier standen drei erfundene Zitate („Trainingsteilnehmer:in, Karlsruhe").
 * Ausgerechnet bei einer Marke, deren Versprechen „Kein Hochglanz, nur echte
 * Menschen" lautet, ist das der teuerste Satz auf der Seite — er kostet genau
 * die Glaubwürdigkeit, die er herstellen soll.
 *
 * Deshalb: `stimmen.json` ist leer und die Zitate erscheinen erst, wenn dort
 * echte drinstehen. Ein Eintrag braucht nur zwei Felder:
 *
 *   { "zitat": "…", "wer": "Marie, seit 2024 dabei" }
 *
 * Solange die Liste leer ist, zeigt die Startseite an derselben Stelle, was
 * nachprüfbar ist — das feste Training und die Kanäle — und die
 * Community-Seite lässt den Abschnitt ganz weg.
 */
const { esc } = require('./escape');
const stimmen = require('./stimmen.json');

function hatStimmen() {
  return stimmen.length > 0;
}

function pruefeDaten() {
  stimmen.forEach((s, i) => {
    const wo = `src/lib/stimmen.json: Stimme ${i + 1}`;
    if (!s.zitat) throw new Error(`${wo}: "zitat" fehlt.`);
    if (!s.wer) {
      throw new Error(
        `${wo}: "wer" fehlt. Ein Zitat ohne Zuordnung wirkt ausgedacht — genau das soll hier nicht mehr stehen.`
      );
    }
  });
}

/** Die Zitatkarten. Leer, wenn es keine gibt — dann rendert die Seite etwas anderes. */
function stimmenKarten() {
  if (!hatStimmen()) return '';
  const karten = stimmen
    .map(
      (s) => `<div class="t-card">
        <p class="quote">„${esc(s.zitat)}“</p>
        <div class="who">${esc(s.wer)}</div>
      </div>`
    )
    .join('\n      ');
  return `<div class="testimonials">
      ${karten}
    </div>`;
}

module.exports = { hatStimmen, pruefeDaten, stimmenKarten };
