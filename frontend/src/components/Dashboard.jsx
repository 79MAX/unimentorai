import { useEffect, useState } from "react";
import { getWS, getWSState } from "../services/ws.engine";

export default function Dashboard() {
  const [state, setState] = useState(getWSState());
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const ws = getWS();

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "METRICS") {
          setMetrics(msg.data);
        }
      } catch {}
    };

    const interval = setInterval(() => {
      setState(getWSState());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <h2>🚀 UniMentorAI Dashboard</h2>

      {/* STATUS */}
      <div style={styles.card}>
        <h3>Connection</h3>
        <p>
          {state.connected ? "🟢 CONNECTED" : "🔴 DISCONNECTED"}
        </p>
        <p>Client ID: {state.clientId || "..."}</p>
        <p>Retry: {state.retry}</p>
      </div>

      {/* METRICS */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>CPU</h3>
          <h1>{metrics?.cpu ?? 0}</h1>
        </div>

        <div style={styles.card}>
          <h3>RAM (MB)</h3>
          <h1>{metrics?.ramMB ?? 0}</h1>
        </div>

        <div style={styles.card}>
          <h3>Heap</h3>
          <h1>{metrics?.heapMB ?? 0}</h1>
        </div>

        <div style={styles.card}>
          <h3>Clients</h3>
          <h1>{metrics?.clients ?? 0}</h1>
        </div>
      </div>

      {/* RAW DEBUG */}
      <div style={styles.card}>
        <h3>Raw Metrics</h3>
        <pre>{JSON.stringify(metrics, null, 2)}</pre>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "system-ui",
    padding: 20,
    background: "#0b0f19",
    color: "white",
    minHeight: "100vh",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 10,
    marginTop: 10,
  },
  card: {
    background: "#111827",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
};