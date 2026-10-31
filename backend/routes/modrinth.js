// Public Modrinth proxy used by the marketplace and the install pickers.
// Every input is clamped/encoded before it reaches the upstream URL, every
// call has a timeout, and responses are cached briefly: the marketplace
// landing fires the same two feed queries on every visit, and Modrinth
// rate-limits by IP (300 req/min).
const express = require('express');
const router = express.Router();

const BASE = process.env.MODRINTH_API || 'https://api.modrinth.com/v2';
const UA = 'CraftHost/1.0 (crafthost.up.railway.app)';
const TIMEOUT_MS = 15_000;
const CACHE_TTL_MS = 60_000;
const CACHE_MAX = 500;

const cache = new Map(); // url -> { at, status, body }

async function cachedJson(url) {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit;
  const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(TIMEOUT_MS) });
  const body = await r.json().catch(() => null);
  const entry = { at: Date.now(), status: r.ok ? 200 : (r.status === 404 ? 404 : 502), body };
  if (r.ok) {
    if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value); // oldest first
    cache.set(url, entry);
  }
  return entry;
}

function int(v, def, min, max) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def;
}
// Loader / game-version tokens: letters, digits, dot, dash, underscore.
const TOKEN = /^[\w.-]{1,40}$/;
const token = (v) => (typeof v === 'string' && TOKEN.test(v) ? v : null);
// Modrinth project ids / slugs.
const ID = /^[\w.-]{1,64}$/;

function fail(res, label, err) {
  console.warn(`[modrinth] ${label}: ${err.message}`);
  res.status(err.name === 'TimeoutError' ? 504 : 502).json({ error: `Modrinth ${label} failed` });
}

router.get('/search', async (req, res) => {
  const q = String(req.query.q || '').slice(0, 100);
  const limit = int(req.query.limit, 24, 1, 50);
  const offset = int(req.query.offset, 0, 0, 10_000);
  // loader may be a comma list (OR): paper,spigot,bukkit
  const loaders = String(req.query.loader || '').split(',').map(token).filter(Boolean).slice(0, 8);
  const version = token(req.query.version);
  const { type } = req.query;

  // Modrinth facets: each top-level array is an AND group, elements inside are OR.
  const facets = [];
  if (loaders.length) facets.push(loaders.map(l => `categories:${l}`));
  if (version) facets.push([`versions:${version}`]);
  if (type === 'modpack' || type === 'mod' || type === 'plugin') facets.push([`project_type:${type}`]);
  else facets.push(['project_type:mod', 'project_type:plugin']);

  const validSorts = new Set(['relevance', 'downloads', 'follows', 'newest', 'updated']);
  const sort = validSorts.has(req.query.sort) ? req.query.sort : 'relevance';

  const params = new URLSearchParams({
    query: q, limit: String(limit), offset: String(offset), index: sort, facets: JSON.stringify(facets),
  });
  try {
    const { status, body } = await cachedJson(`${BASE}/search?${params}`);
    if (status !== 200) return res.status(status).json({ error: 'Modrinth search failed' });
    res.set('Cache-Control', 'public, max-age=60').json(body);
  } catch (err) { fail(res, 'search', err); }
});

router.get('/project/:id', async (req, res) => {
  if (!ID.test(req.params.id)) return res.status(400).json({ error: 'Invalid project id' });
  try {
    const { status, body } = await cachedJson(`${BASE}/project/${encodeURIComponent(req.params.id)}`);
    if (status !== 200) return res.status(status).json({ error: 'Modrinth project not found' });
    res.json(body);
  } catch (err) { fail(res, 'fetch', err); }
});

// GET /api/modrinth/project/:id/versions?loaders=paper,spigot&game_versions=1.21.1
router.get('/project/:id/versions', async (req, res) => {
  if (!ID.test(req.params.id)) return res.status(400).json({ error: 'Invalid project id' });
  const list = (v) => String(v || '').split(',').map(token).filter(Boolean).slice(0, 10);
  const params = new URLSearchParams();
  const loaders = list(req.query.loaders);
  const gameVersions = list(req.query.game_versions);
  if (loaders.length) params.set('loaders', JSON.stringify(loaders));
  if (gameVersions.length) params.set('game_versions', JSON.stringify(gameVersions));
  try {
    const url = `${BASE}/project/${encodeURIComponent(req.params.id)}/version${params.toString() ? '?' + params : ''}`;
    const { status, body } = await cachedJson(url);
    if (status !== 200) return res.status(status).json({ error: 'Modrinth versions fetch failed', versions: [] });
    // Trim to a UI-friendly shape
    const out = (Array.isArray(body) ? body : []).map(v => ({
      id: v.id,
      version_number: v.version_number,
      name: v.name,
      loaders: v.loaders,
      game_versions: v.game_versions,
      date_published: v.date_published,
      downloads: v.downloads,
      file: (v.files || []).find(f => f.primary) || v.files?.[0] || null,
    }));
    res.json({ versions: out });
  } catch (err) { fail(res, 'versions fetch', err); }
});

module.exports = router;
