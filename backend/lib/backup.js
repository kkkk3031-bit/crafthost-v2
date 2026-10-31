// World backup engine. Snapshots the playable parts of a server (world dirs,
// plugin/mod data and configs, server.properties, ops/whitelist/bans) into a
// single .zip under /data/backups/<server_id>/<id>.zip.
//
// Both directions stream (yazl / yauzl): a multi-GB world never sits in
// memory and the event loop keeps serving every other user while it zips.

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const { pipeline } = require('stream/promises');
const yazl = require('yazl');
const yauzl = require('yauzl');

const DATA_DIR = require("./paths").DATA_DIR;
const BACKUP_DIR = process.env.BACKUP_DIR || path.resolve(__dirname, '../../data/backups');

fs.mkdirSync(BACKUP_DIR, { recursive: true });

// What to include in a snapshot, relative to the server's data dir.
// plugins/ mods/ config/ hold player data too (LuckPerms ranks, EssentialsX
// homes, claims), so they are part of the snapshot.
const SNAPSHOT_TARGETS = [
  'world', 'world_nether', 'world_the_end',
  'plugins', 'mods', 'config',
  'server.properties', 'ops.json', 'whitelist.json',
  'banned-players.json', 'banned-ips.json',
];

// Already-compressed formats: deflating them again costs CPU for ~0% gain.
// (.mca region files are zlib-compressed chunks.)
const STORE_EXT = new Set(['.mca', '.jar', '.zip', '.gz', '.png', '.jpg', '.ogg', '.mrpack']);

function backupDirFor(serverId) {
  const d = path.join(BACKUP_DIR, serverId);
  fs.mkdirSync(d, { recursive: true });
  return d;
}

function listBackups(serverId) {
  const d = backupDirFor(serverId);
  const entries = fs.readdirSync(d, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    if (!e.isFile() || !e.name.endsWith('.zip')) continue;
    const full = path.join(d, e.name);
    let st;
    try { st = fs.statSync(full); } catch { continue; } // deleted meanwhile
    const id = e.name.replace(/\.zip$/, '');
    // Optional label is encoded in the filename after "__" (e.g.
    // "2026-07-03T10-00-00_ab12__auto-pre-downgrade.zip").
    const label = id.includes('__') ? id.split('__').slice(1).join('__') : null;
    out.push({
      id,
      filename: e.name,
      size: st.size,
      created_at: st.mtimeMs,
      label,
      auto: !!(label && label.startsWith('auto-')),
    });
  }
  out.sort((a, b) => b.created_at - a.created_at);
  return out;
}

// Regular files under abs (recursively), as [absPath, zipPath]. Symlinks are
// skipped: following one could pull files from outside the server into a
// backup the user can download.
async function collectFiles(abs, rel, out) {
  let st;
  try { st = await fsp.lstat(abs); } catch { return; }
  if (st.isSymbolicLink()) return;
  if (st.isFile()) { out.push([abs, rel]); return; }
  if (!st.isDirectory()) return;
  const entries = await fsp.readdir(abs, { withFileTypes: true }).catch(() => []);
  for (const e of entries) {
    if (e.name === 'session.lock') continue; // held by a running JVM, useless in a restore
    await collectFiles(path.join(abs, e.name), `${rel}/${e.name}`, out);
  }
}

async function createBackup(serverId, ctx = {}) {
  const srcDir = path.join(DATA_DIR, serverId);
  if (!fs.existsSync(srcDir)) throw new Error('Server data dir missing');

  const files = [];
  for (const rel of SNAPSHOT_TARGETS) await collectFiles(path.join(srcDir, rel), rel, files);

  const safeLabel = ctx.label
    ? String(ctx.label).toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 40)
    : '';
  const id =
    `${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}_${crypto.randomBytes(3).toString('hex')}` +
    (safeLabel ? `__${safeLabel}` : '');
  const dest = path.join(backupDirFor(serverId), `${id}.zip`);
  // Written under a name listBackups ignores, renamed when complete: a crash
  // mid-backup never leaves a truncated zip that looks restorable.
  const tmp = `${dest}.partial`;

  const zip = new yazl.ZipFile();
  for (const [abs, rel] of files) {
    zip.addFile(abs, rel, { compress: !STORE_EXT.has(path.extname(rel).toLowerCase()) });
  }
  // Empty server case: still write a marker file
  if (!files.length) zip.addBuffer(Buffer.from('Server had no world data at backup time.\n'), 'EMPTY.txt');
  zip.end();
  try {
    // A file vanishing mid-backup surfaces as an 'error' on the zip itself.
    await Promise.race([
      pipeline(zip.outputStream, fs.createWriteStream(tmp)),
      new Promise((_, reject) => zip.once('error', reject)),
    ]);
    await fsp.rename(tmp, dest);
  } catch (err) {
    await fsp.rm(tmp, { force: true }).catch(() => {});
    throw err;
  }
  const st = fs.statSync(dest);

  // Enforce retention (oldest-first delete). ctx.protect names a backup id
  // that must survive eviction — the pre-restore safety snapshot would
  // otherwise be able to evict the very backup that is about to be restored.
  if (ctx.retention && ctx.retention > 0) {
    const all = listBackups(serverId);
    if (all.length > ctx.retention) {
      const toDelete = all
        .slice(ctx.retention)
        .filter((b) => !ctx.protect || b.id !== ctx.protect);
      for (const b of toDelete) {
        try { fs.unlinkSync(path.join(backupDirFor(serverId), b.filename)); } catch {}
      }
    }
  }

  return {
    id,
    filename: path.basename(dest),
    size: st.size,
    created_at: st.mtimeMs,
    label: safeLabel || null,
  };
}

function openZip(p) {
  return new Promise((resolve, reject) =>
    yauzl.open(p, { lazyEntries: true, autoClose: true }, (err, z) => (err ? reject(err) : resolve(z))));
}

// Walk every entry; onEntry(entry, zip) may return a promise.
async function eachEntry(p, onEntry) {
  const zip = await openZip(p);
  await new Promise((resolve, reject) => {
    zip.on('error', reject);
    zip.on('end', resolve);
    zip.on('entry', (entry) => {
      Promise.resolve(onEntry(entry, zip)).then(() => zip.readEntry(), (err) => { zip.close(); reject(err); });
    });
    zip.readEntry();
  });
}

const topLevel = (name) => name.replace(/\\/g, '/').split('/')[0];

async function restoreBackup(serverId, backupId) {
  const zipPath = path.join(backupDirFor(serverId), `${backupId}.zip`);
  if (!fs.existsSync(zipPath)) throw new Error('Backup not found');

  const srcDir = path.join(DATA_DIR, serverId);
  fs.mkdirSync(srcDir, { recursive: true });

  // Only targets the backup actually contains are replaced. Older backups
  // have no plugins/ — restoring one must not wipe the current plugins.
  const present = new Set();
  await eachEntry(zipPath, (e) => {
    const top = topLevel(e.fileName);
    if (SNAPSHOT_TARGETS.includes(top)) present.add(top);
    // A snapshot of a server with no world: restoring it resets the world.
    if (e.fileName === 'EMPTY.txt') ['world', 'world_nether', 'world_the_end'].forEach((w) => present.add(w));
  });

  // Move current copies aside first (so a failed unzip doesn't half-corrupt state)
  const trash = path.join(srcDir, `.restore-trash-${Date.now()}`);
  fs.mkdirSync(trash, { recursive: true });
  for (const rel of present) {
    const cur = path.join(srcDir, rel);
    if (fs.existsSync(cur)) {
      try { fs.renameSync(cur, path.join(trash, rel)); } catch {}
    }
  }

  try {
    await eachEntry(zipPath, (entry, zip) => {
      const name = entry.fileName.replace(/\\/g, '/');
      if (!present.has(topLevel(name))) return; // only snapshot targets, nothing else
      const dest = path.resolve(srcDir, name);
      if (!dest.startsWith(srcDir + path.sep)) return;
      if (name.endsWith('/')) return fsp.mkdir(dest, { recursive: true });
      return new Promise((resolve, reject) => {
        zip.openReadStream(entry, async (err, rs) => {
          if (err) return reject(err);
          try {
            await fsp.mkdir(path.dirname(dest), { recursive: true });
            await pipeline(rs, fs.createWriteStream(dest));
            resolve();
          } catch (e) { reject(e); }
        });
      });
    });
  } catch (err) {
    // Roll back from trash
    for (const rel of present) {
      const dst = path.join(srcDir, rel);
      try { fs.rmSync(dst, { recursive: true, force: true }); } catch {}
      const t = path.join(trash, rel);
      if (fs.existsSync(t)) {
        try { fs.renameSync(t, dst); } catch {}
      }
    }
    try { fs.rmSync(trash, { recursive: true, force: true }); } catch {}
    throw err;
  }

  // Restore succeeded — wipe the trash
  try { fs.rmSync(trash, { recursive: true, force: true }); } catch {}
  return { ok: true };
}

// Remove every backup for a server (called when the server itself is deleted,
// and by the orphan janitor). Best-effort.
async function deleteAllBackups(serverId) {
  const d = path.join(BACKUP_DIR, serverId);
  try { fs.rmSync(d, { recursive: true, force: true }); } catch {}
  return { ok: true };
}

async function deleteBackup(serverId, backupId) {
  const p = path.join(backupDirFor(serverId), `${backupId}.zip`);
  if (!fs.existsSync(p)) throw new Error('Backup not found');
  fs.unlinkSync(p);
  return { ok: true };
}

function pathForDownload(serverId, backupId) {
  const p = path.join(backupDirFor(serverId), `${backupId}.zip`);
  if (!fs.existsSync(p)) return null;
  return p;
}

function totalBackupBytes(serverId) {
  return listBackups(serverId).reduce((a, b) => a + b.size, 0);
}

module.exports = {
  BACKUP_DIR,
  listBackups,
  createBackup,
  deleteAllBackups,
  restoreBackup,
  deleteBackup,
  pathForDownload,
  totalBackupBytes,
  SNAPSHOT_TARGETS,
};
