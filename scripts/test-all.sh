#!/usr/bin/env bash
# Every offline suite, each against its own throwaway backend (see
# run-isolated.sh) with the settings it needs. No network beyond localhost,
# no Minecraft JVM boot. `npm run test:full`; NETWORK=1 adds the suites that
# talk to Modrinth (plugin install, mod updates + their UI); BOOT=1 adds the
# ones that boot a real server JVM.
set -u
cd "$(dirname "$0")/.."
R=scripts/run-isolated.sh
fail=0
run() { echo; echo "━━ $*"; "$@" || { echo "✗ FAILED: $*"; fail=1; }; }

run bash -c 'npm test'
run node scripts/test-auto-fix.mjs
run node scripts/test-auto-fix-plugin.mjs
run node scripts/test-console-health.mjs
run node scripts/test-rcon-tick.mjs
run node scripts/test-startup-parse.mjs
run env WORLD_IMPORT_MAX_MB=1 $R node scripts/test-world-import.mjs
run env MAX_JARS_PER_USER=3 $R node scripts/test-custom-jar.mjs
run env WS_PING_MS=500 $R node scripts/test-ws-limits.mjs
run env STORAGE_GB_OVERRIDE=0.002 $R node scripts/test-storage-quota.mjs
run $R node scripts/test-auth-case.mjs
if [ "${NETWORK:-0}" = "1" ]; then
  run env MAX_SERVERS_PER_USER=5 $R node scripts/test-plugin-install.mjs
  run env MAX_SERVERS_PER_USER=5 $R node scripts/test-mod-updates.mjs
  run $R node scripts/test-e2e-mod-updates-ui.mjs
fi
# BOOT=1: suites that boot a real Minecraft JVM (~1 GB RAM, cached Paper JAR).
if [ "${BOOT:-0}" = "1" ]; then
  run $R node scripts/test-startup-commands.mjs
fi

echo
[ "$fail" = 0 ] && echo "✓ all suites passed" || echo "✗ some suites failed"
exit "$fail"
