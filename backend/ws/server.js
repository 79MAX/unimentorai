const WebSocket = require("ws");
const os = require("os");

const PORT = process.env.WS_PORT || 3001;

const CONFIG = {
  HEARTBEAT: 15000,
  VERSION: "WS_V15_PRO"
};

const wss = new WebSocket.Server({
  port: PORT
});

const clients = new Map();

function metrics() {
  const mem = process.memoryUsage();
  return {
    cpu: os.loadavg()[0],
    heapMB: Math.round(mem.heapUsed / 1024 / 1024),
    clients: clients.size,
    uptime: process.uptime(),
    time: Date.now()
  };
}

function broadcast(data) {
  const msg = JSON.stringify(data);

  for (const [id, ws] of clients) {
    if (ws.readyState !== WebSocket.OPEN) {
      clients.delete(id);
      continue;
    }
    ws.send(msg);
  }
}

wss.on("connection", (ws) => {
  const id = Date.now() + "-" + Math.random().toString(36).slice(2);

  clients.set(id, ws);
  ws.isAlive = true;

  console.log("🔥 CONNECTED =>", clients.size);

  ws.on("pong", () => (ws.isAlive = true));

  ws.on("close", () => {
    clients.delete(id);
    console.log("❌ DISCONNECTED =>", clients.size);
  });

  ws.send(JSON.stringify({
    type: "WELCOME",
    id,
    version: CONFIG.VERSION
  }));
});

setInterval(() => {
  for (const [id, ws] of clients) {
    if (!ws.isAlive) {
      ws.terminate();
      clients.delete(id);
      continue;
    }
    ws.isAlive = false;
    ws.ping();
  }
}, CONFIG.HEARTBEAT);

setInterval(() => {
  broadcast({
    type: "METRICS",
    data: metrics()
  });
}, 3000);

wss.on("listening", () => {
  console.log("🚀 WS V15 PRO RUNNING ON", PORT);
  console.log("👉 ws://localhost:" + PORT);
});
