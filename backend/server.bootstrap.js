const WebSocket = require("ws");
const net = require("net");
const os = require("os");

/* =========================
   CONFIG
========================= */
const START_PORT = 3001;

const CONFIG = {
  HEARTBEAT: 15000,
  BROADCAST: 3000,
  VERSION: "V16_SAFE_BOOT"
};

let wss;
const clients = new Map();

/* =========================
   FIND FREE PORT (FIXED)
========================= */
function findFreePort(port) {
  return new Promise((resolve) => {
    const tester = net.createServer();

    tester.once("error", () => {
      tester.close();
      resolve(findFreePort(port + 1)); // OK recursive return
    });

    tester.once("listening", () => {
      tester.close(() => resolve(port));
    });

    tester.listen(port);
  });
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
   START
========================= */
async function start() {

  const PORT = await findFreePort(START_PORT);

  wss = new WebSocket.Server({
    port: PORT,
    perMessageDeflate: false,
    clientTracking: true
  });

  console.log("\n🚀 WS SAFE BOOT V16");
  console.log("👉 PORT:", PORT);
  console.log("📡 STATUS: LISTENING");

  /* =========================
     CONNECTION
  ========================= */
  wss.on("connection", (ws) => {

    const id = Date.now() + "-" + Math.random().toString(36).slice(2);

    ws.id = id;
    ws.isAlive = true;

    clients.set(id, ws);

    console.log("🔥 CONNECTED =>", clients.size);

    safeSend(ws, JSON.stringify({
      type: "WELCOME",
      id,
      version: CONFIG.VERSION
    }));

    ws.on("pong", () => ws.isAlive = true);

    ws.on("close", () => {
      clients.delete(id);
      console.log("❌ DISCONNECTED =>", clients.size);
    });

    ws.on("error", () => {
      clients.delete(id);
    });
  });

  /* =========================
     HEARTBEAT
  ========================= */
  setInterval(() => {
    for (const [id, ws] of clients) {

      if (!ws.isAlive || ws.readyState !== WebSocket.OPEN) {
        try { ws.terminate(); } catch {}
        clients.delete(id);
        continue;
      }

      ws.isAlive = false;
      try { ws.ping(); } catch {}
    }
  }, CONFIG.HEARTBEAT);

  /* =========================
     BROADCAST
  ========================= */
  setInterval(() => {

    const payload = JSON.stringify({
      type: "METRICS",
      data: getMetrics()
    });

    for (const [id, ws] of clients) {
      safeSend(ws, payload);
    }

  }, CONFIG.BROADCAST);

  wss.on("error", (err) => {
    console.error("WS ERROR:", err.message);
  });
}

start();