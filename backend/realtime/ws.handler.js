let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT = 10;

const URL = "ws://localhost:3001";

/* =========================
   CONNECT
========================= */
function connect() {
  socket = new WebSocket(URL);

  socket.onopen = () => {
    reconnectAttempts = 0;
    console.log("🟢 WS CONNECTED");
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("📩 WS:", data);
    } catch {
      console.log("📩 RAW:", event.data);
    }
  };

  socket.onerror = (err) => {
    console.log("🔴 WS ERROR", err);
  };

  socket.onclose = () => {
    console.log("⚠️ WS CLOSED");

    if (reconnectAttempts < MAX_RECONNECT) {
      reconnectAttempts++;
      const delay = 1000 * reconnectAttempts;

      console.log(`🔁 Reconnecting in ${delay}ms...`);

      setTimeout(() => {
        connect();
      }, delay);
    } else {
      console.log("❌ WS MAX RECONNECT REACHED");
    }
  };
}

/* =========================
   SEND SAFE
========================= */
function send(type, payload = {}) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify({
    type,
    payload
  }));
}

/* =========================
   INIT
========================= */
connect();

export default {
  send,
  connect
};