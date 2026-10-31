// World import (.zip upload → world/, world_nether/, world_the_end/).
//
// Everything that can fail runs before the live world is touched: the zip's
// central directory is inspected (layout + unpacked size, which yauzl
// verifies against the real data), then the world is stream-extracted into a
// staging dir. Only after that does the caller stop the server and swap the
// staged dirs in, so a bad or oversized zip never leaves a half-written world
// or a stopped server behind.

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { pipeline } = require('stream/promises');
const { eachEntry } = require('./backup');

const DIMS = ['world', 'world_nether', 'world_the_end'];
// Unpacked-size cap: a 500 MB zip bomb could otherwise fill the shared disk.
const MAX_UNPACKED_BYTES = parseInt(process.env.WORLD_IMPORT_MAX_MB || '4096', 10) * 1024 * 1024;

class ImportError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

const norm = (n) => n.replace(/\\/g, '/').replace(/^\/+/, '');
// macOS archive junk and the lock of a running server are never world data.
const junk = (n) => n.startsWith('__MACOSX/') || /(^|\/)\.DS_Store$/.test(n) || /(^|\/)session\.lock$/.test(n);

// Read the central directory and map each file entry to its destination
// (relative to the server root). Throws ImportError on a non-world zip.
async function plan(zipPath) {
  const files = [];
  try {
    await eachEntry(zipPath, (e) => {
      const name = norm(e.fileName);
      if (!name.endsWith('/') && !junk(name)) files.push({ name, size: e.uncompressedSize });
    });
  } catch (err) {
    throw new ImportError(400, `Not a valid zip: ${err.message}`);
  }
  if (!files.length) throw new ImportError(400, 'Empty zip');

  const map = new Map(); // zip name -> dest relative to root
  const restored = {};
  // Layout 1: top-level world/, world_nether/, world_the_end/ dirs.
  const wrapped = files.filter((f) => DIMS.includes(f.name.split('/')[0]));
  if (wrapped.length) {
    for (const f of wrapped) {
      map.set(f.name, f.name);
      const top = f.name.split('/')[0];
      restored[top] = (restored[top] || 0) + 1;
    }
  } else {
    // Layout 2: world internals (level.dat, region/ ...) at the root or under
    // one folder; wrapped into world/. The shallowest level.dat wins.
    const level = files
      .filter((f) => /(^|\/)level\.dat$/.test(f.name))
      .sort((a, b) => a.name.split('/').length - b.name.split('/').length)[0];
    if (!level)
      throw new ImportError(400,
        'Zip does not look like a Minecraft world (no level.dat found; expected world/level.dat or level.dat at root)');
    const prefix = level.name.slice(0, -'level.dat'.length);
    for (const f of files) {
      if (!f.name.startsWith(prefix) || f.name === prefix) continue;
      map.set(f.name, `world/${f.name.slice(prefix.length)}`);
    }
    restored.world = map.size;
  }

  const unpacked = files.filter((f) => map.has(f.name)).reduce((a, f) => a + f.size, 0);
  if (unpacked > MAX_UNPACKED_BYTES)
    throw new ImportError(413, `World is too large when unpacked (${Math.round(unpacked / 1048576)} MB, limit ${Math.round(MAX_UNPACKED_BYTES / 1048576)} MB)`);
  return { map, restored, unpacked };
}

// Stream the planned entries into stagingDir. yauzl verifies every entry's
// real size against the directory, so the size check in plan() holds.
async function extract(zipPath, map, stagingDir) {
  const base = path.resolve(stagingDir);
  await eachEntry(zipPath, (entry, zip) => {
    const rel = map.get(norm(entry.fileName));
    if (!rel) return;
    const dest = path.resolve(base, rel);
    if (!dest.startsWith(base + path.sep)) throw new ImportError(400, `Unsafe path in archive: ${entry.fileName}`);
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
}

// Replace the server's world dirs with the staged ones. All three dims are
// cleared: an imported overworld must not keep the old world's nether.
async function swapIn(root, stagingDir) {
  for (const d of DIMS) {
    await fsp.rm(path.join(root, d), { recursive: true, force: true });
    const staged = path.join(stagingDir, d);
    if (fs.existsSync(staged)) await fsp.rename(staged, path.join(root, d));
  }
}

module.exports = { plan, extract, swapIn, ImportError, MAX_UNPACKED_BYTES, DIMS };
