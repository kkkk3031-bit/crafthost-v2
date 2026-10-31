#!/usr/bin/env node
// World import: both zip layouts land in world/, junk is dropped, and every
// bad upload (not a world, not a zip, zip bomb, zip-slip) is refused BEFORE
// the live world is touched. Local backend only; run it with
// WORLD_IMPORT_MAX_MB=1 so the zip-bomb case is cheap:
//
//   BASE=... DATA_DIR=... node scripts/test-world-import.mjs
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
  const text = await r.text();
  let json; try { json = JSON.parse(text); } catch { json = null; }
  return { status: r.status, body: json };
}
let pass = 0, fail = 0;
const check = (c, m) => { console.log(`  ${c ? '\x1b[32m✓' : '\x1b[31m✗'}\x1b[0m ${m}`); c ? pass++ : fail++; };
const zipOf = (files) => { const z = new AdmZip(); for (const [n, d] of Object.entries(files)) z.addFile(n, Buffer.from(d)); return z.toBuffer(); };
async function importZip(sid, buf) {
  const fd = new FormData();
  fd.append('world', new Blob([buf]), 'world.zip');
  return api(`/api/servers/${sid}/import-world`, { method: 'POST', form: fd });
}

console.log(`\nWorld import test against ${BASE}\n`);
const sfx = crypto.randomBytes(4).toString('hex'), password = 'Pw_' + sfx + 'abcdef12';
token = (await api('/api/auth/register', { method: 'POST', body: { username: `wi_${sfx}`, email: `wi+${sfx}@t.io`, password } })).body?.token;
let sid;
try {
  const cr = await api('/api/servers', { method: 'POST', body: { name: 'wi', type: 'vanilla', version: '1.21.1', plan: 'free', skipAutoStart: true } });
  sid = cr.body?.server?.id || cr.body?.id;
  check(!!sid, 'create server');
  const root = path.join(DATA_DIR, sid);
  const level = () => fs.existsSync(path.join(root, 'world/level.dat')) ? fs.readFileSync(path.join(root, 'world/level.dat'), 'utf8') : null;
  fs.mkdirSync(path.join(root, 'world'), { recursive: true });
  fs.writeFileSync(path.join(root, 'world/level.dat'), 'ORIGINAL');

  for (const [label, buf, want] of [
    ['not a world', zipOf({ 'readme.txt': 'hi' }), 400],
    ['not a zip', Buffer.from('definitely not a zip'), 400],
    ['zip bomb (2 MB unpacked > 1 MB cap)', zipOf({ 'world/level.dat': 'x', 'world/region/r.0.0.mca': '\0'.repeat(2 << 20) }), 413],
  ]) {
    const r = await importZip(sid, buf);
    check(r.status === want, `${label} → ${want} (HTTP ${r.status} ${r.body?.error || ''})`);
    check(level() === 'ORIGINAL', `${label}: live world untouched`);
  }
  // zip-slip: a raw entry name with ../ (AdmZip keeps it as given)
  {
    const z = new AdmZip();
    z.addFile('world/level.dat', Buffer.from('SLIP'));
    z.getEntries()[0].entryName = '../../escape/level.dat';
    const r = await importZip(sid, z.toBuffer());
    check(r.status === 400, `zip-slip entry → 400 (HTTP ${r.status})`);
    check(!fs.existsSync(path.resolve(root, '../../escape')), 'nothing written outside the server');
    check(level() === 'ORIGINAL', 'zip-slip: live world untouched');
  }

  fs.mkdirSync(path.join(root, 'world_the_end'), { recursive: true });
  const w = await importZip(sid, zipOf({ 'world/level.dat': 'WRAPPED', 'world_nether/level.dat': 'N' }));
  check(w.status === 200 && w.body.restored?.world === 1, `wrapped layout → 200 (HTTP ${w.status} ${w.body?.error || ''})`);
  check(level() === 'WRAPPED' && fs.existsSync(path.join(root, 'world_nether/level.dat')), 'world + nether in place');
  check(!fs.existsSync(path.join(root, 'world_the_end')), 'old end dimension cleared');
  await api(`/api/servers/${sid}/stop`, { method: 'POST' });

  const i = await importZip(sid, zipOf({ 'My World/level.dat': 'INTERNALS', 'My World/region/r.0.0.mca': 'R', '__MACOSX/My World/._level.dat': 'junk' }));
  check(i.status === 200, `internals-under-a-folder layout → 200 (HTTP ${i.status} ${i.body?.error || ''})`);
  check(level() === 'INTERNALS' && fs.existsSync(path.join(root, 'world/region/r.0.0.mca')), 'internals wrapped into world/');
  check(!fs.existsSync(path.join(root, 'world/__MACOSX')) && !fs.readdirSync(root).some(f => f.startsWith('.import-staging')), 'no junk, no staging dir left');
  const bks = (await api(`/api/servers/${sid}/backups`)).body?.backups || [];
  check(bks.some(b => b.label === 'auto-pre-import'), 'auto-pre-import backup taken');
} finally {
  if (sid) await api(`/api/servers/${sid}`, { method: 'DELETE' });
  await api('/api/auth/me', { method: 'DELETE', body: { password, confirm: 'DELETE' } });
}
console.log(`\nChecks: ${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
