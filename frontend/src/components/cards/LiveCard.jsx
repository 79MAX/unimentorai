import React, { useMemo } from "react";

export default function LiveCard({ data = {} }) {

    /* =========================
       SAFE DATA
    ========================= */

    const metrics = data?.metrics || {};
    const logs = data?.logs || [];

    const lastLog = useMemo(() => {

        if (!logs.length) return null;

        return logs[logs.length - 1];

    }, [logs]);

    /* =========================
       UI STATUS COLOR
    ========================= */

    const statusColor = useMemo(() => {

        if (metrics.cpuLoad > 70) return "#ff4d4d";
        if (metrics.cpuLoad > 40) return "#ffcc00";

        return "#00ff88";

    }, [metrics.cpuLoad]);

    /* =========================
       UI
    ========================= */

    return (

        <div className="card live-card">

            {/* HEADER */}
            <h2>⚡ Live Stream</h2>

            {/* METRICS QUICK VIEW */}
            <div className="live-metrics">

                <div className="live-item">
                    <span className="label">CPU</span>
                    <span style={{ color: statusColor }}>
                        {metrics.cpuLoad ?? 0}%
                    </span>
                </div>

                <div className="live-item">
                    <span className="label">Memory</span>
                    <span>
                        {metrics.heapUsedMB ?? 0} MB
                    </span>
                </div>

                <div className="live-item">
                    <span className="label">Clients</span>
                    <span>
                        {metrics.clients ?? 0}
                    </span>
                </div>

                <div className="live-item">
                    <span className="label">Uptime</span>
                    <span>
                        {Math.floor(metrics.uptime ?? 0)}s
                    </span>
                </div>

            </div>

            {/* LAST EVENT */}
            <div className="last-event">

                <h4>Last Event</h4>

                {lastLog ? (

                    <div className={`log-line ${lastLog.level}`}>

                        <span className="dot">●</span>

                        <span className="level">
                            {lastLog.level}
                        </span>

                        <span className="msg">
                            {lastLog.msg}
                        </span>

                    </div>

                ) : (

                    <div className="empty-state">
                        No live events
                    </div>

                )}

            </div>

        </div>

    );

}