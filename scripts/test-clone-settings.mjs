#!/usr/bin/env node
// Clone keeps the DB-only per-server settings (startup commands, scheduled
// restart) and drops the Discord webhook. Offline; run with the stub
// controller so the clone's auto-start doesn't boot a JVM:
//
//   CONTROLLER_BACKEND=stub scripts/run-isolated.sh node scripts/test-clone-settings.mjs

import crypto from 'node:crypto';

const BASE = process.env.BASE || 'http://localhost:4099';
let token = '';
async function api(p, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const r = await fetch(BASE + p, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  return { status: r.status, body: await r.json().catch(() => null) };
}
let pass = 0, fail = 0;
const check = (c, m) => { console.log(`  ${c ? '\x1b[32m✓' : '\x1b[31m✗'}\x1b[0m ${m}`); c ? pass++ : fail++; };

console.log(`\nClone settings test against ${BASE}\n`);
const sfx = crypto.randomBytes(4).toString('hex');
token = (await api('/api/auth/register', { method: 'POST', body: { username: `cs_${sfx}`, email: `cs+${sfx}@test.io`, password: 'Pw_' + sfx + 'xyz123' } })).body?.token;
check(!!token, 'register');
if (!token) process.exit(1);
const ids = [];
try {
  const src = (await api('/api/servers', { method: 'POST', body: { name: 'cs-src', type: 'paper', version: '1.20.1', plan: 'free', skipAutoStart: true } })).body?.id;
  check(!!src, 'create source');
  ids.push(src);
  const p = await api(`/api/servers/${src}`, { method: 'PATCH', body: { startup_commands: 'say up\ngamerule keepInventory true', scheduled_restart_at: '04:30', restart: false } });
  check(p.status === 200, `settings saved (HTTP ${p.status} ${p.body?.error || ''})`);
  const w = await api(`/api/servers/${src}/webhook`, { method: 'PATCH', body: { url: 'https://discord.com/api/webhooks/1/abc' } });
  check(w.status === 200, 'webhook set on source');

  const c = await api('/api/servers/clone', { method: 'POST', body: { source_id: src, name: 'cs-copy', skipWorld: true } });
  const dst = c.body?.id || c.body?.server?.id;
  check(c.status === 200 && !!dst, `clone (HTTP ${c.status} ${c.body?.error || ''})`);
  if (dst) ids.push(dst);
  const rows = (await api('/api/servers')).body?.servers || [];
  const d = rows.find(s => s.id === dst);
  check(d?.startup_commands === 'say up\ngamerule keepInventory true', `startup commands copied (${JSON.stringify(d?.startup_commands)})`);
  check(d?.scheduled_restart_at === '04:30', `scheduled restart copied (${d?.scheduled_restart_at})`);
  check(!d?.discord_webhook, 'Discord webhook not copied');
} finally {
  for (const id of ids) {
    await api(`/api/servers/${id}/stop`, { method: 'POST' }).catch(() => {});
    await api(`/api/servers/${id}`, { method: 'DELETE' });
  }
}
console.log(`\nChecks: ${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
