let ws = null;
let retryTimer = null;
let isManuallyClosed = false;
let isConnecting = false;

const WS_URL = "ws://localhost:3001";
const RECONNECT_DELAY = 2000;

/**
 * SINGLETON WebSocket (V15 FINAL SAFE)
 */
export function getWS() {
  // déjà connecté
  if (ws && ws.readyState === WebSocket.OPEN) return ws;

  // déjà en connexion
  if (ws && ws.readyState === WebSocket.CONNECTING) return ws;

  // éviter double création (React StrictMode / multi call)
  if (isConnecting) return ws;

  isConnecting = true;
  isManuallyClosed = false;

  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log("🔥 WS CONNECTED (V15 FINAL)");

    isConnecting = false;

    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("📡 WS MESSAGE:", data);
    } catch {
      console.log("📡 WS RAW:", event.data);
    }
  };

  ws.onclose = (event) => {
    console.log("❌ WS CLOSED | code:", event.code);

    isConnecting = false;
    ws = null;

    // si fermeture volontaire → stop
    if (isManuallyClosed) return;

    // anti-loop reconnect
    if (!retryTimer) {
      retryTimer = setTimeout(() => {
        retryTimer = null;
        getWS();
      }, RECONNECT_DELAY);
    }
  };

  ws.onerror = () => {
    console.log("⚠️ WS ERROR");

    try {
      ws?.close();
    } catch {}
  };

  return ws;
}

/**
 * STOP CLEAN (important React unmount)
 */
export function closeWS() {
  console.log("🧹 WS MANUAL CLOSE");

  isManuallyClosed = true;
  isConnecting = false;

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
}