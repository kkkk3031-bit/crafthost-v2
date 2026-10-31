// Per-server disk quota: the plan's storage_gb, enforced at every place a
// user can add data (file upload/write, plugin and modpack installs, world
// import). Without it one account could fill the disk every server shares.
//
// Usage is measured by an async walk (symlinks skipped) and cached briefly,
// so checks on a busy upload path don't re-walk a multi-GB world each time.
const fsp = require("fs/promises");
const path = require("path");
const db = require("../db");
const { DATA_DIR } = require("./paths");

const CACHE_MS = 30_000;
const cache = new Map(); // serverId -> { at, bytes }

async function dirBytes(p) {
  let total = 0;
  let entries;
  try { entries = await fsp.readdir(p, { withFileTypes: true }); } catch { return 0; }
  for (const e of entries) {
    const full = path.join(p, e.name);
    if (e.isDirectory()) total += await dirBytes(full);
    else if (e.isFile()) total += await fsp.stat(full).then((st) => st.size, () => 0);
  }
  return total;
}

async function usedBytes(serverId, { exclude = [] } = {}) {
  const root = path.join(DATA_DIR, serverId);
  if (exclude.length) {
    // Uncached: callers excluding dirs need an exact figure.
    let total = await dirBytes(root);
    for (const d of exclude) total -= await dirBytes(path.join(root, d));
    return Math.max(0, total);
  }
  const hit = cache.get(serverId);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.bytes;
  const bytes = await dirBytes(root);
  cache.set(serverId, { at: Date.now(), bytes });
  return bytes;
}

function limitBytes(serverId) {
  const row = db.prepare(
    "SELECT p.storage_gb FROM servers s JOIN plans p ON s.plan_id = p.id WHERE s.id = ?",
  ).get(serverId);
  const gb = Number(process.env.STORAGE_GB_OVERRIDE || row?.storage_gb || 0);
  return gb > 0 ? gb * 1024 ** 3 : Infinity;
}

const fmt = (b) => (b < 1024 ** 3 ? `${Math.round(b / 1024 ** 2)} MB` : `${(b / 1024 ** 3).toFixed(1)} GB`);

// null when `incoming` more bytes fit, otherwise an Error with status 413.
async function checkRoom(serverId, incoming = 0, opts) {
  const limit = limitBytes(serverId);
  if (limit === Infinity) return null;
  const used = await usedBytes(serverId, opts);
  if (used + Math.max(0, incoming) <= limit) return null;
  const err = new Error(`Storage limit reached: ${fmt(used)} used of ${fmt(limit)}. Delete files or old worlds to make room.`);
  err.status = 413;
  return err;
}

// Writes change usage: drop the cached figure.
function invalidate(serverId) { cache.delete(serverId); }

module.exports = { checkRoom, usedBytes, limitBytes, invalidate };
