/**
 * Single source of truth for where this site is deployed.
 * GitHub Pages serves project repos (repo not named "<owner>.github.io")
 * under a subpath: https://dodekagamer.github.io/NoComfortZone/ — so every
 * root-relative link/asset path needs that prefix, or the live site breaks
 * (blank CSS, 404 nav links).
 *
 * Override via env vars if this ever moves (e.g. a custom domain via CNAME
 * -> SITE_BASE_PATH="" and SITE_ORIGIN="https://noconfortzone.example").
 */
const BASE_PATH = process.env.SITE_BASE_PATH !== undefined ? process.env.SITE_BASE_PATH : '/NoComfortZone';
const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://dodekagamer.github.io';
const SITE_URL = SITE_ORIGIN + BASE_PATH;

module.exports = { BASE_PATH, SITE_ORIGIN, SITE_URL };
