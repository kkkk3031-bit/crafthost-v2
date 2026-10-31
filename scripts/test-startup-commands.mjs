#!/usr/bin/env node
// Startup commands: the settings API validates and stores them, and after a
// real boot ("Done") each one runs in the server console. Boots a Paper JVM
// (cached 1.20.1 JAR), so it is not part of the offline suite:
//
//   scripts/run-isolated.sh node scripts/test-startup-commands.mjs

import crypto from 'node:crypto';

const BASE = process.env.BASE || 'http://localhost:4099';
const VERSION = process.env.VERSION || '1.20.1';

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
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

console.log(`\nStartup commands test against ${BASE}\n`);
const suffix = crypto.randomBytes(4).toString('hex');
const reg = await api('/api/auth/register', {
  method: 'POST', body: { username: `sc_${suffix}`, email: `sc+${suffix}@test.io`, password: 'Pw_' + crypto.randomBytes(8).toString('hex') },
});
token = reg.body?.token;
check(!!token, 'register');
if (!token) process.exit(1);

const cr = await api('/api/servers', { method: 'POST', body: { name: 'sc', type: 'paper', version: VERSION, plan: 'free', skipAutoStart: true } });
const id = cr.body?.server?.id || cr.body?.id;
check(!!id, `create paper ${VERSION} (HTTP ${cr.status})`);
if (!id) process.exit(1);

const row = async () => (await api('/api/servers')).body?.servers?.find(s => s.id === id);
const patch = (startup_commands) => api(`/api/servers/${id}`, { method: 'PATCH', body: { startup_commands, restart: false } });

try {
  // ── Validation ──────────────────────────────────────────────────────────
  for (const [input, why] of [
    ['stop', '"stop"'],
    ['say hi\n/restart', '"/restart"'],
    ['minecraft:stop', '"minecraft:stop"'],
    ['say ' + 'x'.repeat(300), 'a 300-char command'],
    [Array.from({ length: 21 }, (_, i) => `say ${i}`).join('\n'), '21 commands'],
    [[1, 2], 'non-text items'],
  ]) {
    const r = await patch(input);
    check(r.status === 400, `${why} refused (HTTP ${r.status} ${r.body?.error || ''})`);
  }
  check(!(await row())?.startup_commands, 'nothing stored after refused saves');

  // ── Normalised storage ──────────────────────────────────────────────────
  const T1 = `SC_A_${suffix}`, T2 = `SC_B_${suffix}`;
  const ok = await patch(`/say ${T1}\n\n# a comment\n  say ${T2}  \ngamerule doDaylightCycle false`);
  check(ok.status === 200, `valid list saved (HTTP ${ok.status} ${ok.body?.error || ''})`);
  const stored = (await row())?.startup_commands;
  check(stored === `say ${T1}\nsay ${T2}\ngamerule doDaylightCycle false`, `stored normalised: slash, blanks and comments stripped (${JSON.stringify(stored)})`);

  // ── Real boot: the commands run after "Done" ────────────────────────────
  const st = await api(`/api/servers/${id}/start`, { method: 'POST' });
  check(st.status < 400, `start (HTTP ${st.status})`);
  let online = false;
  const t0 = Date.now();
  while (Date.now() - t0 < 180_000) {
    if ((await api(`/api/servers/${id}/status`)).body?.status === 'online') { online = true; break; }
    await sleep(2000);
  }
  check(online, `server online (${Math.round((Date.now() - t0) / 1000)}s)`);
  let logs = [];
  const t1 = Date.now();
  while (online && Date.now() - t1 < 20_000) {
    logs = ((await api(`/api/servers/${id}/logs?lines=400`)).body?.logs || []).map(l => typeof l === 'string' ? l : (l.line || l.text || JSON.stringify(l)));
    if (logs.some(l => l.includes(T2)) && logs.some(l => /doDaylightCycle/i.test(l))) break;
    await sleep(1000);
  }
  const iDone = logs.findIndex(l => /Done \([\d.]+s\)!/.test(l));
  const iA = logs.findIndex(l => l.includes(T1));
  const iB = logs.findIndex(l => l.includes(T2));
  check(iA > -1 && iB > -1, `both "say" commands echoed in the console`);
  check(iDone > -1 && iA > iDone && iB > iA, 'they ran after "Done", in order');
  check(logs.some(l => /doDaylightCycle/i.test(l) && /false/i.test(l)), 'gamerule command ran (console confirms doDaylightCycle=false)');

  // ── Clearing ────────────────────────────────────────────────────────────
  const clr = await patch('');
  check(clr.status === 200 && !(await row())?.startup_commands, 'empty input clears the list');
} finally {
  await api(`/api/servers/${id}/stop`, { method: 'POST' }).catch(() => {});
  await api(`/api/servers/${id}`, { method: 'DELETE' });
}

console.log(`\nChecks: ${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
