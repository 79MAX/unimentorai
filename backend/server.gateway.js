const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const os = require("os");
const crypto = require("crypto");

const PORT = process.env.PORT || 3001;

/* =========================
   APP
========================= */
const app = express();
app.use(express.json());

const server = http.createServer(app);

/* =========================
   WS SERVER
========================= */
const wss = new WebSocket.Server({
  server,
  perMessageDeflate: false,
  clientTracking: true
});

const clients = new Map();

/* =========================
   UTILS
========================= */
const id = () => crypto.randomUUID();

function metrics() {
  const mem = process.memoryUsage();

  return {
    cpu: os.loadavg()[0],
    ramMB: Math.round(mem.rss / 1024 / 1024),
    heapMB: Math.round(mem.heapUsed / 1024 / 1024),
    uptime: Math.floor(process.uptime()),
    clients: clients.size,
    ts: Date.now()
  };
}

function safeSend(ws, data) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;

  try {
    ws.send(data);
  } catch (err) {
    // ignore broken socket
  }
}

/* =========================
   HTTP ROUTES
========================= */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    clients: clients.size,
    uptime: process.uptime()
  });
});

app.get("/api/metrics", (req, res) => {
  res.json(metrics());
});

/* =========================
   WS CONNECTION
========================= */
wss.on("connection", (ws) => {

  const clientId = id();

  ws.id = clientId;
  ws.alive = true;

  clients.set(clientId, ws);

  console.log(`🔥 WS CONNECTED | clients=${clients.size}`);

  safeSend(ws, JSON.stringify({
    type: "WELCOME",
    clientId,
    ts: Date.now()
  }));

  ws.on("pong", () => {
    ws.alive = true;
  });

  ws.on("error", () => {
    clients.delete(clientId);
  });

  ws.on("close", () => {
    clients.delete(clientId);
    console.log(`❌ WS DISCONNECTED | clients=${clients.size}`);
  });
});

/* =========================
   HEARTBEAT SAFE
========================= */
const heartbeat = setInterval(() => {

  for (const [id, ws] of clients) {

    if (!ws || ws.readyState !== WebSocket.OPEN || !ws.alive) {
      try { ws?.terminate(); } catch {}
      clients.delete(id);
      continue;
    }

    ws.alive = false;

    try {
      ws.ping();
    } catch {
      clients.delete(id);
    }
  }

}, 15000);

/* =========================
   BROADCAST OPTIMIZED
========================= */
const broadcast = setInterval(() => {

  if (clients.size === 0) return;

  const payload = JSON.stringify({
    type: "METRICS",
    data: metrics()
  });

  for (const ws of clients.values()) {
    safeSend(ws, payload);
  }

}, 3000);

/* =========================
   CLEAN SHUTDOWN
========================= */
function shutdown() {
  console.log("🛑 Shutting down gateway...");

  clearInterval(heartbeat);
  clearInterval(broadcast);

  for (const ws of clients.values()) {
    try { ws.terminate(); } catch {}
  }

  clients.clear();

  server.close(() => {
    console.log("✅ Gateway stopped cleanly");
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

/* =========================
   START SERVER
========================= */
server.listen(PORT, () => {
  console.log("\n🚀 UNIMENTORAI GATEWAY V2 STABLE");
  console.log("👉 HTTP:", `http://localhost:${PORT}`);
  console.log("👉 WS:  ", `ws://localhost:${PORT}`);
});