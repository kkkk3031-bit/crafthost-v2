// Plugin install — fetches a Modrinth version's primary JAR and lands it in
// <server_data_dir>/plugins/<filename>.jar. Same per-server isolation as files.js.

const express = require('express');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const crypto = require('crypto');
const db = require('../db');
const { authMiddleware } = require('../lib/auth');
const storage = require('../lib/storage');

const router = express.Router({ mergeParams: true });
router.use(authMiddleware);

const DATA_DIR = require("../lib/paths").DATA_DIR;
const MODRINTH = process.env.MODRINTH_API || 'https://api.modrinth.com/v2';
const UA = 'CraftHost/1.0 (crafthost.up.railway.app)';
const MAX_JAR_BYTES = 250 * 1024 * 1024; // 250 MB
const MAX_PACK_BYTES = 800 * 1024 * 1024;
const MAX_PACK_TOTAL = 1024 * 1024 * 1024; // all modpack content, 1 GB
const FETCH_TIMEOUT_MS = 60_000;
const DOWNLOAD_TIMEOUT_MS = 5 * 60_000;

// Fabric/Forge-family servers load from mods/, Bukkit-family from plugins/.
// Vanilla loads neither.
const MOD_LOADERS = new Set(['fabric', 'forge', 'neoforge']);
function addonDirName(type) {
  return MOD_LOADERS.has(String(type || '').toLowerCase()) ? 'mods' : 'plugins';
}

// The .mrpack spec only allows these download hosts. Enforcing it stops a
// crafted pack from making the backend fetch internal URLs (SSRF).
const MRPACK_HOSTS = new Set(['cdn.modrinth.com', 'github.com', 'raw.githubusercontent.com', 'gitlab.com']);
function allowedPackUrl(u) {
  try {
    const url = new URL(u);
    return url.protocol === 'https:' && MRPACK_HOSTS.has(url.hostname);
  } catch { return false; }
}

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

// Fetch JSON from Modrinth with a timeout. Returns null on a non-2xx.
async function modrinthJson(pathAndQuery) {
  const r = await fetch(`${MODRINTH}${pathAndQuery}`, {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!r.ok) return null;
  return r.json();
}

// Download into memory, aborting as soon as the body passes maxBytes (instead
// of buffering a multi-GB response and checking afterwards).
async function downloadCapped(url, maxBytes) {
  const r = await fetch(url, {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
  });
  if (!r.ok || !r.body) throw new HttpError(502, `Download failed (HTTP ${r.status})`);
  const declared = parseInt(r.headers.get('content-length') || '0', 10);
  if (declared > maxBytes) { r.body.cancel().catch(() => {}); throw new HttpError(413, 'File too large'); }
  const chunks = [];
  let total = 0;
  for await (const chunk of r.body) {
    total += chunk.length;
    if (total > maxBytes) throw new HttpError(413, 'File too large');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks, total);
}

function hashMatches(buf, hashes) {
  if (hashes?.sha512) return crypto.createHash('sha512').update(buf).digest('hex') === hashes.sha512;
  if (hashes?.sha1) return crypto.createHash('sha1').update(buf).digest('hex') === hashes.sha1;
  return true; // nothing to check against
}

function ownedServer(req, res) {
  const s = db.prepare('SELECT * FROM servers WHERE id = ? AND user_id = ?')
              .get(req.params.id, req.user.id);
  if (!s) { res.status(404).json({ error: 'Server not found' }); return null; }
  return s;
}

function pluginsDir(server) {
  const dir = path.join(DATA_DIR, server.id, addonDirName(server.type));
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function sanitizeName(name) {
  return String(name).replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^\.+/, '').slice(0, 200);
}

// GET /api/servers/:id/plugins  — list installed JARs
router.get('/', async (req, res) => {
  const s = ownedServer(req, res); if (!s) return;
  const dir = pluginsDir(s);
  try {
    const items = await fsp.readdir(dir, { withFileTypes: true });
    const list = await Promise.all(items.filter(e => e.isFile()).map(async (e) => {
      const st = await fsp.stat(path.join(dir, e.name)).catch(() => null);
      return { name: e.name, size: st?.size || 0, mtime: st?.mtimeMs || 0 };
    }));
    list.sort((a, b) => b.mtime - a.mtime);
    res.json({ plugins: list, dir: addonDirName(s.type) });
  } catch { res.json({ plugins: [] }); }
});

// POST /api/servers/:id/plugins/install  { version_id }
// or { project_id } to install the latest matching version
router.post('/install', async (req, res) => {
  const s = ownedServer(req, res); if (!s) return;
  const { version_id, project_id } = req.body || {};
  if (!version_id && !project_id) return res.status(400).json({ error: 'version_id or project_id required' });
  const loader = (s.type || '').toLowerCase();
  if (loader === 'vanilla')
    return res.status(400).json({ error: 'Vanilla servers cannot load plugins or mods. Switch to Paper or Fabric first.' });

  try {
    // Resolve to a concrete version
    let version;
    if (version_id) {
      version = await modrinthJson(`/version/${encodeURIComponent(version_id)}`);
      if (!version) return res.status(502).json({ error: 'Modrinth version lookup failed' });
    } else {
      // Resolve the newest compatible version. Modrinth filters are strict — a Paper
      // server still happily loads Spigot/Bukkit plugins, and many popular plugins
      // (WorldGuard, Spark) tag themselves only as 'bukkit'. So try progressively
      // wider filters before giving up.
      const gameV  = (s.version && s.version !== 'LATEST') ? s.version : null;
      const FAMILY = {
        paper:    ['paper', 'spigot', 'bukkit'],
        spigot:   ['spigot', 'paper', 'bukkit'],
        purpur:   ['purpur', 'paper', 'spigot', 'bukkit'],
        bukkit:   ['bukkit', 'spigot', 'paper'],
        fabric:   ['fabric'],
        neoforge: ['neoforge', 'forge'],
        forge:    ['forge', 'neoforge'],
      };
      const loaderList = FAMILY[loader] || (loader ? [loader] : null);

      async function tryQuery({ loaders, version }) {
        const params = new URLSearchParams();
        if (loaders) params.set('loaders', JSON.stringify(loaders));
        if (version) params.set('game_versions', JSON.stringify([version]));
        const arr = await modrinthJson(`/project/${encodeURIComponent(project_id)}/version${params.toString() ? '?' + params : ''}`);
        return Array.isArray(arr) && arr.length ? arr[0] : null;
      }

      // Loader-strict: only fall back to a wider game-version, never to an
      // incompatible loader family. A Paper server must NEVER receive a Fabric
      // jar (it would silently install and fail to load at runtime). If the
      // project has no version for the server's loader family, return 404 so
      // the UI can surface a real error.
      version =
        await tryQuery({ loaders: loaderList, version: gameV }) ||
        await tryQuery({ loaders: loaderList, version: null  });
      if (!version) return res.status(404).json({
        error: loaderList ? `No ${loaderList[0]}-compatible version found for this project` : 'No compatible version found',
      });
    }

    const file = (version.files || []).find(f => f.primary) || version.files?.[0];
    if (!file?.url) return res.status(404).json({ error: 'No downloadable file in version' });
    if (!/\.jar$/i.test(file.filename || '')) return res.status(415).json({ error: 'This project does not ship a server JAR' });

    const buf = await downloadCapped(file.url, MAX_JAR_BYTES);
    if (!hashMatches(buf, file.hashes))
      return res.status(502).json({ error: 'Hash mismatch — refusing to install' });
    const full = await storage.checkRoom(s.id, buf.length);
    if (full) return res.status(413).json({ error: full.message });

    const name = sanitizeName(file.filename || 'plugin.jar');
    const dirName = addonDirName(s.type);
    await fsp.writeFile(path.join(pluginsDir(s), name), buf);
    storage.invalidate(s.id);

    audit(req.user.id, 'plugin.install', s.id, req.ip, { name, dir: dirName, version: version.version_number });
    res.json({ ok: true, name, dir: dirName, size: buf.length, version: version.version_number });
  } catch (err) {
    console.warn(`[plugin.install] ${project_id || version_id}: ${err.message}`);
    const status = err.status || (err.name === 'TimeoutError' ? 504 : 500);
    res.status(status).json({ error: status === 500 ? `Install failed: ${err.message || 'unknown error'}` : err.message });
  }
});

// POST /api/servers/:id/plugins/install-modpack { project_id } or { version_id }
// Downloads a Modrinth .mrpack, parses modrinth.index.json, and writes every
// referenced mod into the server's mods/ folder. Overrides folder content is
// extracted to the server root (config/, resourcepacks/, etc).
router.post('/install-modpack', async (req, res) => {
  const s = ownedServer(req, res); if (!s) return;
  const { version_id, project_id } = req.body || {};
  if (!version_id && !project_id) return res.status(400).json({ error: 'project_id required' });

  try {
    let version;
    if (version_id) {
      version = await modrinthJson(`/version/${encodeURIComponent(version_id)}`);
      if (!version) return res.status(502).json({ error: 'Modrinth version lookup failed' });
    } else {
      // For modpacks, prefer the newest version; loader/MC filtering is implicit in the modpack itself
      const list = await modrinthJson(`/project/${encodeURIComponent(project_id)}/version`);
      if (!list) return res.status(502).json({ error: 'Modrinth project lookup failed' });
      if (!Array.isArray(list) || !list.length) return res.status(404).json({ error: 'No modpack versions available' });
      version = list[0];
    }

    const packFile = (version.files || []).find(f => f.primary) || version.files?.[0];
    if (!packFile?.url) return res.status(404).json({ error: 'No primary file in modpack version' });
    // The pack's content may use at most what is left of the storage quota.
    const room = storage.limitBytes(s.id) - await storage.usedBytes(s.id);
    if (room <= 0) return res.status(413).json({ error: (await storage.checkRoom(s.id, 1))?.message || 'Storage limit reached' });
    const maxTotal = Math.min(MAX_PACK_TOTAL, room);

    const packBuf = await downloadCapped(packFile.url, MAX_PACK_BYTES);
    if (!hashMatches(packBuf, packFile.hashes))
      return res.status(502).json({ error: 'Modpack hash mismatch — refusing to install' });

    // Parse modrinth.index.json
    const AdmZip = require('adm-zip');
    let zip;
    try { zip = new AdmZip(packBuf); }
    catch { return res.status(502).json({ error: 'Modpack is not a valid .mrpack' }); }

    const indexEntry = zip.getEntry('modrinth.index.json');
    if (!indexEntry) return res.status(502).json({ error: 'modrinth.index.json missing in modpack' });
    let index;
    try { index = JSON.parse(zip.readAsText(indexEntry)); }
    catch { return res.status(502).json({ error: 'modrinth.index.json malformed' }); }

    const dir = path.join(DATA_DIR, s.id);
    fs.mkdirSync(path.join(dir, 'mods'), { recursive: true });

    // Resolve a pack-relative path to an absolute one inside the server dir,
    // or null if it would escape it.
    const inside = (rel) => {
      const dest = path.resolve(dir, String(rel || '').replace(/\\/g, '/'));
      return dest.startsWith(dir + path.sep) ? dest : null;
    };

    // Client-only files (env.server === 'unsupported': shaders, minimaps, HUD
    // mods) crash a dedicated server on boot, so they are skipped.
    const all = Array.isArray(index.files) ? index.files : [];
    const files = all.filter(f => f?.env?.server !== 'unsupported');
    let clientOnly = all.length - files.length;
    let totalBytes = 0;
    let installed = 0;
    let skipped = 0;
    let capErr = null;

    // Download with concurrency 4; each file is hash-checked against the index.
    const queue = files.slice();
    async function worker() {
      while (queue.length && !capErr) {
        const f = queue.shift();
        const dest = inside(f.path);
        const urls = (Array.isArray(f.downloads) ? f.downloads : []).filter(allowedPackUrl);
        if (!dest || !urls.length) { skipped++; continue; }
        let wrote = false;
        for (const u of urls) {
          try {
            const buf = await downloadCapped(u, MAX_JAR_BYTES);
            if (!hashMatches(buf, f.hashes)) continue;
            totalBytes += buf.length;
            if (totalBytes > maxTotal) {
              capErr = new HttpError(413, maxTotal < MAX_PACK_TOTAL
                ? 'Modpack does not fit in the server\'s remaining storage'
                : 'Modpack content exceeds 1 GB cap');
              return;
            }
            await fsp.mkdir(path.dirname(dest), { recursive: true });
            await fsp.writeFile(dest, buf);
            wrote = true;
            break;
          } catch { /* try the next mirror */ }
        }
        if (wrote) installed++; else skipped++;
      }
    }
    await Promise.all([worker(), worker(), worker(), worker()]);
    storage.invalidate(s.id);
    if (capErr) throw capErr;

    // Extract overrides/ then server-overrides/ (the spec's server-specific
    // layer, applied last so it wins) into the server root.
    let overrides = 0;
    for (const prefix of ['overrides/', 'server-overrides/']) {
      for (const e of zip.getEntries()) {
        const en = e.entryName.replace(/\\/g, '/');
        if (!en.startsWith(prefix) || e.isDirectory) continue;
        const dest = inside(en.slice(prefix.length));
        if (!dest) continue;
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, e.getData());
        overrides++;
      }
    }

    audit(req.user.id, 'plugin.install_modpack', s.id, req.ip, {
      name: index.name, version_id: version.id, installed, skipped, client_only: clientOnly, overrides
    });

    res.json({
      ok: true,
      name: index.name,
      version: index.versionId || version.version_number,
      installed,
      skipped,
      client_only: clientOnly,
      overrides,
      mc_version: index.dependencies?.minecraft || null,
      loader: Object.keys(index.dependencies || {}).find(k => k !== 'minecraft') || null,
    });
  } catch (err) {
    console.warn(`[plugin.install-modpack] ${project_id || version_id}: ${err.message}`);
    const status = err.status || (err.name === 'TimeoutError' ? 504 : 500);
    res.status(status).json({ error: err.message || 'Modpack install failed' });
  }
});

// DELETE /api/servers/:id/plugins/:name
router.delete('/:name', async (req, res) => {
  const s = ownedServer(req, res); if (!s) return;
  const name = sanitizeName(req.params.name);
  const dir = pluginsDir(s);
  const target = path.join(dir, name);
  // Confine to the server's plugins/mods dir
  if (!name || !target.startsWith(dir + path.sep)) return res.status(400).json({ error: 'Invalid name' });
  await fsp.unlink(target).catch(() => {});
  audit(req.user.id, 'plugin.remove', s.id, req.ip, { name });
  res.json({ ok: true });
});

function audit(user_id, action, resource_id, ip, metadata) {
  try {
    db.prepare('INSERT INTO audit_log (user_id, action, resource_type, resource_id, ip, metadata) VALUES (?, ?, ?, ?, ?, ?)')
      .run(user_id, action, 'plugin', resource_id, ip || null, metadata ? JSON.stringify(metadata) : null);
  } catch {}
}

module.exports = router;
