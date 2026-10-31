#!/usr/bin/env node
// Accounts are case-insensitive (email + username), and password-reset tokens
// are stored hashed. Local backend only (reads its log + DB):
//   BASE=... SERVER_LOG=<backend log> DATABASE_PATH=<db> node scripts/test-auth-case.mjs
import crypto from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const BASE = process.env.BASE || 'http://localhost:4099';
let pass = 0, fail = 0;
const check = (c, m) => { console.log(`  ${c ? '\x1b[32m✓' : '\x1b[31m✗'}\x1b[0m ${m}`); c ? pass++ : fail++; };
const post = async (p, body, tok, method = 'POST') => {
  const r = await fetch(BASE + p, { method, headers: { 'Content-Type': 'application/json', ...(tok ? { Authorization: `Bearer ${tok}` } : {}) }, body: JSON.stringify(body) });
  return { status: r.status, body: await r.json().catch(() => null) };
};
console.log(`\nAuth case/reset test against ${BASE}\n`);
const sfx = crypto.randomBytes(3).toString('hex');
const pw = 'Pw_' + sfx + 'abcdef12', pw2 = 'Pw2_' + sfx + 'abcdef12';
const reg = await post('/api/auth/register', { username: `CaseUser${sfx}`, email: `Case.${sfx}@Example.COM`, password: pw });
check(reg.status === 200 && reg.body.user.email === `case.${sfx}@example.com`, `register stores email lower-cased (${reg.body?.user?.email})`);
const tok = reg.body?.token;
check((await post('/api/auth/register', { username: `other${sfx}`, email: `CASE.${sfx}@example.com`, password: pw })).status === 409, 'same email in other case → 409');
check((await post('/api/auth/register', { username: `caseuser${sfx}`, email: `x${sfx}@example.com`, password: pw })).status === 409, 'same username in other case → 409');
check((await post('/api/auth/login', { email: `CASE.${sfx}@EXAMPLE.com`, password: pw })).status === 200, 'login with email in other case');
check((await post('/api/auth/login', { email: `CASEUSER${sfx}`, password: pw })).status === 200, 'login with username in other case');

await post('/api/auth/forgot', { email: `Case.${sfx}@example.COM` });
await new Promise(r => setTimeout(r, 300));
const m = fs.readFileSync(process.env.SERVER_LOG, 'utf8').match(new RegExp(`reset\\.html\\?token=([0-9a-f]{64})`, 'g'));
const resetTok = m ? m[m.length - 1].split('=')[1] : null;
check(!!resetTok, 'forgot (other case) issued a reset link');
const Database = require('better-sqlite3');
const rows = new Database(process.env.DATABASE_PATH, { readonly: true }).prepare('SELECT token FROM password_resets').all().map(r => r.token);
check(resetTok && !rows.includes(resetTok) && rows.includes(crypto.createHash('sha256').update(resetTok).digest('hex')), 'DB holds the token hash, not the token');
check((await post('/api/auth/reset', { token: resetTok, password: pw2 })).status === 200, 'reset with the emailed token works');
check((await post('/api/auth/reset', { token: resetTok, password: pw2 })).status === 400, 'token cannot be reused');
const login2 = await post('/api/auth/login', { email: `case.${sfx}@example.com`, password: pw2 });
check(login2.status === 200, 'login with the new password');
await post('/api/auth/me', { password: pw2, confirm: 'DELETE' }, login2.body?.token, 'DELETE');
console.log(`\nChecks: ${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
