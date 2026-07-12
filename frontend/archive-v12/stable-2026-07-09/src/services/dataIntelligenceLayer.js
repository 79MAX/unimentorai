
/* =========================
   SAFE UTILITIES
========================= */
const toNum = (v, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

const toArr = (v) => Array.isArray(v) ? v : [];

/* =========================
   ANOMALY ENGINE
========================= */
function detectAnomalies(metrics, logs) {

  const anomalies = [];

  const cpu = toNum(metrics.cpuLoad);
  const mem = toNum(metrics.heapUsedMB);

  if (cpu > 80) anomalies.push({ type: "CPU_SPIKE", severity: "high" });
  if (mem > 200) anomalies.push({ type: "MEMORY_PRESSURE", severity: "medium" });

  const errors = logs.filter(l => l.level === "error").length;

  if (errors > 3) {
    anomalies.push({ type: "ERROR_BURST", severity: "critical" });
  }

  return anomalies;
}

/* =========================
   LOG TAGGING
========================= */
function tagLogs(logs) {
  return logs.map(l => ({
    ...l,
    tag:
      l.level === "error" ? "critical"
      : l.level === "warn" ? "risk"
      : l.level === "info" ? "info"
      : "neutral"
  }));
}

/* =========================
   HEALTH SCORE ENGINE
========================= */
function computeScore(metrics, anomalies) {

  let score = 100;

  score -= toNum(metrics.cpuLoad) * 0.5;
  score -= toNum(metrics.heapUsedMB) * 0.1;
  score -= anomalies.length * 15;

  return Math.max(0, Math.round(score));
}

/* =========================
   STATUS ENGINE
========================= */
function computeStatus(score) {

  if (score >= 80) {
    return {
      status: "stable",
      level: "P3",
      action: "SYSTEM_OPTIMAL"
    };
  }

  if (score >= 50) {
    return {
      status: "warning",
      level: "P2",
      action: "MONITOR_LOAD"
    };
  }

  return {
    status: "critical",
    level: "P0",
    action: "AUTO_SCALE_REQUIRED"
  };
}

/* =========================
   MAIN PIPELINE (V10 CORE)
========================= */
export default function dataIntelligenceLayer(payload = {}) {

  const metrics = payload.metrics || {};
  const logs = toArr(payload.logs);

  const anomalies = detectAnomalies(metrics, logs);
  const score = computeScore(metrics, anomalies);

  return {
    type: payload.type || "CONTROL_CENTER_V10",
    timestamp: Date.now(),

    metrics: {
      cpuLoad: toNum(metrics.cpuLoad),
      heapUsedMB: toNum(metrics.heapUsedMB),
      rssMB: toNum(metrics.rssMB),
      clients: toNum(metrics.clients),
      uptime: toNum(metrics.uptime)
    },

    ai: {
      ...computeStatus(score),
      score
    },

    logs: tagLogs(logs),

    intelligence: {
      anomalies,
      anomalyCount: anomalies.length,
      healthScore: score,
      systemGrade:
        score >= 80 ? "A"
        : score >= 50 ? "B"
        : "C"
    }
  };
}