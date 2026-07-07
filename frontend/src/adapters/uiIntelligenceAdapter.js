export default function adaptLiveStreamToUI(live = {}) {

  /* =========================
     SAFE DESTRUCTURING
  ========================= */

  const metrics = live?.metrics ?? {};
  const ai = live?.ai ?? {};
  const system = live?.system ?? {};
  const logs = Array.isArray(live?.logs) ? live.logs : [];

  /* =========================
     SINGLE SOURCE RESOLVER (FIXED)
  ========================= */

  const clients = system.clients ?? metrics.clients ?? 0;
  const uptime = system.uptime ?? metrics.uptime ?? 0;

  const cpu = metrics.cpuLoad ?? 0;
  const memoryMB = metrics.heapUsedMB ?? metrics.rssMB ?? 0;

  /* =========================
     AI STATE (SAFE NORMALIZATION)
  ========================= */

  const aiCard = {
    score: Number(ai?.score ?? 0),
    status: ai?.status ?? "stable",
    level: ai?.level ?? "P3",
    action: ai?.action ?? "SYSTEM_OPTIMAL"
  };

  /* =========================
     SYSTEM CORE (SOURCE OF TRUTH)
  ========================= */

  const systemCard = {
    version: system?.version ?? live?.version ?? "INTELLIGENCE_ENGINE",
    status: system?.status ?? aiCard.status,
    clients,
    uptime,
    memoryRatio: live?.intelligence?.memoryRatio ?? 0
  };

  /* =========================
     SECURITY ENGINE (DERIVED SAFE)
  ========================= */

  const security = {
    risk: Math.min(100, aiCard.score * 10),
    level: aiCard.level,
    status: aiCard.status,
    threats: logs.filter(l => l?.level === "error"),
    anomalies: logs.filter(l => l?.level === "warn")
  };

  /* =========================
     METRIC CARDS (UI READY)
  ========================= */

  const metricCards = [
    {
      title: "CPU Load",
      value: `${cpu}%`,
      icon: "⚙️",
      color: "#3B82F6"
    },
    {
      title: "Memory",
      value: `${memoryMB} MB`,
      icon: "🧠",
      color: "#00ff88"
    },
    {
      title: "Clients",
      value: clients,
      icon: "👥",
      color: "#ffcc00"
    },
    {
      title: "Uptime",
      value: `${Math.floor(uptime)}s`,
      icon: "⏱️",
      color: "#a78bfa"
    }
  ];

  /* =========================
     LOG STREAM (SAFE SLICE)
  ========================= */

  const logCards = logs
    .slice(-6)
    .map(l => ({
      level: l?.level ?? "info",
      message: l?.msg ?? "No message"
    }));

  /* =========================
     FINAL IMMUTABLE OUTPUT
  ========================= */

  return {
    aiCard,
    systemCard,
    security,
    metricCards,
    logCards
  };
}