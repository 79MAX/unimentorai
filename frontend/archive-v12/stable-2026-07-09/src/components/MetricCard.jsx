import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";

function MetricCard({
  title,
  value,
  subtitle = "",
  icon = "📊",
  color = "#3B82F6",
  trend = null,
  loading = false,
  onClick,
}) {

  /* =========================
     TREND COLOR (OPTIMIZED)
  ========================= */
  const trendColor = useMemo(() => {
    if (trend === "up") return "#22C55E";
    if (trend === "down") return "#EF4444";
    return "#94A3B8";
  }, [trend]);

  /* =========================
     CARD STYLE BASE
  ========================= */
  const cardStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid #1f2937",
    borderLeft: `4px solid ${color}`,
    borderRadius: 14,
    padding: 16,
    transition: "0.25s ease",
    cursor: onClick ? "pointer" : "default",
    position: "relative",
    overflow: "hidden",
  };

  return (
    <div
      className="metric-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      style={cardStyle}

      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 10px 30px ${color}33`;
      }}

      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >

      {/* GLOW EFFECT */}
      <div style={{
        position: "absolute",
        top: -30,
        right: -30,
        width: 80,
        height: 80,
        background: color,
        filter: "blur(60px)",
        opacity: 0.15
      }} />

      {/* LOADING STATE */}
      {loading ? (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10
        }}>
          <div style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            border: "2px solid #1f2937",
            borderTop: `2px solid ${color}`,
            animation: "spin 1s linear infinite"
          }} />
          <span style={{ color: "#94A3B8", fontSize: 12 }}>
            Loading...
          </span>
        </div>
      ) : (
        <>
          {/* HEADER */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span style={{ fontSize: 18 }}>{icon}</span>

            <span style={{
              fontSize: 12,
              color: "#94A3B8"
            }}>
              {title}
            </span>
          </div>

          {/* VALUE */}
          <div style={{
            fontSize: 26,
            fontWeight: "bold",
            marginTop: 10,
            color: color
          }}>
            {value}
          </div>

          {/* SUBTITLE */}
          {subtitle && (
            <div style={{
              fontSize: 12,
              color: "#6b7280",
              marginTop: 4
            }}>
              {subtitle}
            </div>
          )}

          {/* TREND */}
          {trend && (
            <div style={{
              marginTop: 8,
              fontSize: 12,
              color: trendColor,
              fontWeight: 500
            }}>
              {trend === "up" && "▲ Increasing"}
              {trend === "down" && "▼ Decreasing"}
              {trend === "stable" && "● Stable"}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* =========================
   PROP TYPES
========================= */
MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  subtitle: PropTypes.string,
  icon: PropTypes.node,
  color: PropTypes.string,
  trend: PropTypes.oneOf(["up", "down", "stable"]),
  loading: PropTypes.bool,
  onClick: PropTypes.func,
};

export default memo(MetricCard);