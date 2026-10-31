#!/usr/bin/env node
// auto-fix fixPlugin(): disables the jar whose plugin.yml declares the crashed
// plugin, never a similarly named neighbour. Self-contained (temp DATA_DIR).
//   node scripts/test-auto-fix-plugin.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'afp-'));
process.env.DATA_DIR = tmp;
const AdmZip = require('adm-zip');
const { fixPlugin } = require('../backend/lib/auto-fix.js');
let pass = 0, fail = 0;
const check = (c, m) => { console.log(`  ${c ? '\x1b[32m✓' : '\x1b[31m✗'}\x1b[0m ${m}`); c ? pass++ : fail++; };
const dir = path.join(tmp, 'srv', 'plugins');
function jar(file, name) {
  const z = new AdmZip();
  if (name) z.addFile('plugin.yml', Buffer.from(`name: ${name}\nversion: 1.0\nmain: x.Y\n`));
  z.writeZip(path.join(dir, file));
}
function reset() { fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true }); }
const S = { id: 'srv' };

reset(); jar('worldedit-bukkit-7.3.jar', 'WorldEdit'); jar('WorldEditSUI-1.7.jar', 'WorldEditSUI');
let r = await fixPlugin(S, 'WorldEditSUI');
check(r.disabled === 'WorldEditSUI-1.7.jar' && fs.existsSync(path.join(dir, 'worldedit-bukkit-7.3.jar')), `WorldEditSUI crash disables only WorldEditSUI (${JSON.stringify(r)})`);

reset(); jar('ess.jar', 'Essentials'); jar('EssentialsChat.jar', 'EssentialsChat');
r = await fixPlugin(S, 'Essentials');
check(r.disabled === 'ess.jar', `matched by plugin.yml name, not filename (${JSON.stringify(r)})`);

reset(); jar('Foo-1.0.jar'); jar('Foo-2.0.jar');
r = await fixPlugin(S, 'Foo');
check(!r.disabled && /2 jars/.test(r.skipped), `ambiguous filenames are not guessed (${JSON.stringify(r)})`);

reset(); jar('Bar-1.0.jar');
r = await fixPlugin(S, 'Bar');
check(r.disabled === 'Bar-1.0.jar', `single filename match without plugin.yml still works (${JSON.stringify(r)})`);

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\nChecks: ${pass} pass / ${fail} fail`);
process.exit(fail ? 1 : 0);
