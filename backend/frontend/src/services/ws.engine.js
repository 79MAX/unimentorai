let ws = null;

let retry = 0;
let retryTimer = null;

let isConnecting = false;
let manualClose = false;

let clientId = null;

const URL = "ws://localhost:3001";

function log(...args) {
  console.log("[WS ENTERPRISE]", ...args);
}

function getBackoffTime() {
  return Math.min(30000, 1000 * Math.pow(2, retry));
}

/* =========================
   SINGLETON GUARD (IMPORTANT FIX)
========================= */
function shouldCreateConnection() {
  if (manualClose) return false;
  if (isConnecting) return false;
  if (ws && ws.readyState === WebSocket.OPEN) return false;
  if (ws && ws.readyState === WebSocket.CONNECTING) return false;
  return true;
}

/* =========================
   MAIN GET WS
========================= */
export function getWS() {
  if (!shouldCreateConnection()) return ws;

  isConnecting = true;
  manualClose = false;

  ws = new WebSocket(URL);

  ws.onopen = () => {
    isConnecting = false;
    retry = 0;

    log("CONNECTED");

    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
  };

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);

      if (msg.type === "WELCOME") {
        clientId = msg.id;
        log("CLIENT ID:", clientId);
      }

      handleEvent(msg);
    } catch {
      log("RAW:", event.data);
    }
  };

  ws.onclose = (e) => {
    isConnecting = false;
    ws = null;

    log("CLOSED:", e.code);

    if (manualClose) return;

    scheduleReconnect();
  };

  ws.onerror = () => {
    try {
      ws?.close();
    } catch {}
  };

  return ws;
}

/* =========================
   EVENT HANDLER
========================= */
function handleEvent(msg) {
  switch (msg.type) {
    case "METRICS":
      log("METRICS RECEIVED");
      break;

    case "WELCOME":
      break;

    default:
      log("EVENT:", msg);
  }
}

/* =========================
   RECONNECT ENGINE (SAFE)
========================= */
function scheduleReconnect() {
  if (manualClose) return;
  if (retryTimer) return;

  retry++;

  const delay = getBackoffTime();

  log("RECONNECT IN", delay, "ms");

  retryTimer = setTimeout(() => {
    retryTimer = null;
    getWS();
  }, delay);
}

/* =========================
   CLEAN CLOSE
========================= */
export function closeWS() {
  manualClose = true;
  isConnecting = false;

  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }

  retry = 0;

  if (ws) {
    try {
      ws.close();
    } catch {}
    ws = null;
  }

  log("MANUAL CLOSE");
}

/* =========================
   CLIENT ID
========================= */
export function getClientId() {
  return clientId;
}