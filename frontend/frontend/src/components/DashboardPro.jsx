import { useEffect, useRef, useState } from "react";
import { getWS, getWSState } from "../services/ws.engine";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

/* =========================
   CHART INIT (ONE TIME)
========================= */
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

/* =========================
   DASHBOARD PRO OPTIMIZED
========================= */
export default function DashboardPro() {
  const [state, setState] = useState(getWSState());
  const [metrics, setMetrics] = useState(null);

  const wsRef = useRef(null);
  const intervalRef = useRef(null);

  // DATA STORAGE (NO RE-RENDER TRIGGER)
  const labelsRef = useRef([]);
  const cpuRef = useRef([]);
  const ramRef = useRef([]);

  /* =========================
     INIT WS
  ========================= */
  useEffect(() => {
    const ws = getWS();
    wsRef.current = ws;

    const handleMessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg?.type !== "METRICS") return;

        const data = msg.data || {};
        setMetrics(data);

        const now = new Date().toLocaleTimeString();

        labelsRef.current.push(now);
        cpuRef.current.push(Number(data.cpu) || 0);
        ramRef.current.push(Number(data.ramMB) || 0);

        // LIMIT MEMORY
        if (labelsRef.current.length > 30) {
          labelsRef.current.shift();
          cpuRef.current.shift();
          ramRef.current.shift();
        }
      } catch (e) {
        console.warn("[WS PARSE ERROR]", e);
      }
    };

    ws.addEventListener("message", handleMessage);

    // STATE REFRESH (LIGHTWEIGHT)
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

  /* =========================
     CHART DATA (MEMO SAFE)
  ========================= */
  const chartData = {
    labels: labelsRef.current,
    datasets: [
      {
        label: "CPU",
        data: cpuRef.current,
        borderColor: "#4ade80",
        tension: 0.3,
      },
      {
        label: "RAM (MB)",
        data: ramRef.current,
        borderColor: "#60a5fa",
        tension: 0.3,
      },
    ],
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚀 UniMentorAI Dashboard Pro</h1>

      {/* STATUS */}
      <div style={styles.grid}>
        <Card title="Status">
          <span style={{ color: state.connected ? "#4ade80" : "#ef4444" }}>
            {state.connected ? "🟢 ONLINE" : "🔴 OFFLINE"}
          </span>
        </Card>

        <Card title="Client ID">
          {state.clientId || "..."}
        </Card>

        <Card title="Retry">
          {state.retry}
        </Card>

        <Card title="Clients">
          {metrics?.clients ?? 0}
        </Card>
      </div>

      {/* CHART */}
      <div style={styles.chartCard}>
        <h3>📊 Live Performance</h3>
        <Line data={chartData} />
      </div>

      {/* RAW DEBUG */}
      <div style={styles.card}>
        <h3>Raw Metrics</h3>
        <pre style={{ fontSize: 12 }}>
          {JSON.stringify(metrics, null, 2)}
        </pre>
      </div>
    </div>
  );
}

/* =========================
   SMALL COMPONENT (OPTIMIZATION)
========================= */
function Card({ title, children }) {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
}

/* =========================
   STYLES
========================= */
const styles = {
  container: {
    fontFamily: "system-ui",
    padding: 20,
    background: "#0b0f19",
    color: "#fff",
    minHeight: "100vh",
  },
  title: {
    marginBottom: 20,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
  },
  card: {
    background: "#111827",
    padding: 15,
    borderRadius: 12,
    border: "1px solid #1f2937",
  },
  chartCard: {
    marginTop: 15,
    background: "#111827",
    padding: 20,
    borderRadius: 12,
    border: "1px solid #1f2937",
  },
};