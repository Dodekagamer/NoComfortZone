/* Laeuft als erstes im <head>, noch bevor der Body gerendert wird.
   Muss eine eigene, synchron geladene Datei sein: ein Inline-Skript verbietet
   die Content-Security-Policy (script-src 'self', kein unsafe-inline), und
   main.js am Seitenende kaeme zu spaet — Inhalte waeren dann kurz in ihrer
   Endposition zu sehen und wuerden danach zurueckspringen. */
(function () {
  var wurzel = document.documentElement;
  wurzel.classList.add('js');

  // Wer im System "Bewegung reduzieren" eingestellt hat, bekommt gar keine
  // Startposition gesetzt — die Inhalte stehen dann sofort da.
  var ruhig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (ruhig) return;

  // "anim" versetzt die Einblend-Elemente in ihre Startposition (siehe CSS).
  wurzel.classList.add('anim');

  /* Sicherheitsnetz: Aufgehoben wird die Startposition von main.js. Laedt das
     nicht (Netzfehler, Blocker, Zeitueberschreitung), bliebe die Seite sonst
     dauerhaft unsichtbar. Nach 1,5 Sekunden ohne Uebernahme zeigen wir daher
     einfach alles an — lieber ohne Animation als gar nicht. */
  window.setTimeout(function () {
    if (!wurzel.classList.contains('anim-aktiv')) wurzel.classList.remove('anim');
  }, 1500);
})();
