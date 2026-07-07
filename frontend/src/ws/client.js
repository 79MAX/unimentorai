let ws = null;
let retry = null;
let manuallyClosed = false;

const URL = "ws://localhost:3001";
const RECONNECT_DELAY = 2000;

export function getWS() {
  // déjà connecté
  if (ws && ws.readyState === WebSocket.OPEN) return ws;

  // en cours de connexion
  if (ws && ws.readyState === WebSocket.CONNECTING) return ws;

  manuallyClosed = false;

  ws = new WebSocket(URL);

  ws.onopen = () => {
    console.log("🔥 WS CONNECTED");

    // reset retry si connexion OK
    if (retry) {
      clearTimeout(retry);
      retry = null;
    }
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("📩 WS MESSAGE:", data);
    } catch {
      console.log("📩 WS RAW:", event.data);
    }
  };

  ws.onclose = (event) => {
    console.log("❌ WS CLOSED", event.code);

    ws = null;

    // IMPORTANT : éviter boucle infinie
    if (manuallyClosed) return;

    if (!retry) {
      retry = setTimeout(() => {
        retry = null;
        getWS();
      }, RECONNECT_DELAY);
    }
  };

  ws.onerror = (err) => {
    console.log("⚠️ WS ERROR");

    // évite boucle close/error infinie
    if (ws && ws.readyState !== WebSocket.CLOSED) {
      try {
        ws.close();
      } catch {}
    }
  };

  return ws;
}

export function closeWS() {
  manuallyClosed = true;

  if (retry) {
    clearTimeout(retry);
    retry = null;
  }

  if (ws) {
    try {
      ws.close();
    } catch {}
    ws = null;
  }
}