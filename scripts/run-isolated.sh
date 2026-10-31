#!/usr/bin/env bash
# Run one command against a throwaway backend: its own DB, DATA_DIR,
# BACKUP_DIR and JAR_DIR under data/.smoke-XXXX (same filesystem, shares the
# read-only JAR cache), torn down afterwards. The command gets BASE,
# DATA_DIR, JAR_DIR, DATABASE_PATH and SERVER_LOG in its environment.
#
#   scripts/run-isolated.sh node scripts/test-world-import.mjs
#   WORLD_IMPORT_MAX_MB=1 scripts/run-isolated.sh node scripts/test-world-import.mjs
#
# Extra backend settings are taken from the caller's environment.
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export PORT="${PORT:-4098}" NODE_ENV=test JWT_SECRET="${JWT_SECRET:-isolated-test-secret}"
export AUTO_STARTER="${AUTO_STARTER:-0}" PREWARM=0 AUTO_SMOKE=0
mkdir -p "$ROOT/data/.jar-cache"
D="$(mktemp -d "$ROOT/data/.smoke-XXXX")" || { echo "✗ cannot create isolated data dir"; exit 1; }
mkdir -p "$D/servers"
ln -s "$ROOT/data/.jar-cache" "$D/.jar-cache"
export DATA_DIR="$D/servers" BACKUP_DIR="$D/backups" JAR_DIR="$D/jars"
export BACKUPS_PER_SERVER="${BACKUPS_PER_SERVER:-3}"
export DATABASE_PATH="$D/test.db" SERVER_LOG="$D/server.log"

node backend/db/init.js >/dev/null 2>&1
node backend/server.js >"$SERVER_LOG" 2>&1 &
SRV=$!
cleanup() {
  kill "$SRV" 2>/dev/null
  for _ in $(seq 1 20); do kill -0 "$SRV" 2>/dev/null || break; sleep 0.5; done
  kill -9 "$SRV" 2>/dev/null
  rm -rf "$D"
}
trap cleanup EXIT

for _ in $(seq 1 40); do
  curl -fsS -o /dev/null "http://localhost:$PORT/api/health" 2>/dev/null && break
  sleep 0.25
done
export BASE="http://localhost:$PORT"
"$@"
