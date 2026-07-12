import React, { useMemo } from "react";

export default function LogsCard({ logs = [] }) {

    /* =========================
       SAFE LOGS
    ========================= */

    const safeLogs = useMemo(() => {
        if (!Array.isArray(logs)) return [];
        return logs.slice(-10).reverse(); // latest first
    }, [logs]);

    /* =========================
       LOG COLOR ENGINE
    ========================= */

    const getLogStyle = (level) => {

        switch (level) {

            case "error":
                return {
                    color: "#ff4d4d",
                    glow: "0 0 10px rgba(255,77,77,0.25)",
                    icon: "⛔"
                };

            case "warn":
                return {
                    color: "#ffcc00",
                    glow: "0 0 10px rgba(255,204,0,0.25)",
                    icon: "⚠️"
                };

            case "debug":
                return {
                    color: "#60a5fa",
                    glow: "0 0 10px rgba(96,165,250,0.25)",
                    icon: "🐞"
                };

            default:
                return {
                    color: "#22c55e",
                    glow: "0 0 10px rgba(34,197,94,0.2)",
                    icon: "ℹ️"
                };
        }
    };

    /* =========================
       UI
    ========================= */

    return (

        <div className="card logs-card">

            {/* HEADER */}
            <h2>📜 Log Intelligence</h2>

            {/* CONSOLE */}
            <div className="logs-console">

                {safeLogs.length === 0 ? (

                    <div className="empty-state">
                        No logs available
                    </div>

                ) : (

                    safeLogs.map((log, i) => {

                        const style = getLogStyle(log.level);

                        return (

                            <div
                                key={i}
                                className="log-line"
                                style={{
                                    borderLeft: `2px solid ${style.color}`,
                                    boxShadow: style.glow
                                }}
                            >

                                {/* ICON */}
                                <span
                                    className="log-icon"
                                    style={{ color: style.color }}
                                >
                                    {style.icon}
                                </span>

                                {/* LEVEL */}
                                <span
                                    className="log-level"
                                    style={{ color: style.color }}
                                >
                                    {log.level?.toUpperCase() || "INFO"}
                                </span>

                                {/* MESSAGE */}
                                <span className="log-message">
                                    {log.msg || "No message"}
                                </span>

                                {/* TIMESTAMP */}
                                {log.timestamp && (
                                    <span className="log-time">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                    </span>
                                )}

                            </div>

                        );

                    })

                )}

            </div>

        </div>

    );

}