import React, { useEffect, useState, useMemo } from "react";
import AdminRealtimeDashboard from "./AdminRealtimeDashboard";
import RealtimeAdminDashboard from "./RealtimeAdminDashboard.screen";

export default function ControlCenterV2() {
  const [view, setView] = useState("overview");
  const [metrics, setMetrics] = useState({
    users: 0,
    requests: 0,
    errors: 0,
    uptime: 100,
  });

  // Simulation realtime (remplaçable par WebSocket plus tard)
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        users: prev.users + Math.floor(Math.random() * 3),
        requests: prev.requests + Math.floor(Math.random() * 15),
        errors: Math.max(0, Math.floor(Math.random() * 2)),
        uptime: 95 + Math.random() * 5,
      }));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const cards = useMemo(
    () => [
      { title: "Users", value: metrics.users },
      { title: "Requests", value: metrics.requests },
      { title: "Errors", value: metrics.errors },
      { title: "Uptime (%)", value: metrics.uptime.toFixed(2) },
    ],
    [metrics]
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1>Control Center V2</h1>
          <p style={styles.subtitle}>AI Ops • Realtime • Monitoring</p>
        </div>

        <nav style={styles.tabs}>
          <Tab active={view === "overview"} onClick={() => setView("overview")}>
            Overview
          </Tab>
          <Tab active={view === "realtime"} onClick={() => setView("realtime")}>
            Realtime
          </Tab>
          <Tab active={view === "logs"} onClick={() => setView("logs")}>
            Logs
          </Tab>
        </nav>
      </header>

      {view === "overview" && (
        <section style={styles.grid}>
          {cards.map((c) => (
            <Card key={c.title} title={c.title} value={c.value} />
          ))}
        </section>
      )}

      {view === "realtime" && <AdminRealtimeDashboard />}

      {view === "logs" && <RealtimeAdminDashboard />}
    </div>
  );
}

/* ---------- UI COMPONENTS ---------- */

function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardValue}>{value}</p>
    </div>
  );
}

function Tab({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.tab,
        background: active ? "#4f46e5" : "#111827",
        color: active ? "white" : "#9ca3af",
      }}
    >
      {children}
    </button>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  container: {
    padding: 24,
    fontFamily: "system-ui",
    background: "#0b0f19",
    minHeight: "100vh",
    color: "white",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  subtitle: {
    margin: 0,
    fontSize: 12,
    color: "#9ca3af",
  },

  tabs: {
    display: "flex",
    gap: 10,
  },

  tab: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "1px solid #1f2937",
    cursor: "pointer",
    transition: "0.2s",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
  },

  card: {
    padding: 20,
    borderRadius: 12,
    background: "#111827",
    border: "1px solid #1f2937",
  },

  cardTitle: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 8,
  },

  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
};