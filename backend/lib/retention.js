// Retention for the two tables that grow with use: player_events holds every
// chat line and player IP, audit_log every action. Rows older than
// PLAYER_EVENTS_DAYS (30) / AUDIT_LOG_DAYS (180) are pruned by the janitor.
const db = require("../db");

function pruneOldRows(now = Math.floor(Date.now() / 1000)) {
  const days = (env, def) => Math.max(1, parseInt(process.env[env] || def, 10)) * 86400;
  try {
    const pe = db.prepare("DELETE FROM player_events WHERE ts < ?").run(now - days("PLAYER_EVENTS_DAYS", "30")).changes;
    const al = db.prepare("DELETE FROM audit_log WHERE created_at < ?").run(now - days("AUDIT_LOG_DAYS", "180")).changes;
    if (pe || al) console.log(`🧹 Retention: pruned ${pe} player events, ${al} audit rows`);
    return { player_events: pe, audit_log: al };
  } catch (err) {
    console.warn("[retention] prune failed:", err.message);
    return null;
  }
}

module.exports = { pruneOldRows };
