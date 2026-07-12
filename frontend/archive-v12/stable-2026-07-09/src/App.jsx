import { useEffect, useRef, useState } from "react";
import { getWS, getWSState } from "./services/ws.engine";

export default function App() {
  const [state, setState] = useState(getWSState());
  const [metrics, setMetrics] = useState(null);

  const wsRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const ws = getWS();
    wsRef.current = ws;

    // SAFE message handler (évite overwrite global)
    const handleMessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg?.type === "METRICS") {
          setMetrics(msg.data);
        }
      } catch (err) {
        console.warn("[WS PARSE ERROR]", err);
      }
    };

    ws.addEventListener("message", handleMessage);

    // UI state updater (optimisé via ref interval)
    intervalRef.current = setInterval(() => {
      setState(getWSState());
    }, 1000);

    return () => {
      ws.removeEventListener("message", handleMessage);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <div style={styles.container}>
      <h2>🚀 UniMentorAI WS Dashboard</h2>

      <div style={styles.card}>
        <h3>Connection</h3>
        <p>
          Status:{" "}
          {state.connected ? "🟢 CONNECTED" : "🔴 DISCONNECTED"}
        </p>
        <p>Client ID: {state.clientId || "..."}</p>
        <p>Retry: {state.retry}</p>
      </div>

      <div style={styles.card}>
        <h3>Live Metrics</h3>

        {metrics ? (
          <pre style={{ margin: 0 }}>
            {JSON.stringify(metrics, null, 2)}
          </pre>
        ) : (
          <p>Waiting metrics...</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "system-ui",
    padding: 20,
    background: "#0b0f19",
    color: "#fff",
    minHeight: "100vh",
  },
  card: {
    background: "#111827",
    padding: 15,
    borderRadius: 10,
    marginTop: 12,
  },
};