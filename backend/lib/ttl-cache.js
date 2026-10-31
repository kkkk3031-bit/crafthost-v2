// Small TTL cache for upstream listings (Mojang, Paper, Purpur, Fabric ...).
//   - concurrent misses share one upstream call
//   - when a refresh fails, the last good value is served (stale) instead of
//     an error: a version list from an hour ago beats a broken wizard
//   - empty results are not cached, so a bad upstream reply isn't pinned
function createTtlCache(ttlMs) {
  const store = new Map(); // key -> { ts, data }
  const inflight = new Map(); // key -> Promise

  return async function cached(key, fn) {
    const hit = store.get(key);
    if (hit && Date.now() - hit.ts < ttlMs) return hit.data;
    if (inflight.has(key)) return inflight.get(key);
    const p = (async () => {
      try {
        const data = await fn();
        const empty = data == null || (Array.isArray(data) && !data.length);
        if (!empty) store.set(key, { ts: Date.now(), data });
        return data;
      } catch (err) {
        if (hit) {
          console.warn(`[cache] ${key}: refresh failed (${err.message}); serving stale`);
          return hit.data;
        }
        throw err;
      } finally {
        inflight.delete(key);
      }
    })();
    inflight.set(key, p);
    return p;
  };
}

module.exports = { createTtlCache };
