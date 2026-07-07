import React, { useEffect, useState, useMemo } from "react";

export default function Header({ connected = false, onRefresh }) {

  /* =========================
     CLOCK ENGINE (OPTIMIZED)
  ========================= */
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = useMemo(() => {
    return time.toLocaleTimeString();
  }, [time]);

  /* =========================
     STATUS LOGIC
  ========================= */
  const statusClass = connected ? "online" : "offline";
  const statusText = connected ? "LIVE SYSTEM" : "OFFLINE";

  /* =========================
     UI
  ========================= */
  return (
    <header className="dashboard-header">

      {/* =========================
          LEFT BRAND
      ========================= */}
      <div className="header-left">

        <h1 className="logo">
          🚀 UniMentorAI
        </h1>

        <span className="subtitle">
          Control Center V7
        </span>

      </div>

      {/* =========================
          CENTER STATUS
      ========================= */}
      <div className="header-center">

        <div className={`status-pill ${statusClass}`}>

          <span className="dot" />

          <span>{statusText}</span>

        </div>

      </div>

      {/* =========================
          RIGHT ACTIONS
      ========================= */}
      <div className="header-right">

        <div className="clock">
          🕒 {formattedTime}
        </div>

        <button
          className="btn-refresh"
          onClick={() => onRefresh?.()}
        >
          🔄 Refresh
        </button>

      </div>

    </header>
  );
}