// Process-wide default timeout for outbound fetch().
//
// Engine resolvers (Paper, Purpur, Fabric, Mojang), playit, version lists and
// plugin downloads all call fetch(); a single upstream that accepts the
// connection and never answers used to hang that request — or a server start
// holding its op lock — forever. Calls that pass their own `signal` keep it;
// everything else gets FETCH_TIMEOUT_MS (default 120 s, generous enough for
// the largest JAR download). Required first thing in server.js.
const DEFAULT_MS = parseInt(process.env.FETCH_TIMEOUT_MS || "120000", 10);

if (!globalThis.__crafthostFetchTimeout && typeof globalThis.fetch === "function") {
  const baseFetch = globalThis.fetch;
  globalThis.fetch = (input, init = {}) =>
    init && init.signal
      ? baseFetch(input, init)
      : baseFetch(input, { ...init, signal: AbortSignal.timeout(DEFAULT_MS) });
  globalThis.__crafthostFetchTimeout = true;
}

module.exports = { DEFAULT_MS };
