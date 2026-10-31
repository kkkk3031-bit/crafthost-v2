#!/usr/bin/env node
// Console WebSocket: a user may hold at most WS_MAX_PER_USER (default 8)
// sockets, closed sockets free their slot, and dead ones are reaped.
//   BASE=http://localhost:4099 node scripts/test-ws-limits.mjs
import crypto from 'node:crypto';
import WebSocket from 'ws';
const BASE = process.env.BASE || 'http://localhost:4099';
const MAX = parseInt(process.env.WS_MAX_PER_USER || '8', 10);
let pass = 0, fail = 0;
const check = (c, m) => { console.log(`  ${c ? '\x1b[32m✓' : '\x1b[31m✗'}\x1b[0m ${m}`); c ? pass++ : fail++; };
const post = (p, body, tok) => fetch(BASE + p, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(tok ? { Authorization: `Bearer ${tok}` } : {}) }, body: JSON.stringify(body) }).then(r => r.json());
const sfx = crypto.randomBytes(4).toString('hex'), password = 'Pw_' + sfx + 'abcdef12';
const { token } = await post('/api/auth/register', { username: `ws_${sfx}`, email: `ws+${sfx}@t.io`, password });
const srv = await post('/api/servers', { name: 'ws', type: 'paper', version: '1.21.1', plan: 'free', skipAutoStart: true }, token);
const sid = srv.server?.id || srv.id;
const url = `${BASE.replace(/^http/, 'ws')}/ws/servers/${sid}/logs`;
const open = () => new Promise((resolve) => {
  const ws = new WebSocket(url, { headers: { Cookie: `token=${token}` } });
  ws.once('open', () => resolve(ws));
  ws.once('unexpected-response', (_q, res) => resolve(res.statusCode));
  ws.once('error', () => resolve(0));
});
console.log(`\nWS limits test against ${BASE}\n`);
const socks = [];
for (let i = 0; i < MAX + 1; i++) socks.push(await open());
check(socks.slice(0, MAX).every(s => typeof s === 'object'), `${MAX} sockets accepted`);
check(socks[MAX] === 429, `socket ${MAX + 1} refused with 429 (got ${socks[MAX]})`);
for (const s of socks.slice(0, MAX)) s.close();
await new Promise(r => setTimeout(r, 500));
const again = await open();
check(typeof again === 'object', 'slot freed after close');
again.close?.();
// Heartbeat (run the backend with WS_PING_MS=500): a client that never
// answers pings is dropped.
if (process.env.WS_PING_MS) {
  const mute = await new Promise((resolve) => {
    const ws = new WebSocket(url, { headers: { Cookie: `token=${token}` }, autoPong: false });
    ws.once('open', () => resolve(ws));
  });
  const closed = await new Promise((r) => { mute.once('close', () => r(true)); setTimeout(() => r(false), 4 * +process.env.WS_PING_MS); });
  check(closed, 'unresponsive socket terminated by heartbeat');
}
await fetch(`${BASE}/api/servers/${sid}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
await fetch(`${BASE}/api/auth/me`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ password, confirm: 'DELETE' }) });
console.log(`\nChecks: ${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
