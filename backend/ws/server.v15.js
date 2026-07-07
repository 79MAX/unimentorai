const WebSocket = require("ws");
const http = require("http");
const os = require("os");
const crypto = require("crypto");

const PORT = process.env.PORT || 3001;

const CONFIG = {
  HEARTBEAT: 20000,
  BROADCAST: 4000,
  VERSION: "V16_STABLE_SAAS"
};

/* =========================
   HTTP SERVER (IMPORTANT FIX)
========================= */
const server = http.createServer();

/* =========================
   WS SERVER ATTACHED (FIX CRITIQUE)
========================= */
const wss = new WebSocket.Server({
  server,
  perMessageDeflate: false,
  clientTracking: true
});

const clients = new Map();

/* =========================
   ID GENERATOR
========================= */
function generateId() {
  return crypto.randomUUID();
}

/* =========================
   METRICS
========================= */
function getMetrics() {
  const mem = process.memoryUsage();

  return {
    cpu: os.loadavg()[0],
    ramMB: Math.round(mem.rss / 1024 / 1024),
    heapMB: Math.round(mem.heapUsed / 1024 / 1024),
    uptime: Math.floor(process.uptime()),
    clients: clients.size,
    version: CONFIG.VERSION,
    timestamp: Date.now()
  };
}

/* =========================
   SAFE SEND
========================= */
function safeSend(ws, data) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  try {
    ws.send(data);
  } catch {}
}

/* =========================
   CONNECTION
========================= */
wss.on("connection", (ws) => {

  const id = generateId();

  ws.id = id;
  ws.isAlive = true;

  clients.set(id, ws);

  console.log("🔥 CLIENT CONNECTED =>", clients.size);

  safeSend(ws, JSON.stringify({
    type: "WELCOME",
    id,
    version: CONFIG.VERSION
  }));

  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("close", () => {
    clients.delete(id);
    console.log("❌ CLIENT DISCONNECTED =>", clients.size);
  });

  ws.on("error", () => {
    clients.delete(id);
  });
});

/* =========================
   HEARTBEAT SAFE
========================= */
const heartbeat = setInterval(() => {
  for (const [id, ws] of clients) {

    if (!ws.isAlive || ws.readyState !== WebSocket.OPEN) {
      try { ws.terminate(); } catch {}
      clients.delete(id);
      continue;
    }

    ws.isAlive = false;

    try {
      ws.ping();
    } catch {
      clients.delete(id);
    }
  }
}, CONFIG.HEARTBEAT);

/* =========================
   BROADCAST METRICS
========================= */
const broadcast = setInterval(() => {

  if (clients.size === 0) return;

  const payload = JSON.stringify({
    type: "METRICS",
    data: getMetrics()
  });

  for (const [id, ws] of clients) {
    safeSend(ws, payload);
  }

}, CONFIG.BROADCAST);

/* =========================
   START SERVER (FIX FINAL)
========================= */
server.listen(PORT, () => {
  console.log("\n🚀 UniMentorAI WS V16 STABLE");
  console.log("👉 ws://localhost:" + PORT);
  console.log("📡 clients:", clients.size);
});

/* =========================
   CLEAN SHUTDOWN
========================= */
function shutdown() {
  console.log("🛑 shutting down WS...");

  clearInterval(heartbeat);
  clearInterval(broadcast);

  for (const [id, ws] of clients) {
    try { ws.terminate(); } catch {}
  }

  clients.clear();

  wss.close(() => {
    server.close(() => {
      console.log("✅ WS V16 closed cleanly");
      process.exit(0);
    });
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

/* =========================
   ERROR HANDLING
========================= */
wss.on("error", (err) => {
  console.error("WS ERROR:", err.message);
});