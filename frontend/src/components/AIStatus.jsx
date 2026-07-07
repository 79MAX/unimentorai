import React, { useMemo } from "react";

export default function AIStatus({ data }) {

  /* =========================
     SAFE NORMALIZATION
  ========================= */
  const status = data?.status || "unknown";
  const level = data?.level || "N/A";
  const score = data?.score ?? 0;
  const action = data?.action || "NO_ACTION";

  /* =========================
     INTELLIGENCE COLOR ENGINE
  ========================= */
  const config = useMemo(() => {

    switch (status) {
      case "stable":
        return {
          label: "STABLE",
          color: "#00ff88",
          glow: "0 0 20px rgba(0,255,136,0.3)"
        };

      case "warning":
        return {
          label: "WARNING",
          color: "#ffcc00",
          glow: "0 0 20px rgba(255,204,0,0.3)"
        };

      case "critical":
        return {
          label: "CRITICAL",
          color: "#ff4d4d",
          glow: "0 0 20px rgba(255,77,77,0.4)"
        };

      default:
        return {
          label: "UNKNOWN",
          color: "#94A3B8",
          glow: "none"
        };
    }

  }, [status]);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${config.color}33`,
        borderRadius: 16,
        padding: 18,
        position: "relative",
        overflow: "hidden",
        transition: "0.25s ease",
        boxShadow: config.glow
      }}

      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
      }}

      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
      }}
    >

      {/* GLOW ORB */}
      <div style={{
        position: "absolute",
        top: -40,
        right: -40,
        width: 120,
        height: 120,
        background: config.color,
        filter: "blur(70px)",
        opacity: 0.15
      }} />

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>

        <div style={{
          color: "white",
          fontWeight: "bold"
        }}>
          🧠 AI ENGINE STATUS
        </div>

        <div style={{
          padding: "4px 10px",
          borderRadius: 20,
          background: config.color,
          color: "#000",
          fontSize: 11,
          fontWeight: "bold",
          letterSpacing: 1
        }}>
          {config.label}
        </div>

      </div>

      {/* CORE METRICS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 10,
        marginTop: 15
      }}>

        <div style={cardStyle(config.color)}>
          <div style={labelStyle}>LEVEL</div>
          <div style={valueStyle(config.color)}>{level}</div>
        </div>

        <div style={cardStyle(config.color)}>
          <div style={labelStyle}>SCORE</div>
          <div style={valueStyle(config.color)}>{score}</div>
        </div>

        <div style={cardStyle(config.color)}>
          <div style={labelStyle}>STATUS</div>
          <div style={valueStyle(config.color)}>
            {status.toUpperCase()}
          </div>
        </div>

      </div>

      {/* ACTION ENGINE (IMPORTANT IA BLOCK) */}
      <div style={{
        marginTop: 15,
        padding: 12,
        borderRadius: 12,
        background: "rgba(0,0,0,0.3)",
        border: `1px solid ${config.color}22`
      }}>

        <div style={{
          fontSize: 10,
          color: "#6b7280",
          marginBottom: 5
        }}>
          AI DECISION ENGINE
        </div>

        <div style={{
          fontSize: 13,
          color: config.color,
          fontWeight: 500
        }}>
          {action}
        </div>

      </div>

      {/* PULSE DOT */}
      <div style={{
        position: "absolute",
        top: 10,
        left: 10,
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: config.color,
        boxShadow: `0 0 10px ${config.color}`,
        animation: "pulse 1.5s infinite"
      }} />

    </div>
  );
}

/* =========================
   STYLES HELPERS
========================= */
const cardStyle = (color) => ({
  background: "rgba(255,255,255,0.02)",
  border: `1px solid ${color}22`,
  borderRadius: 10,
  padding: 10,
  textAlign: "center"
});

const labelStyle = {
  fontSize: 10,
  color: "#6b7280",
  marginBottom: 5
};

const valueStyle = (color) => ({
  fontSize: 14,
  fontWeight: "bold",
  color
});