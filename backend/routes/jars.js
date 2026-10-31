// Per-user JAR library — upload custom server JARs once, reference from any server.

const express = require('express');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const crypto = require('crypto');
const multer = require('multer');
const db = require('../db');
const { authMiddleware } = require('../lib/auth');
const uploadErrors = require('../lib/upload-errors');

const router = express.Router();
router.use(authMiddleware);

const JAR_DIR = process.env.JAR_DIR || path.resolve(__dirname, '../../jars');
fs.mkdirSync(JAR_DIR, { recursive: true });

const MAX_JAR_BYTES = 500 * 1024 * 1024; // 500 MB
// Per-user library caps, so one account cannot fill the disk.
const MAX_JARS_PER_USER = parseInt(process.env.MAX_JARS_PER_USER || '10', 10);
const MAX_LIBRARY_BYTES = parseInt(process.env.MAX_JAR_LIBRARY_MB || '1024', 10) * 1024 * 1024;

function libraryUsage(userId) {
  return db.prepare('SELECT COUNT(*) AS n, COALESCE(SUM(size), 0) AS bytes FROM jars WHERE user_id = ?').get(userId);
}

async function sha256File(p) {
  const h = crypto.createHash('sha256');
  for await (const chunk of fs.createReadStream(p)) h.update(chunk);
  return h.digest('hex');
}

function sanitize(name) {
  return String(name).replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^\.+/, '').slice(0, 200);
}

// GET /api/jars — list current user's library
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT id, filename, size, sha256, created_at FROM jars WHERE user_id = ? ORDER BY created_at DESC')
                  .all(req.user.id);
  res.json({ jars: rows });
});

// POST /api/jars — multipart upload, field "jar"
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, JAR_DIR),
    filename: (req, file, cb) => {
      const id = crypto.randomBytes(8).toString('hex');
      cb(null, `${id}__${sanitize(file.originalname)}`);
    },
  }),
  limits: { fileSize: MAX_JAR_BYTES, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!/\.jar$/i.test(file.originalname)) return cb(new Error('Only .jar files allowed'));
    cb(null, true);
  },
});

// Refuse before the body is streamed to disk when the library is already full.
function checkQuota(req, res, next) {
  const u = libraryUsage(req.user.id);
  if (u.n >= MAX_JARS_PER_USER)
    return res.status(409).json({ error: `JAR library is full (${MAX_JARS_PER_USER} JARs). Delete one first.` });
  if (u.bytes >= MAX_LIBRARY_BYTES)
    return res.status(409).json({ error: 'JAR library storage is full. Delete a JAR first.' });
  next();
}

router.post('/', checkQuota, upload.single('jar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    // The size is only known after the upload: re-check the byte cap.
    if (libraryUsage(req.user.id).bytes + req.file.size > MAX_LIBRARY_BYTES) {
      fsp.unlink(req.file.path).catch(() => {});
      return res.status(409).json({ error: `JAR library storage is full (${Math.round(MAX_LIBRARY_BYTES / 1048576)} MB). Delete a JAR first.` });
    }
    const sha256 = await sha256File(req.file.path);
    const id = path.basename(req.file.filename).split('__')[0];
    db.prepare('INSERT INTO jars (id, user_id, filename, size, sha256, storage_path) VALUES (?, ?, ?, ?, ?, ?)')
      .run(id, req.user.id, req.file.originalname, req.file.size, sha256, req.file.path);
    audit(req.user.id, 'jar.upload', id, req.ip, { filename: req.file.originalname, size: req.file.size });
    res.json({ ok: true, id, filename: req.file.originalname, size: req.file.size, sha256 });
  } catch (err) {
    // Best-effort cleanup if DB insert fails
    console.warn(`[jars] upload failed: ${err.message}`);
    fsp.unlink(req.file.path).catch(() => {});
    res.status(500).json({ error: 'JAR upload failed' });
  }
});

// DELETE /api/jars/:id
router.delete('/:id', async (req, res) => {
  const row = db.prepare('SELECT * FROM jars WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  // Servers that boot from this JAR would stop working.
  const users = db.prepare('SELECT name FROM servers WHERE custom_jar_path = ? AND user_id = ?').all(row.id, req.user.id);
  if (users.length)
    return res.status(409).json({ error: `In use by: ${users.map(u => u.name).join(', ')}. Switch their engine first.` });
  await fsp.unlink(row.storage_path).catch(() => {});
  db.prepare('DELETE FROM jars WHERE id = ?').run(row.id);
  audit(req.user.id, 'jar.delete', row.id, req.ip);
  res.json({ ok: true });
});

// GET /api/jars/:id/download
router.get('/:id/download', (req, res) => {
  const row = db.prepare('SELECT * FROM jars WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  // Without an 'error' handler a JAR missing on disk would crash the backend.
  const rs = fs.createReadStream(row.storage_path);
  rs.once('error', (err) => {
    console.warn(`[jars] download ${row.id}: ${err.message}`);
    if (!res.headersSent) res.status(404).json({ error: 'JAR file missing on server' }); else res.destroy();
  });
  rs.once('open', () => {
    res.attachment(sanitize(row.filename));
    res.setHeader('Content-Length', row.size);
    rs.pipe(res);
  });
});

function audit(user_id, action, resource_id, ip, metadata) {
  try {
    db.prepare('INSERT INTO audit_log (user_id, action, resource_type, resource_id, ip, metadata) VALUES (?, ?, ?, ?, ?, ?)')
      .run(user_id, action, 'jar', resource_id, ip || null, metadata ? JSON.stringify(metadata) : null);
  } catch {}
}

// Shared upload error handler (413 for oversized, 400 otherwise)
router.use(uploadErrors({ catchAll: true }));

module.exports = router;
