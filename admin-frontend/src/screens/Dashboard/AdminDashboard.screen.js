import React, { useEffect, useState } from "react";
import AdminRealtimeDashboard from "./AdminRealtimeDashboard";
import RealtimeAdminDashboard from "./RealtimeAdminDashboard.screen";

export default function AdminDashboardPro() {
  const [view, setView] = useState("overview");
  const [metrics, setMetrics] = useState({
    users: 0,
    requests: 0,
    errors: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        users: prev.users + Math.floor(Math.random() * 5),
        requests: prev.requests + Math.floor(Math.random() * 20),
        errors: Math.floor(Math.random() * 3),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Admin Dashboard PRO</h1>

        <div style={styles.tabs}>
          <button onClick={() => setView("overview")}>Overview</button>
          <button onClick={() => setView("realtime")}>Realtime</button>
          <button onClick={() => setView("logs")}>Logs</button>
        </div>
      </header>

      {view === "overview" && (
        <section style={styles.grid}>
          <Card title="Users" value={metrics.users} />
          <Card title="Requests" value={metrics.requests} />
          <Card title="Errors" value={metrics.errors} />
        </section>
      )}

      {view === "realtime" && <AdminRealtimeDashboard />}
      {view === "logs" && <RealtimeAdminDashboard />}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    fontFamily: "system-ui",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  tabs: {
    display: "flex",
    gap: 10,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 15,
  },
  card: {
    padding: 20,
    borderRadius: 10,
    background: "#111827",
    color: "white",
  },
};
