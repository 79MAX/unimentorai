const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

/* =========================
   CLIENT STORE (SAFE)
========================= */
const clients = new Set();

/* =========================
   CONNECTION LAYER
========================= */
wss.on("connection", (ws) => {
  ws.isAlive = true;
  clients.add(ws);

  ws.on("pong", () => (ws.isAlive = true));

  ws.on("close", () => clients.delete(ws));
  ws.on("error", () => clients.delete(ws));
});

/* =========================
   HEARTBEAT (ANTI DEAD CONNECTIONS)
========================= */
setInterval(() => {
  for (const ws of clients) {
    if (!ws.isAlive) {
      ws.terminate();
      clients.delete(ws);
      continue;
    }
    ws.isAlive = false;
    ws.ping();
  }
}, 30000);

/* =========================
   AI OBSERVABILITY ENGINE (LIGHTWEIGHT)
========================= */
function computeAI(metrics) {
  const score =
    metrics.requests * 0.02 +
    metrics.errors * 5 +
    metrics.users * 0.01;

  const risk = Math.min(100, Math.round(score));

  let status = "stable";
  let recommendation = "System optimal";

  if (risk > 75) {
    status = "critical";
    recommendation = "Scale infrastructure + enable caching + throttle traffic";
  } else if (risk > 50) {
    status = "warning";
    recommendation = "Monitor system load closely";
  }

  return { status, risk, recommendation };
}

/* =========================
   METRICS GENERATOR
========================= */
function generateMetrics() {
  return {
    users: 50 + Math.floor(Math.random() * 300),
    requests: 200 + Math.floor(Math.random() * 1200),
    errors: Math.floor(Math.random() * 10),
  };
}

/* =========================
   LOG ENGINE
========================= */
function generateLogs(ai) {
  const logs = [
    { level: "info", message: "heartbeat OK" },
    { level: "debug", message: "cache layer active" },
  ];

  if (ai.status === "warning") {
    logs.push({ level: "warn", message: "system load increasing" });
  }

  if (ai.status === "critical") {
    logs.push({ level: "error", message: "critical system pressure detected" });
  }

  return logs;
}

/* =========================
   BROADCAST ENGINE
========================= */
function broadcast(data) {
  const payload = JSON.stringify(data);

  for (const ws of clients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  }
}

/* =========================
   MAIN LOOP (V5 CLEAN)
========================= */
setInterval(() => {
  const metrics = generateMetrics();
  const ai = computeAI(metrics);
  const logs = generateLogs(ai);

  const packet = {
    type: "CONTROL_CENTER_V5",
    metrics,
    ai,
    logs,
    system: {
      uptime: process.uptime(),
      clients: clients.size,
      timestamp: Date.now(),
    },
  };

  broadcast(packet);
}, 2000);

/* =========================
   HEALTH CHECK API
========================= */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    version: "v5-clean-observability",
    clients: clients.size,
    uptime: process.uptime(),
  });
});

/* =========================
   START SERVER
========================= */
server.listen(3001, () => {
  console.log("🚀 Control Center V5 running on http://localhost:3001");
});