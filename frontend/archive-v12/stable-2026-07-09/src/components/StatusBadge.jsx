import React from "react";

export default function StatusBadge({
  connected = false,
  labelConnected = "LIVE",
  labelDisconnected = "OFFLINE"
}) {

  const statusClass = connected ? "status-online" : "status-offline";

  return (
    <div className={`status-badge ${statusClass}`}>

      <span className="status-dot"></span>

      <span className="status-text">
        {connected ? labelConnected : labelDisconnected}
      </span>

    </div>
  );
}