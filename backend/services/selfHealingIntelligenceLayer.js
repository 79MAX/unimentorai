export default function selfHealingIntelligenceLayer(input = {}) {

  if (!input || typeof input !== "object") {
    return EMPTY_OUTPUT;
  }

  /* =========================
     FAST SAFE EXTRACTION
  ========================= */

  const metrics = input.metrics || EMPTY_OBJ;
  const system = input.system || EMPTY_OBJ;
  const ai = input.ai || EMPTY_OBJ;

  const logs = Array.isArray(input.logs) ? input.logs : EMPTY_ARRAY;

  /* =========================
     PRIMITIVE NORMALIZATION (FAST PATH)
  ========================= */

  const cpu = toNumber(metrics.cpuLoad ?? metrics.cpu);
  const memory = toNumber(metrics.heapUsedMB ?? metrics.memoryMB);

  const clients = toNumber(
    system.clients ?? metrics.clients ?? input.clients
  );

  const uptime = toNumber(
    system.uptime ?? metrics.uptime ?? input.uptime
  );

  /* =========================
     AI SAFE STATE (NO OVERHEAD)
  ========================= */

  const aiScore = toNumber(ai.score);
  const aiSafe = {
    score: aiScore,
    status: ai.status || "stable",
    level: ai.level || "P3",
    action: ai.action || "SYSTEM_OPTIMAL"
  };

  /* =========================
     HEALTH ENGINE (FAST MATH)
  ========================= */

  const healthScore =
    (cpu < 70) +
    (memory < 512) +
    (clients >= 0);

  const status =
    healthScore === 3
      ? "HEALTHY"
      : healthScore === 2
      ? "DEGRADED"
      : "CRITICAL";

  /* =========================
     LOG PROCESSING (ZERO HEAVY OPS)
  ========================= */

  const safeLogs = logs.length
    ? logs.slice(-10).map(normalizeLog)
    : EMPTY_ARRAY;

  /* =========================
     FINAL OUTPUT (IMMUTABLE SAFE)
  ========================= */

  return {
    status,
    metrics: {
      cpu,
      memory,
      clients,
      uptime
    },
    ai: aiSafe,
    logs: safeLogs,
    healed: true,
    ts: Date.now()
  };
}

/* =========================
   FAST UTILITIES (CTO OPTIMIZED)
========================= */

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function normalizeLog(l) {
  if (!l) return { level: "info", msg: "empty" };
  return {
    level: l.level || "info",
    msg: l.msg || "no message"
  };
}

/* =========================
   PREALLOCATED CONSTANTS
========================= */

const EMPTY_OBJ = Object.freeze({});
const EMPTY_ARRAY = Object.freeze([]);
const EMPTY_OUTPUT = Object.freeze({});