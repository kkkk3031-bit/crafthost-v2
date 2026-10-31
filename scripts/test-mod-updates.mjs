#!/usr/bin/env node
// Plugin / mod updates: an old Modrinth build is detected by its hash and
// replaced with the newest build for the server's loader and Minecraft
// version; a hand-made JAR is left alone; a version change re-targets the
// check; vanilla is refused. Hits the real Modrinth API (small JARs), so it
// runs only with NETWORK=1. Needs an isolated backend (DATABASE_PATH is read
// to simulate a version change without booting a JVM):
//
//   MAX_SERVERS_PER_USER=5 scripts/run-isolated.sh node scripts/test-mod-updates.mjs

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const BASE = process.env.BASE || 'http://localhost:4099';
const DATA_DIR = path.resolve(process.env.DATA_DIR || 'data/servers');
const DATABASE_PATH = process.env.DATABASE_PATH;

// Chunky builds pinned for the test: old → expected newest per target.
const PAPER_OLD = 'B0xkCkk4';   // Chunky 1.3.92 (paper, 1.20.1)
const FABRIC_OLD = 'dPliWter';  // Chunky 1.4.16 (fabric, 1.21.1)

let token = '';
async function api(p, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const r = await fetch(BASE + p, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  const text = await r.text();
  let json; try { json = JSON.parse(text); } catch { json = null; }
  return { status: r.status, body: json, text };
}
const G = s => `\x1b[32m${s}\x1b[0m`, R = s => `\x1b[31m${s}\x1b[0m`;
let pass = 0, fail = 0;
function check(cond, msg) {
  if (cond) { console.log(`  ${G('✓')} ${msg}`); pass++; }
  else      { console.log(`  ${R('✗')} ${msg}`); fail++; }
}
const jars = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.jar')).sort() : []);

console.log(`\nPlugin/mod update test against ${BASE}\n`);
const suffix = crypto.randomBytes(4).toString('hex');
const reg = await api('/api/auth/register', {
  method: 'POST', body: { username: `mu_${suffix}`, email: `mu+${suffix}@test.io`, password: 'Pw_' + crypto.randomBytes(8).toString('hex') },
});
token = reg.body?.token;
check(!!token, 'register');
if (!token) process.exit(1);

const created = [];
async function make(type, version) {
  const r = await api('/api/servers', { method: 'POST', body: { name: `mu-${type}`, type, version, plan: 'free', skipAutoStart: true } });
  const id = r.body?.server?.id || r.body?.id;
  check(!!id, `create ${type} ${version} server (HTTP ${r.status} ${r.body?.error || ''})`);
  if (id) created.push(id);
  return id;
}

try {
  // ── Paper 1.20.1: old Chunky + a hand-made JAR ──────────────────────────
  const paper = await make('paper', '1.20.1');
  const pdir = path.join(DATA_DIR, paper, 'plugins');
  const inst = await api(`/api/servers/${paper}/plugins/install`, { method: 'POST', body: { version_id: PAPER_OLD } });
  check(inst.status === 200 && inst.body?.version === '1.3.92', `install old Chunky 1.3.92 (HTTP ${inst.status} ${inst.body?.version || inst.body?.error || ''})`);
  fs.writeFileSync(path.join(pdir, 'MyCustomPlugin.jar'), crypto.randomBytes(2048));

  const u1 = await api(`/api/servers/${paper}/plugins/updates`);
  const chunky = u1.body?.items?.find(i => /chunky/i.test(i.name));
  const custom = u1.body?.items?.find(i => i.name === 'MyCustomPlugin.jar');
  check(u1.status === 200 && u1.body?.updates === 1, `updates: exactly 1 available (HTTP ${u1.status}, got ${u1.body?.updates})`);
  check(chunky?.status === 'update' && chunky.current?.version_number === '1.3.92', `Chunky detected by hash as 1.3.92 → ${chunky?.latest?.version_number}`);
  check(custom?.status === 'unknown', `hand-made JAR is "unknown" (got ${custom?.status})`);
  check(!JSON.stringify(u1.body).includes('"_file"') && !JSON.stringify(u1.body).includes('cdn.modrinth.com'), 'response does not leak internal download data');
  const target120 = chunky?.latest?.version_number;

  const up = await api(`/api/servers/${paper}/plugins/update`, { method: 'POST', body: {} });
  check(up.status === 200 && up.body?.updated?.length === 1 && !up.body?.failed?.length, `update all → 1 updated, 0 failed (HTTP ${up.status} ${up.body?.error || ''})`);
  check(up.body?.restart_required === false, 'offline server: no restart required');
  const after = jars(pdir);
  check(after.includes(`Chunky-${target120}.jar`) && !after.includes('Chunky-1.3.92.jar'), `old JAR replaced by new (${after.join(', ')})`);
  check(after.includes('MyCustomPlugin.jar'), 'hand-made JAR untouched');
  check(!fs.readdirSync(pdir).some(f => f.endsWith('.tmp')), 'no temp files left behind');

  const u2 = await api(`/api/servers/${paper}/plugins/updates`);
  check(u2.body?.updates === 0 && u2.body?.items?.find(i => /chunky/i.test(i.name))?.status === 'current', 'second check: Chunky is current');

  // ── Version change re-targets the check (simulated: no JVM boot) ────────
  if (DATABASE_PATH) {
    const require = createRequire(import.meta.url);
    const Database = require('better-sqlite3');
    const db = new Database(DATABASE_PATH);
    db.prepare('UPDATE servers SET version = ? WHERE id = ?').run('1.21.1', paper);
    db.close();
    const u3 = await api(`/api/servers/${paper}/plugins/updates`);
    const c3 = u3.body?.items?.find(i => /chunky/i.test(i.name));
    check(u3.body?.mc_version === '1.21.1', `check targets the new version (${u3.body?.mc_version})`);
    check(c3?.status === 'update' && c3.latest?.version_number !== target120, `after 1.20.1 → 1.21.1: newer Chunky offered (${c3?.status} ${c3?.latest?.version_number || ''})`);
    const named = await api(`/api/servers/${paper}/plugins/update`, { method: 'POST', body: { names: ['MyCustomPlugin.jar'] } });
    check(named.status === 200 && named.body?.updated?.length === 0, 'update limited by names: only the listed files are touched');
  } else {
    console.log('  ~ DATABASE_PATH not set — version-change check skipped');
  }

  // ── Fabric: mods/ ───────────────────────────────────────────────────────
  const fabric = await make('fabric', '1.21.1');
  const fi = await api(`/api/servers/${fabric}/plugins/install`, { method: 'POST', body: { version_id: FABRIC_OLD } });
  check(fi.status === 200 && fi.body?.dir === 'mods', `fabric: old Chunky into mods/ (HTTP ${fi.status} ${fi.body?.version || fi.body?.error || ''})`);
  const fu = await api(`/api/servers/${fabric}/plugins/updates`);
  check(fu.body?.dir === 'mods' && fu.body?.updates === 1, `fabric: 1 update found in mods/ (got ${fu.body?.updates})`);
  const fup = await api(`/api/servers/${fabric}/plugins/update`, { method: 'POST', body: {} });
  const fjars = jars(path.join(DATA_DIR, fabric, 'mods'));
  check(fup.body?.updated?.length === 1 && fjars.length === 1 && !fjars.includes('Chunky-1.4.16.jar'), `fabric: mod replaced (${fjars.join(', ')})`);
  check(!fs.existsSync(path.join(DATA_DIR, fabric, 'plugins')) || jars(path.join(DATA_DIR, fabric, 'plugins')).length === 0, 'fabric: nothing written to plugins/');

  // ── Vanilla, auth, ownership ────────────────────────────────────────────
  const vanilla = await make('vanilla', '1.21.1');
  const vu = await api(`/api/servers/${vanilla}/plugins/updates`);
  check(vu.status === 200 && vu.body?.updates === 0, 'vanilla: update check is empty');
  const vp = await api(`/api/servers/${vanilla}/plugins/update`, { method: 'POST', body: {} });
  check(vp.status === 400, `vanilla: update refused (HTTP ${vp.status})`);
  const bad = await api(`/api/servers/${paper}/plugins/update`, { method: 'POST', body: { names: 'x' } });
  check(bad.status === 400, `names must be a list (HTTP ${bad.status})`);
  const saved = token; token = '';
  const anon = await api(`/api/servers/${paper}/plugins/updates`);
  check(anon.status === 401, `no token → 401 (HTTP ${anon.status})`);
  token = saved;
  const other = await api('/api/servers/0000000000000000/plugins/updates');
  check(other.status === 404, `someone else's / missing server → 404 (HTTP ${other.status})`);
} finally {
  for (const id of created) await api(`/api/servers/${id}`, { method: 'DELETE' });
}

console.log(`\nChecks: ${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
