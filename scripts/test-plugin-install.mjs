#!/usr/bin/env node
// Plugin / mod install: each engine gets its add-ons in the folder it loads
// from (Paper → plugins/, Fabric → mods/), vanilla is refused, and the
// Modrinth proxy clamps its inputs. Hits the real Modrinth API (small JARs),
// so it is not part of `npm test`. Run against an isolated local backend
// with MAX_SERVERS_PER_USER=5 (it creates four servers):
//
//   BASE=http://localhost:4099 DATA_DIR=<its DATA_DIR> node scripts/test-plugin-install.mjs

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE || 'http://localhost:4099';
const DATA_DIR = path.resolve(process.env.DATA_DIR || 'data/servers');

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
const jars = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.jar')) : []);

console.log(`\nPlugin install test against ${BASE}\n`);
const suffix = crypto.randomBytes(4).toString('hex');
const password = 'Pw_' + crypto.randomBytes(8).toString('hex');
const reg = await api('/api/auth/register', {
  method: 'POST', body: { username: `pi_${suffix}`, email: `pi+${suffix}@test.io`, password },
});
token = reg.body?.token;
check(!!token, 'register');
if (!token) process.exit(1);

const created = [];
async function make(type, version) {
  const r = await api('/api/servers', { method: 'POST', body: { name: `pi-${type}`, type, version, plan: 'free', skipAutoStart: true } });
  const id = r.body?.server?.id || r.body?.id;
  check(!!id, `create ${type} ${version} server (HTTP ${r.status} ${r.body?.error || ""})`);
  if (id) created.push(id);
  return id;
}

try {
  // Proxy input handling
  const s1 = await api('/api/modrinth/search?limit=999&offset=-3');
  check(s1.status === 200 && s1.body?.limit === 50 && s1.body?.offset === 0, `search clamps limit/offset (got ${s1.body?.limit}/${s1.body?.offset})`);
  const s2 = await api('/api/modrinth/project/..%2F..%2Fuser%2Fx');
  check(s2.status === 400, `project id with a path is refused (HTTP ${s2.status})`);
  const s3 = await api('/api/modrinth/search?q=chunky&limit=5&loader=fabric');
  check((s3.body?.hits || []).every(h => h.categories.includes('fabric')), 'loader=fabric returns only fabric projects');

  const paper = await make('paper', '1.21.1');
  const fabric = await make('fabric', '1.21.1');

  if (paper) {
    const r = await api(`/api/servers/${paper}/plugins/install`, { method: 'POST', body: { project_id: 'chunky' } });
    check(r.status === 200 && r.body?.dir === 'plugins', `paper: install chunky → 200 plugins/ (HTTP ${r.status} ${r.body?.error || ''})`);
    check(jars(path.join(DATA_DIR, paper, 'plugins')).some(f => /chunky/i.test(f)), 'paper: JAR landed in plugins/');
    const list = await api(`/api/servers/${paper}/plugins`);
    check(list.body?.plugins?.some(p => /chunky/i.test(p.name)), 'paper: listed by GET /plugins');
  }
  if (fabric) {
    const r = await api(`/api/servers/${fabric}/plugins/install`, { method: 'POST', body: { project_id: 'chunky' } });
    check(r.status === 200 && r.body?.dir === 'mods', `fabric: install chunky → 200 mods/ (HTTP ${r.status} ${r.body?.error || ''})`);
    check(jars(path.join(DATA_DIR, fabric, 'mods')).some(f => /chunky/i.test(f)), 'fabric: JAR landed in mods/');
    check(jars(path.join(DATA_DIR, fabric, 'plugins')).length === 0, 'fabric: nothing in plugins/');
    // Clone keeps the mods (mods/ used to be left out of clones).
    const cl = await api('/api/servers/clone', { method: 'POST', body: { source_id: fabric, name: 'pi-clone' } });
    const cid = cl.body?.id || cl.body?.server?.id;
    if (cid) created.push(cid);
    check(cl.status === 200 && jars(path.join(DATA_DIR, cid || 'x', 'mods')).some(f => /chunky/i.test(f)), `clone of fabric server keeps mods/ (HTTP ${cl.status} ${cl.body?.error || ''})`);
    const bad = await api(`/api/servers/${fabric}/plugins/install`, { method: 'POST', body: { project_id: 'worldguard' } });
    check(bad.status === 404, `fabric: Bukkit-only plugin refused (HTTP ${bad.status})`);
    // A real pack: every file is downloaded from an allowed host and
    // hash-checked into mods/ (client-only files would be skipped).
    const mp = await api(`/api/servers/${fabric}/plugins/install-modpack`, { method: 'POST', body: { project_id: 'fabulously-optimized' } });
    check(mp.status === 200 && mp.body.installed > 0 && mp.body.skipped === 0,
      `modpack: ${mp.body?.installed} installed, ${mp.body?.client_only} client-only skipped, ${mp.body?.skipped} failed (HTTP ${mp.status} ${mp.body?.error || ''})`);
  }
  const vanilla = await make('vanilla', '1.21.1');
  if (vanilla) {
    const r = await api(`/api/servers/${vanilla}/plugins/install`, { method: 'POST', body: { project_id: 'chunky' } });
    check(r.status === 400, `vanilla: install refused (HTTP ${r.status})`);
  }
} finally {
  for (const id of created) await api(`/api/servers/${id}`, { method: 'DELETE' });
  await api('/api/auth/me', { method: 'DELETE', body: { password, confirm: 'DELETE' } });
}

console.log(`\nChecks: ${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
