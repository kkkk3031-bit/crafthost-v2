#!/usr/bin/env node
// JAR library: an uploaded JAR must actually become the server's server.jar,
// a JAR in use cannot be deleted, a JAR missing on disk must not crash the
// backend, and the per-user quota holds. Local backend only (reads the disk):
//
//   BASE=http://localhost:4099 DATA_DIR=... JAR_DIR=... MAX_JARS_PER_USER=2 node scripts/test-custom-jar.mjs
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE || 'http://localhost:4099';
const DATA_DIR = path.resolve(process.env.DATA_DIR || 'data/servers');
const JAR_DIR = path.resolve(process.env.JAR_DIR || 'jars');
const MAX = parseInt(process.env.MAX_JARS_PER_USER || '10', 10);
const sleep = ms => new Promise(r => setTimeout(r, ms));

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
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
async function upload(name, buf) {
  const fd = new FormData();
  fd.append('jar', new Blob([buf]), name);
  return api('/api/jars', { method: 'POST', form: fd });
}

console.log(`\nCustom JAR test against ${BASE}\n`);
const sfx = crypto.randomBytes(4).toString('hex'), password = 'Pw_' + sfx + 'abcdef12';
const reg = await api('/api/auth/register', { method: 'POST', body: { username: `cj_${sfx}`, email: `cj+${sfx}@t.io`, password } });
token = reg.body?.token;
check(!!token, 'register');
let sid;
try {
  const jarBuf = crypto.randomBytes(200_000);
  const up = await upload('my-engine.jar', jarBuf);
  check(up.status === 200 && up.body.sha256 === sha(jarBuf), `upload → 200 with correct sha256 (HTTP ${up.status})`);
  const jid = up.body?.id;

  const cr = await api('/api/servers', { method: 'POST', body: { name: 'cj', type: 'paper', version: '1.21.1', plan: 'free', skipAutoStart: true, customJarPath: jid } });
  sid = cr.body?.server?.id || cr.body?.id;
  check(!!sid, `create server with the custom JAR (HTTP ${cr.status} ${cr.body?.error || ''})`);
  await api(`/api/servers/${sid}/start`, { method: 'POST' }); // the fake JAR fails to boot; placement is what counts
  const jarPath = path.join(DATA_DIR, sid, 'server.jar');
  for (let i = 0; i < 20 && !fs.existsSync(jarPath); i++) await sleep(250);
  check(fs.existsSync(jarPath) && sha(fs.readFileSync(jarPath)) === sha(jarBuf), 'server.jar is the uploaded JAR (not a Paper download)');
  await api(`/api/servers/${sid}/stop`, { method: 'POST' });

  const del = await api(`/api/jars/${jid}`, { method: 'DELETE' });
  check(del.status === 409, `delete while a server uses it → 409 (HTTP ${del.status})`);

  // Missing on disk: download must 404 and the backend must stay up.
  const up2 = await upload('gone.jar', crypto.randomBytes(1000));
  const file = fs.readdirSync(JAR_DIR).find(f => f.startsWith(up2.body.id + '__'));
  fs.unlinkSync(path.join(JAR_DIR, file));
  const dl = await api(`/api/jars/${up2.body.id}/download`);
  check(dl.status === 404, `download of a JAR missing on disk → 404 (HTTP ${dl.status})`);
  check((await api('/api/health')).status === 200, 'backend still up afterwards');

  // Quota
  const results = [];
  for (let i = 0; i < MAX; i++) results.push((await upload(`q${i}.jar`, crypto.randomBytes(1000))).status);
  check(results.includes(409), `upload past ${MAX} JARs → 409 (got ${results.join(',')})`);

  await api(`/api/servers/${sid}`, { method: 'DELETE' }); sid = null;
  const del2 = await api(`/api/jars/${jid}`, { method: 'DELETE' });
  check(del2.status === 200, `delete once unused → 200 (HTTP ${del2.status})`);
} finally {
  if (sid) await api(`/api/servers/${sid}`, { method: 'DELETE' });
  await api('/api/auth/me', { method: 'DELETE', body: { password, confirm: 'DELETE' } });
}
console.log(`\nChecks: ${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
