// Single source for where server folders live. Absolute on purpose: the JVM runs
// with cwd = the server's own folder, so a relative path breaks every launch.
const path = require("path");

const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(__dirname, "../../data/servers"));

module.exports = { DATA_DIR };
