#!/usr/bin/env node
// Unit test for backend/lib/startup-commands.js (offline, no backend).
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sc = require('../backend/lib/startup-commands.js');

let pass = 0, fail = 0;
const ok = (c, m) => { console.log(`  ${c ? '\x1b[32m✓' : '\x1b[31m✗'}\x1b[0m ${m}`); c ? pass++ : fail++; };
const throws = (input, m) => { try { sc.parse(input); ok(false, m); } catch (e) { ok(true, `${m} (${e.message.slice(0, 50)})`); } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

console.log('\nStartup command parser\n');
ok(eq(sc.parse('/say a\r\n\n# note\n   say b   \n'), ['say a', 'say b']), 'slash, CRLF, blanks, comments, spaces');
ok(eq(sc.parse(['gamerule x true']), ['gamerule x true']), 'accepts an array');
ok(eq(sc.parse(''), []) && eq(sc.parse(null), []), 'empty → []');
ok(eq(sc.parse('say a\u0007b'), ['say a b']), 'control characters flattened (no stdin injection)');
ok(eq(sc.parse('//say x'), ['say x']), 'multiple leading slashes');
throws('stop', '"stop" refused');
throws('STOP now', 'case-insensitive');
throws('minecraft:stop', 'namespaced stop refused');
throws('restart', '"restart" refused');
throws('say ' + 'x'.repeat(sc.MAX_LEN), 'over-long command refused');
throws(Array.from({ length: sc.MAX_COMMANDS + 1 }, (_, i) => `say ${i}`).join('\n'), 'too many commands refused');
throws([1], 'non-text refused');
ok(eq(sc.parse('stopwatch start'), ['stopwatch start']), 'words that merely start with "stop" are fine');
ok(eq(sc.fromDb('stop'), []), 'invalid stored value → [] (never throws at boot)');

const ran = [];
sc.run(['a', 'b'], (c) => { ran.push(c); });
await new Promise(r => setTimeout(r, 1000));
ok(eq(ran, ['a', 'b']), 'run() writes in order');
const stopped = [];
sc.run(['a', 'b'], () => false, (c) => stopped.push(c));
await new Promise(r => setTimeout(r, 1000));
ok(stopped.length === 0, 'nothing logged once the process is gone');

console.log(`\nChecks: ${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
