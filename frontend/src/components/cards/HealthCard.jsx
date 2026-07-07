import React, { useMemo } from "react";

export default function HealthCard({ data = {} }) {

    /* =========================
       SAFE DATA
    ========================= */

    const status = data?.status || "unknown";
    const version = data?.version || "N/A";
    const clients = data?.clients ?? 0;
    const uptime = data?.uptime ?? 0;

    /* =========================
       STATUS INTELLIGENCE
    ========================= */

    const statusConfig = useMemo(() => {

        switch (status) {

            case "ok":
            case "stable":
                return {
                    label: "HEALTHY",
                    color: "#00ff88",
                    bg: "rgba(0,255,136,0.08)"
                };

            case "warning":
                return {
                    label: "DEGRADED",
                    color: "#ffcc00",
                    bg: "rgba(255,204,0,0.08)"
                };

            case "critical":
                return {
                    label: "CRITICAL",
                    color: "#ff4d4d",
                    bg: "rgba(255,77,77,0.08)"
                };

            default:
                return {
                    label: "UNKNOWN",
                    color: "#94a3b8",
                    bg: "rgba(148,163,184,0.08)"
                };
        }

    }, [status]);

    /* =========================
       UI
    ========================= */

    return (

        <div className="card health-card">

            {/* HEADER */}
            <h2>🟢 System Health</h2>

            {/* STATUS BADGE */}
            <div
                className="status-badge"
                style={{
                    background: statusConfig.bg,
                    border: `1px solid ${statusConfig.color}55`,
                    color: statusConfig.color
                }}
            >
                {statusConfig.label}
            </div>

            {/* METRICS */}
            <div className="health-grid">

                <div className="health-item">

                    <span className="label">Version</span>

                    <span className="value">
                        {version}
                    </span>

                </div>

                <div className="health-item">

                    <span className="label">Clients</span>

                    <span className="value">
                        {clients}
                    </span>

                </div>

                <div className="health-item">

                    <span className="label">Uptime</span>

                    <span className="value">
                        {Math.floor(uptime)}s
                    </span>

                </div>

            </div>

        </div>

    );

}