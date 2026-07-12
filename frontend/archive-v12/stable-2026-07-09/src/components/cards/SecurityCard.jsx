import React, { useMemo } from "react";

export default function SecurityCard({ data = {} }) {

    /* =========================
       SAFE DATA
    ========================= */

    const risk = data?.risk ?? 0;
    const threats = data?.threats || [];
    const anomalies = data?.anomalies || [];
    const level = data?.level || "P3";

    /* =========================
       RISK INTELLIGENCE ENGINE
    ========================= */

    const config = useMemo(() => {

        if (risk >= 80) {
            return {
                label: "CRITICAL THREAT",
                color: "#ff4d4d",
                bg: "rgba(255,77,77,0.08)",
                glow: "0 0 25px rgba(255,77,77,0.3)"
            };
        }

        if (risk >= 50) {
            return {
                label: "HIGH RISK",
                color: "#ffcc00",
                bg: "rgba(255,204,0,0.08)",
                glow: "0 0 25px rgba(255,204,0,0.25)"
            };
        }

        if (risk >= 20) {
            return {
                label: "ELEVATED",
                color: "#3B82F6",
                bg: "rgba(59,130,246,0.08)",
                glow: "0 0 25px rgba(59,130,246,0.2)"
            };
        }

        return {
            label: "SECURE",
            color: "#00ff88",
            bg: "rgba(0,255,136,0.08)",
            glow: "0 0 25px rgba(0,255,136,0.2)"
        };

    }, [risk]);

    /* =========================
       UI
    ========================= */

    return (

        <div className="card security-card">

            {/* HEADER */}
            <h2>🔐 Security Intelligence</h2>

            {/* RISK SCORE */}
            <div className="security-risk">

                <div
                    className="risk-value"
                    style={{
                        color: config.color,
                        textShadow: config.glow
                    }}
                >
                    {risk}
                </div>

                <div className="risk-label">
                    Risk Score
                </div>

                <div
                    className="risk-status"
                    style={{
                        background: config.bg,
                        border: `1px solid ${config.color}55`,
                        color: config.color
                    }}
                >
                    {config.label}
                </div>

            </div>

            {/* LEVEL */}
            <div className="security-meta">

                <span className="label">Level</span>

                <span className="value">{level}</span>

            </div>

            {/* THREATS */}
            <div className="security-section">

                <h4>⚠ Threats</h4>

                {threats.length === 0 ? (

                    <div className="empty-state">
                        No threats detected
                    </div>

                ) : (

                    threats.map((t, i) => (

                        <div key={i} className="security-item threat">

                            ● {t.msg || t}

                        </div>

                    ))

                )}

            </div>

            {/* ANOMALIES */}
            <div className="security-section">

                <h4>🧬 Anomalies</h4>

                {anomalies.length === 0 ? (

                    <div className="empty-state">
                        No anomalies detected
                    </div>

                ) : (

                    anomalies.map((a, i) => (

                        <div key={i} className="security-item anomaly">

                            ⚡ {a.msg || a}

                        </div>

                    ))

                )}

            </div>

        </div>

    );

}