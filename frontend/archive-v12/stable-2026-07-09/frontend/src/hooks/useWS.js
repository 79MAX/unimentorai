import { useEffect, useRef, useState } from "react";

let ws = null;
let retry = 0;
let retryTimer = null;
let manualClose = false;
let clientId = null;

const URL = "ws://localhost:3001";

/* =========================
   BACKOFF
========================= */
function getBackoff() {
  return Math.min(30000, 1000 * Math.pow(2, retry));
}

/* =========================
   SINGLETON WS
========================= */
function createWS(setState) {

  if (manualClose) return;

  ws = new WebSocket(URL);

  ws.onopen = () => {
    retry = 0;
    setState(prev => ({ ...prev, connected: true }));
  };

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);

      if (msg.type === "WELCOME") {
        clientId = msg.id;
        setState(prev => ({ ...prev, clientId }));
      }

      setState(prev => ({ ...prev, lastMessage: msg }));

    } catch {
      setState(prev => ({ ...prev, lastMessage: event.data }));
    }
  };

  ws.onclose = () => {
    ws = null;
    setState(prev => ({ ...prev, connected: false }));

    if (manualClose) return;

    retry++;

    const delay = getBackoff();

    retryTimer = setTimeout(() => {
      createWS(setState);
    }, delay);
  };

  ws.onerror = () => {
    try { ws?.close(); } catch {}
  };
}

/* =========================
   REACT HOOK
========================= */
export function useWS() {

  const [state, setState] = useState({
    connected: false,
    clientId: null,
    lastMessage: null
  });

  const mounted = useRef(false);

  useEffect(() => {

    if (mounted.current) return;
    mounted.current = true;

    manualClose = false;
    createWS(setState);

    return () => {
      manualClose = true;

      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }

      if (ws) {
        try { ws.close(); } catch {}
        ws = null;
      }
    };

  }, []);

  const send = (data) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  };

  return {
    ...state,
    send,
    reconnect: () => createWS(setState)
  };
}
