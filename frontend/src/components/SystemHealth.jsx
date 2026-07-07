import React, { useMemo } from "react";

export default function SystemHealth({ data }) {

  const status = data?.status || "unknown";

  const metrics = useMemo(() => {
    if (!data) return [];

    return [
      { label: "Status", value: data.status },
      { label: "Level", value: data.level },
      { label: "Action", value: data.action },
      { label: "Score", value: data.score ?? "N/A" },
    ];

  }, [data]);

  const getStatusClass = () => {
    switch (status) {
      case "stable":
        return "health-stable";
      case "warning":
        return "health-warning";
      case "critical":
        return "health-critical";
      default:
        return "health-unknown";
    }
  };

  return (
    <div className="system-health">

      {/* HEADER */}
      <div className="health-header">

        <span>🧠 System Health</span>

        <span className={`health-status ${getStatusClass()}`}>
          {status.toUpperCase()}
        </span>

      </div>

      {/* METRICS GRID */}
      <div className="health-grid">

        {metrics.map((m, i) => (
          <div key={i} className="health-card">

            <div className="health-label">
              {m.label}
            </div>

            <div className="health-value">
              {m.value}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}