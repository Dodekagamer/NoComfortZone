#!/usr/bin/env node
/** Minimal static file server for local preview of _site/. No dependencies. */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '_site');
const PORT = process.env.PORT || 8080;
// Der Build schreibt Links mit Base-Path (z. B. /NoComfortZone/...), weil
// GitHub Pages die Seite unter diesem Unterpfad ausliefert. Damit die lokale
// Vorschau CSS/JS findet, wird dasselbe Präfix hier akzeptiert und abgeschnitten.
const { BASE_PATH } = require('./src/lib/base-path');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);

  // Base-Path-Präfix abschneiden, damit sowohl "/" als auch "/NoComfortZone/"
  // funktionieren (Letzteres entspricht der echten Live-URL).
  if (BASE_PATH && (urlPath === BASE_PATH || urlPath.startsWith(BASE_PATH + '/'))) {
    urlPath = urlPath.slice(BASE_PATH.length) || '/';
  }

  if (urlPath.endsWith('/')) urlPath += 'index.html';
  let filePath = path.join(ROOT, urlPath);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      const fallback = path.join(ROOT, urlPath, 'index.html');
      fs.readFile(fallback, (err2, data2) => {
        if (err2) {
          // eigene 404-Seite ausliefern, wie GitHub Pages es tut
          fs.readFile(path.join(ROOT, '404.html'), (err3, data3) => {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(err3 ? 'Not found' : data3);
          });
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data2);
      });
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`No Comfort Zone Preview: http://localhost:${PORT}${BASE_PATH}/`);
});
