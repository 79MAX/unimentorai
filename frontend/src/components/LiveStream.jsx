import React, { useEffect, useRef, useState } from "react";

export default function LiveStream({
  url = "ws://localhost:3001",
  maxMessages = 60,
}) {
  const [status, setStatus] = useState("connecting");
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);
  const retry = useRef(0);
  const containerRef = useRef(null);

  /* =========================
     SAFE PUSH
  ========================= */
  const push = (msg) => {
    setMessages((prev) => {
      const updated = [...prev, msg];

      if (updated.length > maxMessages) {
        updated.splice(0, updated.length - maxMessages);
      }

      return updated;
    });
  };

  /* =========================
     AUTO SCROLL
  ========================= */
  const scroll = () => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop =
          containerRef.current.scrollHeight;
      }
    }, 50);
  };

  /* =========================
     FORMAT PACKETS V7
  ========================= */
  const format = (msg) => {
    if (!msg?.data) return "empty";

    const d = msg.data;

    // 🧠 AI STATUS
    if (d.ai) {
      return `🧠 AI ${d.ai.status.toUpperCase()} | ${d.ai.level} | score:${d.ai.score} | ${d.ai.action}`;
    }

    // 📊 METRICS
    if (d.metrics) {
      return `📊 CPU:${d.metrics.cpuLoad?.toFixed?.(2) || 0} | MEM:${d.metrics.heapUsedMB}MB | CLIENTS:${d.system?.clients}`;
    }

    // ⚠ LOGS
    if (d.logs) {
      return `📝 LOGS: ${d.logs.length} events`;
    }

    // SYSTEM
    if (msg.type === "SYSTEM" || d.system) {
      return `🚀 SYSTEM ONLINE | v${d.system?.version || "V7"} | uptime:${Math.floor(d.system?.uptime || 0)}s`;
    }

    return JSON.stringify(d);
  };

  /* =========================
     CONNECT WS
  ========================= */
  const connect = () => {
    setStatus("connecting");

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
      retry.current = 0;

      push({
        type: "SYSTEM",
        data: { message: "CONNECTED 🚀" },
      });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        push({
          type: data.type || "EVENT",
          data,
        });

        scroll();
      } catch {
        push({
          type: "RAW",
          data: event.data,
        });
      }
    };

    ws.onerror = () => {
      setStatus("error");
    };

    ws.onclose = () => {
      setStatus("disconnected");

      if (retry.current < 8) {
        retry.current++;

        setTimeout(() => {
          connect();
        }, retry.current * 1500);
      }
    };
  };

  /* =========================
     INIT
  ========================= */
  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  /* =========================
     STATUS COLOR
  ========================= */
  const color = () => {
    switch (status) {
      case "connected":
        return "#00ff88";
      case "connecting":
        return "#ffcc00";
      case "error":
        return "#ff4d4d";
      default:
        return "#888";
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="live-stream">

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          borderBottom: "1px solid #222",
          color: "#fff",
        }}
      >
        <span>⚡ Live Stream V7</span>

        <span style={{ color: color(), fontWeight: "bold" }}>
          {status.toUpperCase()}
        </span>
      </div>

      {/* STREAM */}
      <div
        ref={containerRef}
        style={{
          height: 320,
          overflowY: "auto",
          background: "#0b0f19",
          padding: 10,
          fontFamily: "monospace",
        }}
      >

        {messages.length === 0 && (
          <div style={{ color: "#666" }}>
            waiting stream...
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              padding: 6,
              borderBottom: "1px solid #1f1f1f",
            }}
          >

            <span style={{ color: "#00ff88" }}>
              [{m.type}]
            </span>

            <div style={{ color: "#ccc", fontSize: 12 }}>
              {format(m)}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}