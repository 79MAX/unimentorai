const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const os = require("os");
const crypto = require("crypto");
const EventEmitter = require("events");

const PORT = process.env.PORT || 3001;

/* =========================
   CORE APP
========================= */
const app = express();
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const bus = new EventEmitter();
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
    ws.send(JSON.stringify(data));
  } catch {}
}

/* =========================
   EVENT BUS CORE
========================= */
function emit(event, data) {
  bus.emit(event, data);
}

bus.on("broadcast", (payload) => {
  for (const ws of clients.values()) {
    safeSend(ws, payload);
  }
});

bus.on("metrics", () => {
  emit("broadcast", {
    type: "METRICS",
    data: metrics()
  });
});

/* =========================
   HTTP API LAYER
========================= */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    clients: clients.size,
    uptime: process.uptime()
  });
});

app.post("/emit", (req, res) => {
  emit("broadcast", req.body);
  res.json({ ok: true });
});

/* =========================
   WS CONNECTION
========================= */
wss.on("connection", (ws) => {

  const clientId = id();

  ws.id = clientId;
  ws.alive = true;

  clients.set(clientId, ws);

  console.log(`🔥 CONNECTED | clients=${clients.size}`);

  safeSend(ws, {
    type: "WELCOME",
    clientId
  });

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);

      if (data.type) {
        emit(data.type, {
          clientId,
          payload: data.payload || null
        });
      }

    } catch {}
  });

  ws.on("pong", () => ws.alive = true);

  ws.on("close", () => {
    clients.delete(clientId);
    console.log(`❌ DISCONNECTED | clients=${clients.size}`);
  });
});

/* =========================
   HEARTBEAT SAFE
========================= */
setInterval(() => {
  for (const [id, ws] of clients) {

    if (!ws.alive || ws.readyState !== WebSocket.OPEN) {
      try { ws.terminate(); } catch {}
      clients.delete(id);
      continue;
    }

    ws.alive = false;
    ws.ping();
  }
}, 15000);

/* =========================
   METRICS LOOP
========================= */
setInterval(() => {
  emit("metrics");
}, 3000);

/* =========================
   START SERVER
========================= */
server.listen(PORT, () => {
  console.log("\n🚀 UNIMENTORAI REALTIME GATEWAY ONLINE");
  console.log("👉 HTTP:", `http://localhost:${PORT}`);
  console.log("👉 WS:  ", `ws://localhost:${PORT}`);
});