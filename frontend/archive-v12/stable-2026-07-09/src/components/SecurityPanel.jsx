import React, { useMemo } from "react";

export default function SecurityPanel({ data }) {

  /* =========================
     SAFE DEFAULTS
  ========================= */
  const security = useMemo(() => ({
    risk: data?.risk ?? 0,
    status: data?.status ?? "secure",
    threats: data?.threats ?? [],
    anomalies: data?.anomalies ?? [],
    level: data?.level ?? "P3"
  }), [data]);

  /* =========================
     RISK ENGINE (SOC STYLE)
  ========================= */
  const config = useMemo(() => {

    const risk = security.risk;

    if (risk > 80) {
      return {
        label: "CRITICAL THREAT",
        color: "#ff4d4d",
        glow: "0 0 25px rgba(255,77,77,0.4)",
        status: "P0"
      };
    }

    if (risk > 50) {
      return {
        label: "HIGH RISK",
        color: "#ffcc00",
        glow: "0 0 25px rgba(255,204,0,0.3)",
        status: "P1"
      };
    }

    if (risk > 20) {
      return {
        label: "ELEVATED",
        color: "#3B82F6",
        glow: "0 0 25px rgba(59,130,246,0.25)",
        status: "P2"
      };
    }

    return {
      label: "SECURE",
      color: "#00ff88",
      glow: "0 0 25px rgba(0,255,136,0.2)",
      status: "P3"
    };

  }, [security.risk]);

  /* =========================
     UI
  ========================= */
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${config.color}33`,
        borderRadius: 16,
        padding: 18,
        position: "relative",
        overflow: "hidden",
        boxShadow: config.glow,
        transition: "0.25s ease"
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
        <h3 style={{ color: "white", margin: 0 }}>
          🔐 SECURITY INTELLIGENCE
        </h3>

        <span style={{
          fontSize: 11,
          padding: "4px 10px",
          borderRadius: 20,
          background: config.color,
          color: "#000",
          fontWeight: "bold"
        }}>
          {config.label}
        </span>
      </div>

      {/* RISK SCORE */}
      <div style={{ marginTop: 15 }}>
        <div style={{
          fontSize: 44,
          fontWeight: "bold",
          color: config.color
        }}>
          {security.risk}
        </div>

        <div style={{
          fontSize: 12,
          color: "#94A3B8"
        }}>
          Threat Risk Score
        </div>
      </div>

      {/* THREATS SECTION */}
      <div style={{ marginTop: 15 }}>
        <div style={{
          fontSize: 11,
          color: "#6b7280",
          marginBottom: 6
        }}>
          DETECTED THREATS
        </div>

        {security.threats.length === 0 ? (
          <div style={{
            fontSize: 12,
            color: "#6b7280"
          }}>
            No active threats detected
          </div>
        ) : (
          security.threats.map((t, i) => (
            <div
              key={i}
              style={{
                padding: "6px 8px",
                marginBottom: 6,
                borderRadius: 8,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,204,0,0.2)",
                color: "#ffcc00",
                fontSize: 12
              }}
            >
              ⚠ {t}
            </div>
          ))
        )}
      </div>

      {/* ANOMALIES SECTION */}
      <div style={{ marginTop: 15 }}>
        <div style={{
          fontSize: 11,
          color: "#6b7280",
          marginBottom: 6
        }}>
          SYSTEM ANOMALIES
        </div>

        {security.anomalies.length === 0 ? (
          <div style={{
            fontSize: 12,
            color: "#6b7280"
          }}>
            System stable
          </div>
        ) : (
          security.anomalies.map((a, i) => (
            <div
              key={i}
              style={{
                padding: "6px 8px",
                marginBottom: 6,
                borderRadius: 8,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(59,130,246,0.2)",
                color: "#3B82F6",
                fontSize: 12
              }}
            >
              🧠 {a}
            </div>
          ))
        )}
      </div>

      {/* FOOTER ENGINE */}
      <div style={{
        marginTop: 15,
        padding: 10,
        borderRadius: 10,
        background: "rgba(0,0,0,0.3)",
        border: `1px solid ${config.color}22`
      }}>
        <div style={{
          fontSize: 10,
          color: "#6b7280"
        }}>
          SECURITY ENGINE STATUS
        </div>

        <div style={{
          fontSize: 13,
          color: config.color,
          fontWeight: "bold"
        }}>
          {config.status} • REALTIME MONITORING ACTIVE
        </div>
      </div>

    </div>
  );
}