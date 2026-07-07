let ws = null;

let retry = 0;
let retryTimer = null;

let isConnecting = false;
let initialized = false;

let clientId = null;

/* =========================
   CONFIG
========================= */
const URL = "ws://localhost:3001";

/* =========================
   LOG
========================= */
function log(...args) {
  console.log("[WS ULTRA]", ...args);
}

/* =========================
   BACKOFF STRATEGY
========================= */
function getBackoff() {
  return Math.min(30000, 1000 * Math.pow(2, retry));
}

/* =========================
   CONNECTION GUARD
========================= */
function canConnect() {
  if (isConnecting) return false;

  if (
    ws &&
    (ws.readyState === WebSocket.OPEN ||
      ws.readyState === WebSocket.CONNECTING)
  ) {
    return false;
  }

  return true;
}

/* =========================
   MAIN CONNECTION
========================= */
export function getWS() {
  // 🔒 STRICTMODE SAFE GUARD
  if (initialized && ws?.readyState === WebSocket.OPEN) {
    return ws;
  }

  if (!canConnect()) return ws;

  initialized = true;
  isConnecting = true;

  ws = new WebSocket(URL);

  /* =========================
     OPEN
  ========================= */
  ws.onopen = () => {
    isConnecting = false;
    retry = 0;

    log("CONNECTED ✔");

    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
  };

  /* =========================
     MESSAGE
  ========================= */
  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case "WELCOME":
          clientId = msg.id || msg.clientId;
          log("CLIENT ID:", clientId);
          break;

        case "METRICS":
          log("METRICS RECEIVED");
          break;

        default:
          log("EVENT:", msg);
      }
    } catch {
      log("RAW:", event.data);
    }
  };

  /* =========================
     CLOSE
  ========================= */
  ws.onclose = (e) => {
    isConnecting = false;
    ws = null;

    log("DISCONNECTED ❌", e.code);

    scheduleReconnect();
  };

  /* =========================
     ERROR
  ========================= */
  ws.onerror = () => {
    log("WS ERROR");
    try {
      ws?.close();
    } catch {}
  };

  return ws;
}

/* =========================
   RECONNECT ENGINE
========================= */
function scheduleReconnect() {
  if (retryTimer) return;

  retry++;

  const delay = getBackoff();

  log(`RECONNECT IN ${delay}ms`);

  retryTimer = setTimeout(() => {
    retryTimer = null;
    getWS();
  }, delay);
}

/* =========================
   CLEAN RESET (OPTIONAL)
========================= */
export function resetWS() {
  retry = 0;
  initialized = false;

  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }

  if (ws) {
    try {
      ws.close();
    } catch {}
    ws = null;
  }

  log("RESET ✔");
}

/* =========================
   INFO
========================= */
export function getClientId() {
  return clientId;
}

/* =========================
   DEBUG STATE
========================= */
export function getWSState() {
  return {
    connected: ws?.readyState === WebSocket.OPEN,
    connecting: isConnecting,
    retry,
    clientId,
  };
}