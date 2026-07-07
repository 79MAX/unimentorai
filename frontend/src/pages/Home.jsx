import { useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import useWebSocket from "../hooks/useWebSocket";

export default function Home() {

  const { getHealth, getAIStatus, loading, error } = useApi();

  const [health, setHealth] = useState(null);
  const [ai, setAi] = useState(null);

  const {
    status: wsStatus,
    lastMessage,
    messages,
    send,
  } = useWebSocket("ws://localhost:3001");

  /* =========================
     LOAD API DATA
  ========================= */

  useEffect(() => {
    async function load() {

      const h = await getHealth();
      const a = await getAIStatus();

      setHealth(h);
      setAi(a);
    }

    load();
  }, []);

  /* =========================
     UI STATUS HELPERS
  ========================= */

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
      case "connected":
        return "green";
      case "connecting":
        return "orange";
      case "error":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1>🚀 CONTROL CENTER V7 AI DASHBOARD</h1>

        <div style={styles.statusBar}>
          <span>
            ⚡ WS:{" "}
            <b style={{ color: getStatusColor(wsStatus) }}>
              {wsStatus}
            </b>
          </span>

          {loading && <span>⏳ Loading...</span>}
          {error && <span style={{ color: "red" }}>{error}</span>}
        </div>
      </div>

      {/* GRID */}
      <div style={styles.grid}>

        {/* HEALTH */}
        <div style={styles.card}>
          <h2>🟢 Health</h2>
          <pre style={styles.pre}>
            {JSON.stringify(health, null, 2)}
          </pre>
        </div>

        {/* AI STATUS */}
        <div style={styles.card}>
          <h2>🧠 AI Status</h2>
          <pre style={styles.pre}>
            {JSON.stringify(ai, null, 2)}
          </pre>
        </div>

        {/* LIVE STREAM */}
        <div style={styles.card}>
          <h2>⚡ Live Stream</h2>

          <div style={styles.streamBox}>

            {messages.length === 0 && (
              <div style={styles.empty}>
                Waiting for real-time data...
              </div>
            )}

            {messages.slice(-10).map((m, i) => (
              <div key={i} style={styles.logLine}>
                <span style={styles.tag}>
                  {m.type || "EVENT"}
                </span>
                <span>
                  {JSON.stringify(m)}
                </span>
              </div>
            ))}

          </div>

          {lastMessage && (
            <div style={styles.last}>
              <b>Last:</b> {JSON.stringify(lastMessage)}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

/* =========================
   STYLES (CLEAN DASHBOARD UI)
========================= */

const styles = {
  container: {
    padding: 20,
    fontFamily: "Arial",
    background: "#0b1220",
    color: "white",
    minHeight: "100vh",
  },

  header: {
    marginBottom: 20,
  },

  statusBar: {
    display: "flex",
    gap: 20,
    fontSize: 14,
    opacity: 0.8,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 15,
  },

  card: {
    background: "#111827",
    padding: 15,
    borderRadius: 10,
    border: "1px solid #1f2937",
    minHeight: 250,
  },

  pre: {
    fontSize: 12,
    color: "#d1d5db",
  },

  streamBox: {
    maxHeight: 180,
    overflowY: "auto",
    fontSize: 11,
    background: "#0f172a",
    padding: 10,
    borderRadius: 8,
  },

  logLine: {
    display: "flex",
    gap: 8,
    padding: "4px 0",
  },

  tag: {
    color: "#60a5fa",
    fontWeight: "bold",
  },

  empty: {
    opacity: 0.5,
  },

  last: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.7,
  },
};