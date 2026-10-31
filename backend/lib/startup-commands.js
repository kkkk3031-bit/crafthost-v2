// Per-server startup commands: console commands the owner wants run every
// time the server finishes booting (gamerule, whitelist on, say ...).
// Stored newline-separated in servers.startup_commands.

const MAX_COMMANDS = 20;
const MAX_LEN = 256;
// A startup "stop"/"restart" would put the server in a boot loop.
const FORBIDDEN = new Set(['stop', 'restart', 'end']);
const GAP_MS = 400;

/**
 * Normalises user input (string with newlines, or an array) into a clean
 * command list. Throws an Error with a user-facing message when invalid.
 */
function parse(input) {
  if (input == null || input === '') return [];
  const raw = Array.isArray(input) ? input : String(input).split(/\r?\n/);
  const cmds = [];
  for (const item of raw) {
    if (typeof item !== 'string') throw new Error('Startup commands must be text');
    const flat = item.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().replace(/^\/+/, '').trim();
    if (!flat || flat.startsWith('#')) continue; // blank lines and # comments
    if (flat.length > MAX_LEN) throw new Error(`Startup command too long (max ${MAX_LEN} characters)`);
    const word = flat.split(/\s+/)[0].toLowerCase().replace(/^minecraft:/, '');
    if (FORBIDDEN.has(word)) throw new Error(`"${word}" can't be a startup command — it would stop the server on every boot`);
    cmds.push(flat);
  }
  if (cmds.length > MAX_COMMANDS) throw new Error(`Too many startup commands (max ${MAX_COMMANDS})`);
  return cmds;
}

/** DB value → list. Invalid stored rows yield an empty list rather than throwing. */
function fromDb(value) {
  try { return parse(value || ''); } catch { return []; }
}

/**
 * Writes each command to the JVM's stdin, spaced out so the console log stays
 * readable. `write(cmd)` returns false once the process is gone.
 */
function run(commands, write, log = () => {}) {
  commands.forEach((cmd, i) => {
    setTimeout(() => {
      if (write(cmd) !== false) log(cmd);
    }, (i + 1) * GAP_MS);
  });
}

module.exports = { parse, fromDb, run, MAX_COMMANDS, MAX_LEN };
