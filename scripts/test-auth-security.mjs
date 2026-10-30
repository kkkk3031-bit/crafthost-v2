#!/usr/bin/env node
// Auth hardening checks: bad input gets a 400 (not a 500), a password change
// revokes older sessions, and forged tokens are rejected.
//
//   BASE=http://localhost:4099 node scripts/test-auth-security.mjs

import crypto from 'node:crypto';
const BASE = process.env.BASE || 'http://localhost:4099';

async function api(p, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const r = await fetch(BASE + p, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  let json; try { json = await r.json(); } catch { json = null; }
  return { status: r.status, body: json, setCookie: r.headers.getSetCookie?.() || [] };
}
const G = s => `\x1b[32m${s}\x1b[0m`, R = s => `\x1b[31m${s}\x1b[0m`, Y = s => `\x1b[33m${s}\x1b[0m`;

let pass = 0, fail = 0;
function check(cond, msg) {
  if (cond) { console.log(`  ${G('✓')} ${msg}`); pass++; }
  else      { console.log(`  ${R('✗')} ${msg}`); fail++; }
}

console.log(`\nAuth security test against ${BASE}\n`);

console.log(`${Y('▶')} Non-string input is a 400, not a crash`);
for (const [path, body] of [
  ['/api/auth/login', { email: { $ne: 1 }, password: ['x'] }],
  ['/api/auth/login', { email: 'a@b.co' }],
  ['/api/auth/register', { username: ['abc'], email: 'x@y.zz', password: 'longenough1' }],
  ['/api/auth/forgot', { email: 42 }],
  ['/api/auth/reset', { token: { a: 1 }, password: 'longenough1' }],
]) {
  const r = await api(path, { method: 'POST', body });
  check(r.status === 400, `POST ${path} ${JSON.stringify(body)} → 400 (got ${r.status})`);
}

console.log(`${Y('▶')} Forged token is rejected`);
{
  const forged = [
    Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url'),
    Buffer.from('{"id":1,"role":"admin"}').toString('base64url'),
    'invalidsignature',
  ].join('.');
  const r = await api('/api/auth/me', { token: forged });
  check(r.status === 401, `GET /api/auth/me with forged token → 401 (got ${r.status})`);
}

console.log(`${Y('▶')} Register throwaway user`);
const suffix = crypto.randomBytes(4).toString('hex');
const password = 'Pw_' + crypto.randomBytes(8).toString('hex');
const reg = await api('/api/auth/register', {
  method: 'POST',
  body: { username: `as_${suffix}`, email: `as+${suffix}@test.io`, password },
});
check(reg.status === 200 && reg.body?.token, `register → ${reg.status}`);
if (!reg.body?.token) process.exit(1);
const oldToken = reg.body.token;

console.log(`${Y('▶')} Profile updates are validated`);
{
  const bad = await api('/api/auth/me', { method: 'PATCH', token: oldToken, body: { email: 'not-an-email', current_password: password } });
  check(bad.status === 400, `PATCH /me invalid email → 400 (got ${bad.status})`);
  const long = await api('/api/auth/me', { method: 'PATCH', token: oldToken, body: { username: 'x'.repeat(40), current_password: password } });
  check(long.status === 400, `PATCH /me 40-char username → 400 (got ${long.status})`);
}

console.log(`${Y('▶')} Password change revokes older sessions`);
const newPassword = 'Pw_' + crypto.randomBytes(8).toString('hex');
let newToken = null;
{
  const r = await api('/api/auth/change-password', {
    method: 'POST', token: oldToken, body: { current_password: password, new_password: newPassword },
  });
  check(r.status === 200, `change-password → ${r.status}`);
  newToken = r.setCookie.map(c => c.match(/^token=([^;]+)/)?.[1]).find(Boolean);
  check(!!newToken, 'response re-issues a session cookie');
  const old = await api('/api/auth/me', { token: oldToken });
  check(old.status === 401, `old token → 401 (got ${old.status})`);
  const cur = await api('/api/auth/me', { token: newToken });
  check(cur.status === 200, `new token → 200 (got ${cur.status})`);
}

console.log(`${Y('▶')} Account enumeration + lookup collisions`);
{
  const r = await api('/api/auth/register', {
    method: 'POST',
    body: { username: `x${suffix}@test.io`, email: `y+${suffix}@test.io`, password },
  });
  check(r.status === 400, `username containing @ → 400 (got ${r.status})`);

  // An unknown account must cost about as much as a wrong password (bcrypt runs either way).
  const time = async (email) => {
    const t = performance.now();
    const res = await api('/api/auth/login', { method: 'POST', body: { email, password: 'wrong-password-123' } });
    return { ms: performance.now() - t, status: res.status };
  };
  await time(`nobody-${suffix}@test.io`); // warm-up
  const known = [], unknown = [];
  for (let i = 0; i < 3; i++) {
    known.push((await time(`as+${suffix}@test.io`)).ms);
    unknown.push((await time(`nobody-${suffix}@test.io`)).ms);
  }
  const med = a => a.sort((x, y) => x - y)[1];
  check(med(unknown) > med(known) * 0.5,
    `unknown-account login takes comparable time (${med(unknown).toFixed(0)}ms vs ${med(known).toFixed(0)}ms)`);
}

console.log(`${Y('▶')} Concurrent sign-ups with the same email`);
{
  const s2 = crypto.randomBytes(4).toString('hex');
  const body = { username: `race_${s2}`, email: `race+${s2}@test.io`, password };
  const results = await Promise.all([1, 2, 3].map(() => api('/api/auth/register', { method: 'POST', body })));
  const codes = results.map(r => r.status).sort();
  check(codes.filter(c => c === 200).length === 1 && codes.every(c => c === 200 || c === 409),
    `exactly one 200, rest 409 (got ${codes.join(',')})`);
  const winner = results.find(r => r.status === 200);
  if (winner) await api('/api/auth/me', { method: 'DELETE', token: winner.body.token, body: { password, confirm: 'DELETE' } });
}

console.log(`${Y('▶')} Server create rejects unsafe input`);
for (const [label, body] of [
  ['unknown engine', { type: 'evil', plan: 'free' }],
  ['version with "&" (would run commands in the .bat starter)', { type: 'paper', version: '1.21 & calc', plan: 'free' }],
  ['name with a newline', { type: 'paper', version: '1.21.1', plan: 'free', name: 'a\nb' }],
  ['someone else\'s / made-up JAR id', { type: 'custom', plan: 'free', customJarPath: '/etc/passwd' }],
]) {
  const r = await api('/api/servers', { method: 'POST', token: newToken, body });
  check(r.status === 400, `${label} → 400 (got ${r.status}${r.body?.error ? ': ' + r.body.error : ''})`);
}

console.log(`${Y('▶')} Owner username alone grants nothing`);
{
  // On a fresh DB nobody owns the owner's name: whoever registers it must not become admin.
  const owner = (process.env.ADMIN_USERNAME || 'khaledq84ever');
  const r = await api('/api/auth/register', {
    method: 'POST',
    body: { username: owner, email: `own+${suffix}@test.io`, password },
  });
  if (r.status === 409) {
    console.log(`  ${Y('-')} skipped: "${owner}" already registered on this instance`);
  } else {
    check(r.status === 200, `register "${owner}" → ${r.status}`);
    const ops = await api('/api/admin/ops', { token: r.body?.token });
    check(ops.status === 403, `GET /api/admin/ops as non-admin "${owner}" → 403 (got ${ops.status})`);
    if (r.body?.token) await api('/api/auth/me', { method: 'DELETE', token: r.body.token, body: { password, confirm: 'DELETE' } });
  }
}

console.log(`${Y('▶')} Cleanup`);
{
  const r = await api('/api/auth/me', { method: 'DELETE', token: newToken, body: { password: newPassword, confirm: 'DELETE' } });
  check(r.status === 200, `delete account → ${r.status}`);
  const gone = await api('/api/auth/me', { token: newToken });
  check(gone.status === 401, `token of deleted user → 401 (got ${gone.status})`);
}

console.log(`\n─── Summary ───\nChecks: ${pass} pass / ${fail} fail · ${fail ? R('FAIL') : G('PASS')}`);
process.exit(fail ? 1 : 0);
