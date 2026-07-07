import React, { useMemo } from "react";

export default function MetricCard({
    title,
    value,
    icon = "📊",
    color = "#3B82F6",
    trend = "stable"
}) {

    /* =========================
       TREND ENGINE
    ========================= */

    const trendConfig = useMemo(() => {

        switch (trend) {

            case "up":
                return {
                    label: "INCREASING",
                    color: "#ff4d4d",
                    arrow: "↗"
                };

            case "down":
                return {
                    label: "DECREASING",
                    color: "#00ff88",
                    arrow: "↘"
                };

            default:
                return {
                    label: "STABLE",
                    color: "#94a3b8",
                    arrow: "→"
                };
        }

    }, [trend]);

    /* =========================
       VALUE NORMALIZATION
    ========================= */

    const displayValue = useMemo(() => {

        if (value === null || value === undefined) return "N/A";

        if (typeof value === "number") {

            if (value > 1000) {
                return value.toLocaleString();
            }

            return value;

        }

        return value;

    }, [value]);

    /* =========================
       UI
    ========================= */

    return (

        <div
            className="card metric-card"
            style={{
                border: `1px solid ${color}33`,
                boxShadow: `0 0 20px ${color}22`
            }}
        >

            {/* HEADER */}
            <div className="metric-header">

                <span className="metric-icon">
                    {icon}
                </span>

                <h3 className="metric-title">
                    {title}
                </h3>

            </div>

            {/* VALUE */}
            <div
                className="metric-value"
                style={{ color }}
            >
                {displayValue}
            </div>

            {/* TREND */}
            <div className="metric-trend">

                <span
                    className="trend-arrow"
                    style={{ color: trendConfig.color }}
                >
                    {trendConfig.arrow}
                </span>

                <span className="trend-label">
                    {trendConfig.label}
                </span>

            </div>

        </div>

    );

}