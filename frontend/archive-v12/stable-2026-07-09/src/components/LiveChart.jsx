import React, { useEffect, useRef, useState, useMemo } from "react";

export default function LiveChart({
  data = null,
  label = "Metric",
  color = "#3B82F6",
  maxPoints = 25,
}) {

  const [points, setPoints] = useState([]);
  const lastValueRef = useRef(null);

  /* =========================
     UPDATE STREAM
  ========================= */
  useEffect(() => {
    if (!data) return;

    const value =
      typeof data === "number"
        ? data
        : parseFloat(data?.value ?? data ?? 0);

    if (isNaN(value)) return;

    // avoid duplicate spikes
    if (lastValueRef.current === value) return;

    lastValueRef.current = value;

    setPoints((prev) => {
      const updated = [...prev, value];

      if (updated.length > maxPoints) {
        updated.splice(0, updated.length - maxPoints);
      }

      return updated;
    });

  }, [data, maxPoints]);

  /* =========================
     SAFE MIN / MAX
  ========================= */
  const { min, max, last } = useMemo(() => {
    const min = Math.min(...points, 0);
    const max = Math.max(...points, 1);
    const last = points[points.length - 1] ?? 0;

    return { min, max, last };
  }, [points]);

  /* =========================
     HEIGHT CALC SAFE
  ========================= */
  const getHeight = (p) => {
    const range = max - min || 1;
    return ((p - min) / range) * 100;
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid #1f2937",
        borderRadius: 14,
        padding: 16,
        overflow: "hidden",
        position: "relative",
      }}
    >

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 12,
        alignItems: "center"
      }}>
        <span style={{
          color: "#cbd5e1",
          fontSize: 13
        }}>
          {label}
        </span>

        <span style={{
          color,
          fontSize: 14,
          fontWeight: "bold"
        }}>
          {last}
        </span>
      </div>

      {/* GRID BACKGROUND */}
      <div style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(to top, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "100% 20%",
        pointerEvents: "none",
        opacity: 0.3
      }} />

      {/* CHART */}
      <div style={{
        height: 120,
        display: "flex",
        alignItems: "flex-end",
        gap: 3,
        position: "relative",
        zIndex: 2
      }}>

        {points.map((p, i) => {
          const height = getHeight(p);
          const isLast = i === points.length - 1;

          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${height}%`,
                background: isLast
                  ? color
                  : `${color}80`,
                borderRadius: 4,
                transition: "all 0.3s ease",
                boxShadow: isLast
                  ? `0 0 10px ${color}`
                  : "none"
              }}
            />
          );
        })}

      </div>
    </div>
  );
}