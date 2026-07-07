const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   SERVER CORE
========================= */
const server = http.createServer(app);
const wss = new WebSocket.Server({
  server,
  perMessageDeflate: false,
});

/* =========================
   CLIENT STORE (SAFE SET)
========================= */
const clients = new Set();

/* =========================
   CLEAN CONNECTION HANDLER
========================= */
wss.on("connection", (ws) => {
  ws.isAlive = true;
  clients.add(ws);

  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("close", () => {
    clients.delete(ws);
  });

  ws.on("error", () => {
    clients.delete(ws);
  });
});

/* =========================
   HEARTBEAT (ANTI DEAD SOCKET)
========================= */
setInterval(() => {
  for (const ws of clients) {
    if (ws.isAlive === false) {
      clients.delete(ws);
      ws.terminate();
      continue;
    }

    ws.isAlive = false;
    ws.ping();
  }
}, 30000);

/* =========================
   BROADCAST ENGINE (FAST PATH)
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
   AI + METRICS ENGINE
========================= */
function generatePacket() {
  const risk = Math.floor(Math.random() * 100);

  return {
    type: "CONTROL_CENTER_V4",
    metrics: {
      users: 50 + Math.floor(Math.random() * 250),
      requests: 200 + Math.floor(Math.random() * 1000),
      errors: Math.floor(Math.random() * 10),
    },
    ai: {
      status: risk > 70 ? "warning" : "stable",
      risk,
      recommendation:
        risk > 70
          ? "Scale cluster + enable cache + throttle traffic"
          : "System optimal",
    },
    logs: [
      { level: "info", message: "heartbeat ok" },
      { level: "debug", message: "cache layer active" },
    ],
    timestamp: Date.now(),
  };
}

/* =========================
   REALTIME LOOP (CONTROLLED)
========================= */
const INTERVAL_MS = 2000;

setInterval(() => {
  const packet = generatePacket();
  broadcast(packet);
}, INTERVAL_MS);

/* =========================
   HEALTH CHECK API
========================= */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    mode: "ws-v4-enterprise",
    clients: clients.size,
    uptime: process.uptime(),
  });
});

/* =========================
   START SERVER
========================= */
const PORT = 3001;

server.listen(PORT, () => {
  console.log(`🚀 Control Center WS running on http://localhost:${PORT}`);
});