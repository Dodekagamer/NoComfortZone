/* Setzt die "js"-Markierung, BEVOR der Body gerendert wird.
   Muss eine eigene, im <head> synchron geladene Datei sein: ein Inline-Skript
   verbietet die Content-Security-Policy (script-src 'self', kein unsafe-inline),
   und main.js am Seitenende kommt zu spaet — dann zeigt der Hero auf langsamer
   Verbindung erst seinen Endzustand und springt danach an den Anfang zurueck. */
document.documentElement.classList.add('js');
