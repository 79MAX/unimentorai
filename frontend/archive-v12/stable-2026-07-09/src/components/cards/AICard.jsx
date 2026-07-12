import React, { useMemo } from "react";

export default function AICard({ data = {} }) {

    /* =========================
       SAFE DATA
    ========================= */

    const status = data?.status || "unknown";
    const level = data?.level || "N/A";
    const score = data?.score ?? 0;
    const action = data?.action || "NO_ACTION";

    /* =========================
       AI STATUS INTELLIGENCE
    ========================= */

    const config = useMemo(() => {

        switch (status) {

            case "stable":
                return {
                    label: "STABLE",
                    color: "#00ff88",
                    bg: "rgba(0,255,136,0.08)",
                    glow: "0 0 20px rgba(0,255,136,0.2)"
                };

            case "warning":
                return {
                    label: "WARNING",
                    color: "#ffcc00",
                    bg: "rgba(255,204,0,0.08)",
                    glow: "0 0 20px rgba(255,204,0,0.2)"
                };

            case "critical":
                return {
                    label: "CRITICAL",
                    color: "#ff4d4d",
                    bg: "rgba(255,77,77,0.08)",
                    glow: "0 0 20px rgba(255,77,77,0.25)"
                };

            default:
                return {
                    label: "UNKNOWN",
                    color: "#94a3b8",
                    bg: "rgba(148,163,184,0.08)",
                    glow: "0 0 20px rgba(148,163,184,0.15)"
                };

        }

    }, [status]);

    /* =========================
       UI
    ========================= */

    return (

        <div className="card ai-card">

            {/* HEADER */}
            <h2>🧠 AI Engine</h2>

            {/* STATUS BADGE */}
            <div
                className="ai-status-badge"
                style={{
                    background: config.bg,
                    border: `1px solid ${config.color}55`,
                    color: config.color,
                    boxShadow: config.glow
                }}
            >
                {config.label}
            </div>

            {/* METRICS GRID */}
            <div className="ai-grid">

                <div className="ai-item">

                    <span className="label">Level</span>

                    <span className="value">
                        {level}
                    </span>

                </div>

                <div className="ai-item">

                    <span className="label">Score</span>

                    <span className="value">
                        {score}
                    </span>

                </div>

                <div className="ai-item">

                    <span className="label">Action</span>

                    <span className="value action-text">
                        {action}
                    </span>

                </div>

            </div>

        </div>

    );

}