
import React, { useMemo } from "react"

// ======================================
// 🧠 AI AVATAR SYSTEM
// UniMentorAI - CONTEXTUAL IDENTITY ENGINE
// ======================================

export function Avatar({

  src,

  name,

  status = "idle", // idle | online | thinking | streaming | offline

  size = 40,

  showStatus = true,

  glow = false

}) {

  // ======================================
  // 🎯 STATUS ENGINE
  // ======================================

  const statusConfig =
    useMemo(() => {

      switch (status) {

        case "online":
          return {
            color: "#00ff88",
            label: "Online"
          }

        case "thinking":
          return {
            color: "#00f0ff",
            label: "AI thinking..."
          }

        case "streaming":
          return {
            color: "#6c5ce7",
            label: "Live stream"
          }

        case "offline":
          return {
            color: "#666",
            label: "Offline"
          }

        default:
          return {
            color: "#999",
            label: "Idle"
          }
      }

    }, [status])

  // ======================================
  // 🎨 DYNAMIC STYLE ENGINE
  // ======================================

  const style =
    useMemo(() => ({

      width: size,

      height: size,

      borderRadius: "50%",

      position: "relative",

      overflow: "hidden",

      transition: "all 0.3s ease",

      boxShadow:

        glow
          ? `0 0 12px ${statusConfig.color}`
          : "none"

    }), [size, glow, statusConfig])

  // ======================================
  // 🚀 RENDER
  // ======================================

  return (

    <div className="avatar-wrapper">

      {/* ================================== */}
      {/* 🧠 AVATAR CORE */}
      {/* ================================== */}

      <div
        className={`avatar ${status}`}
        style={style}
      >

        {/* IMAGE OR FALLBACK */}

        {src ? (

          <img
            src={src}
            alt={name}
            className="avatar-image"
          />

        ) : (

          <div className="avatar-fallback">

            {name?.charAt(0) || "?"}

          </div>

        )}

        {/* ================================== */}
        {/* ⚡ STATUS DOT */}
        {/* ================================== */}

        {showStatus && (

          <span
            className="status-dot"
            style={{
              background: statusConfig.color
            }}
          />

        )}

        {/* ================================== */}
        {/* 🌊 AI PULSE (STREAM MODE) */}
        {/* ================================== */}

        {status === "streaming" && (

          <div className="pulse-ring" />

        )}

      </div>

      {/* ================================== */}
      {/* 🧠 LABEL */}
      {/* ================================== */}

      {name && (

        <div className="avatar-label">

          {name}

        </div>

      )}

    </div>
  )
}