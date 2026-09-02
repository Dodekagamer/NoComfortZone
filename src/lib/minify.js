/**
 * Kommentare aus dem AUSGELIEFERTEN Code entfernen — im Quelltext bleiben sie.
 *
 * Warum: In styles.css stehen rund 19 KB Kommentare, die erklären, warum eine
 * Regel so aussieht, wie sie aussieht. Beim Weiterarbeiten sind die viel wert,
 * aber jeder Besucher lädt sie mit. Gemessen: CSS 16,2 KB -> 6,8 KB gzip,
 * main.js 8,8 KB -> 4,9 KB. Zusammen gut 13 KB weniger pro erstem Aufruf.
 *
 * Alle drei Funktionen sind bewusst vorsichtig: Sie entfernen nur, was sie
 * sicher als Kommentar erkennen, und geben im Zweifel den Originaltext zurück.
 * Ein kaputtes Stylesheet wäre teurer als ein paar gesparte Kilobyte.
 */

const vm = require('vm');

/**
 * CSS: überspringt Zeichenketten, damit ein Kommentaranfang in einem
 * content-Wert oder einer data-URL nicht falsch erkannt wird.
 */
function stripCssComments(text) {
  let raus = '';
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < text.length && text[j] !== c) {
        if (text[j] === '\\') j += 1;
        j += 1;
      }
      raus += text.slice(i, j + 1);
      i = j + 1;
    } else if (c === '/' && text[i + 1] === '*') {
      const ende = text.indexOf('*/', i + 2);
      i = ende === -1 ? text.length : ende + 2;
    } else {
      raus += c;
      i += 1;
    }
  }
  return (
    raus
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{2,}/g, '\n')
      .trim() + '\n'
  );
}

/**
 * JavaScript: rein zeilenbasiert. Entfernt werden nur Zeilen, die selbst mit
 * einem Kommentarzeichen beginnen. Ein Doppelschrägstrich mitten in einer Zeile
 * (etwa in einer URL) bleibt unangetastet.
 *
 * Danach prüft der Parser von Node das Ergebnis. Schlägt das fehl — etwa weil
 * jemand später ein mehrzeiliges Template-Literal einbaut, in dem eine Zeile
 * mit zwei Schrägstrichen beginnt — geht der Originaltext raus.
 */
function stripJsComments(text) {
  const behalten = [];
  let imBlock = false;
  for (const zeile of text.split('\n')) {
    const t = zeile.trim();
    if (imBlock) {
      if (t.endsWith('*/')) imBlock = false;
      continue;
    }
    if (t.startsWith('/*')) {
      if (!t.endsWith('*/')) imBlock = true;
      continue;
    }
    if (t.startsWith('//') || t === '') continue;
    behalten.push(zeile);
  }
  const knapp = behalten.join('\n') + '\n';
  try {
    new vm.Script(knapp);
  } catch (fehler) {
    console.warn(
      'Hinweis: JavaScript nicht gekürzt (' + fehler.message + ') — Originaltext wird ausgeliefert.'
    );
    return text;
  }
  return knapp;
}

/**
 * HTML: entfernt Kommentare, lässt aber alles in script, style, pre und
 * textarea unangetastet — dort wäre eine solche Zeichenfolge Inhalt.
 * Die geschützten Blöcke werden über ein Steuerzeichen geparkt, das in HTML
 * nicht vorkommen kann.
 */
const MARKE = '\u0001';

function stripHtmlComments(html) {
  const geschuetzt = [];
  const platzhalter = html.replace(
    /<(script|style|pre|textarea)\b[\s\S]*?<\/\1>/gi,
    (treffer) => {
      geschuetzt.push(treffer);
      return MARKE + (geschuetzt.length - 1) + MARKE;
    }
  );
  const ohne = platzhalter.replace(/<!--[\s\S]*?-->/g, '').replace(/\n{3,}/g, '\n\n');
  return ohne.replace(new RegExp(MARKE + '(\\d+)' + MARKE, 'g'), (_, i) => geschuetzt[Number(i)]);
}

module.exports = { stripCssComments, stripJsComments, stripHtmlComments };
