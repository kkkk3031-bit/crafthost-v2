#!/usr/bin/env node
// Per-server storage quota. Run the backend with STORAGE_GB_OVERRIDE=0.002
// (~2 MB) so the limit is cheap to hit:
//   BASE=... DATA_DIR=... node scripts/test-storage-quota.mjs
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const AdmZip = require('adm-zip');
const BASE = process.env.BASE || 'http://localhost:4099';
const DATA_DIR = path.resolve(process.env.DATA_DIR || 'data/servers');
let token = '';
async function api(p, { method = 'GET', body, form } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const r = await fetch(BASE + p, { method, headers, body: form || (body === undefined ? undefined : JSON.stringify(body)) });
  let json = null; try { json = await r.json(); } catch {}
  return { status: r.status, body: json };
}
let pass = 0, fail = 0;
const check = (c, m) => { console.log(`  ${c ? '\x1b[32m✓' : '\x1b[31m✗'}\x1b[0m ${m}`); c ? pass++ : fail++; };
const upload = (sid, name, bytes) => { const fd = new FormData(); fd.append('files', new Blob([crypto.randomBytes(bytes)]), name); return api(`/api/servers/${sid}/files/upload?path=/`, { method: 'POST', form: fd }); };

console.log(`\nStorage quota test against ${BASE}\n`);
const sfx = crypto.randomBytes(4).toString('hex'), password = 'Pw_' + sfx + 'abcdef12';
token = (await api('/api/auth/register', { method: 'POST', body: { username: `sq_${sfx}`, email: `sq+${sfx}@t.io`, password } })).body?.token;
let sid;
try {
  sid = (await api('/api/servers', { method: 'POST', body: { name: 'sq', type: 'paper', version: '1.21.1', plan: 'free', skipAutoStart: true } })).body?.server?.id;
  check(!!sid, 'create server');
  const root = path.join(DATA_DIR, sid);
  const w = await api(`/api/servers/${sid}/files/write`, { method: 'PUT', body: { path: '/notes.txt', content: 'hello' } });
  check(w.status === 200, `small write fits (HTTP ${w.status})`);
  const big = await upload(sid, 'big.bin', 3 << 20);
  check(big.status === 413 && /Storage limit/.test(big.body?.error || ''), `3 MB upload refused (HTTP ${big.status} ${big.body?.error || ''})`);
  check(!fs.existsSync(path.join(root, 'big.bin')), 'nothing written for the refused upload');
  const small = await upload(sid, 'small.bin', 500 << 10);
  check(small.status === 200, `500 KB upload fits (HTTP ${small.status} ${small.body?.error || ''})`);
  const z = new AdmZip(); z.addFile('world/level.dat', Buffer.from('x')); z.addFile('world/region/r.0.0.mca', crypto.randomBytes(3 << 20));
  const fd = new FormData(); fd.append('world', new Blob([z.toBuffer()]), 'w.zip');
  const imp = await api(`/api/servers/${sid}/import-world`, { method: 'POST', form: fd });
  check(imp.status === 413, `world that does not fit refused (HTTP ${imp.status} ${imp.body?.error || ''})`);
  // Fill up to the limit, then even a small write is refused (cache expires
  // on every write, so the next check sees the new usage).
  await upload(sid, 'fill.bin', 1500 << 10);
  const w2 = await api(`/api/servers/${sid}/files/write`, { method: 'PUT', body: { path: '/more.txt', content: 'x'.repeat(200 << 10) } });
  check(w2.status === 413, `write past the limit refused (HTTP ${w2.status})`);
} finally {
  if (sid) await api(`/api/servers/${sid}`, { method: 'DELETE' });
  await api('/api/auth/me', { method: 'DELETE', body: { password, confirm: 'DELETE' } });
}
console.log(`\nChecks: ${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
