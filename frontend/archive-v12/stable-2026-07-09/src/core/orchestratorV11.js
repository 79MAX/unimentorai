const ENDPOINTS = [
  "http://127.0.0.1:3001",
  "http://localhost:3001"
];

const WS_ENDPOINTS = [
  "ws://127.0.0.1:3001",
  "ws://localhost:3001"
];

/* =========================
   CACHE (ANTI RECHECK LOOP)
========================= */

let cachedBackend = null;
let cachedWS = null;

/* =========================
   FAST HEALTH PROBE (PARALLEL + TIMEOUT)
========================= */

export async function detectBackend(timeout = 1500) {

  if (cachedBackend) return cachedBackend;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {

    const checks = ENDPOINTS.map(url =>
      fetch(`${url}/api/health`, {
        signal: controller.signal
      })
        .then(res => res.ok ? url : null)
        .catch(() => null)
    );

    const result = await Promise.race([
      Promise.all(checks),
      new Promise(resolve => setTimeout(() => resolve([]), timeout))
    ]);

    const found = (result || []).find(Boolean);

    cachedBackend = found || null;

    return cachedBackend;

  } finally {
    clearTimeout(timer);
  }
}

/* =========================
   WS SELECTOR (SMART CACHE)
========================= */

export function detectWebSocket() {

  if (cachedWS) return cachedWS;

  cachedWS = WS_ENDPOINTS[0];

  return cachedWS;
}

/* =========================
   SMART BACKOFF (IMPROVED CURVE)
========================= */

export function computeBackoff(retry) {

  // smoother exponential curve + cap
  const base = 800;
  const delay = base * (1.8 ** retry);

  return Math.min(delay, 7000);
}

/* =========================
   RESET CACHE (OPTIONAL DEBUG)
========================= */

export function resetOrchestratorCache() {
  cachedBackend = null;
  cachedWS = null;
}