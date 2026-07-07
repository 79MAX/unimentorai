import React, { useMemo } from "react";

function SidebarItem({ item, active, onNavigate }) {
  const isActive = active === item.id;

  return (
    <div
      onClick={() => onNavigate(item.id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        marginBottom: 6,
        borderRadius: 10,
        cursor: "pointer",
        transition: "0.2s ease",
        background: isActive
          ? "rgba(0,255,136,0.12)"
          : "transparent",
        border: isActive
          ? "1px solid rgba(0,255,136,0.35)"
          : "1px solid transparent",
        boxShadow: isActive
          ? "0 0 15px rgba(0,255,136,0.15)"
          : "none"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
        }
      }}
    >
      <span style={{ fontSize: 16 }}>{item.icon}</span>

      <span style={{
        fontSize: 13,
        color: isActive ? "#00ff88" : "#cbd5e1",
        fontWeight: isActive ? "600" : "400"
      }}>
        {item.label}
      </span>

      {isActive && (
        <span style={{
          marginLeft: "auto",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#00ff88",
          boxShadow: "0 0 10px #00ff88"
        }} />
      )}
    </div>
  );
}

export default function Sidebar({
  active = "dashboard",
  onNavigate = () => {}
}) {

  const menu = useMemo(() => [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "ai", label: "AI Engine", icon: "🧠" },
    { id: "health", label: "System Health", icon: "🟢" },
    { id: "live", label: "Live Stream", icon: "⚡" },
    { id: "logs", label: "Logs", icon: "📜" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "security", label: "Security", icon: "🔐" },
    { id: "courses", label: "Courses Engine", icon: "🎓" },
    { id: "billing", label: "Billing", icon: "💰" },
    { id: "settings", label: "Settings", icon: "⚙️" }
  ], []);

  return (
    <aside style={{
      width: 240,
      height: "100vh",
      position: "fixed",
      left: 0,
      top: 0,
      background: "#0b0f19",
      borderRight: "1px solid #1f2937",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      color: "white",
      padding: "16px 12px"
    }}>

      {/* BRAND */}
      <div>
        <div style={{
          fontWeight: "bold",
          fontSize: 14,
          color: "#00ff88",
          marginBottom: 4
        }}>
          🚀 UniMentorAI
        </div>

        <div style={{
          fontSize: 11,
          color: "#6b7280"
        }}>
          Control Center V7 AI
        </div>
      </div>

      {/* MENU */}
      <nav style={{ marginTop: 20, flex: 1 }}>
        {menu.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            active={active}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* FOOTER */}
      <div style={{
        borderTop: "1px solid #1f2937",
        paddingTop: 10,
        fontSize: 11
      }}>
        <div style={{ color: "#6b7280" }}>
          V7 AI AUTONOMOUS
        </div>

        <div style={{
          color: "#00ff88",
          marginTop: 6,
          display: "flex",
          alignItems: "center",
          gap: 6
        }}>
          <span style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#00ff88",
            boxShadow: "0 0 8px #00ff88"
          }} />
          SYSTEM ONLINE
        </div>
      </div>

    </aside>
  );
}