import React, { useEffect, useRef } from "react";

export default function LogsPanel({
  logs = [],
  maxLogs = 50,
}) {

  const containerRef = useRef(null);

  // AUTO SCROLL ONLY WHEN NEW LOG ARRIVES
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLevelClass = (level) => {
    switch (level) {
      case "error":
        return "log-error";
      case "warn":
        return "log-warn";
      case "debug":
        return "log-debug";
      default:
        return "log-info";
    }
  };

  const displayedLogs = logs.slice(-maxLogs);

  return (
    <div className="logs-panel">

      {/* HEADER */}
      <div className="logs-header">
        <span>📜 System Logs</span>
        <span className="logs-count">
          {displayedLogs.length}
        </span>
      </div>

      {/* LOG STREAM */}
      <div
        className="logs-container"
        ref={containerRef}
      >

        {displayedLogs.length === 0 && (
          <div className="logs-empty">
            No logs available...
          </div>
        )}

        {displayedLogs.map((log, index) => (
          <div
            key={index}
            className={`log-line ${getLevelClass(log.level)}`}
          >

            <span className="log-level">
              [{log.level?.toUpperCase() || "INFO"}]
            </span>

            <span className="log-message">
              {log.message}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}