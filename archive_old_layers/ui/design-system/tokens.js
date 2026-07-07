// =======================
// 🎨 COLOR SYSTEM (Semantic SaaS)
// =======================
export const colors = {
  primary: "#6366F1",
  primarySoft: "rgba(99,102,241,0.12)",

  bg: "#020617",
  surface: "#0F172A",
  card: "rgba(15,23,42,0.7)",

  text: "#E5E7EB",
  textMuted: "#94A3B8",

  border: "rgba(255,255,255,0.08)",

  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
};

// =======================
// 📏 SPACING SYSTEM (FIXED SCALE)
// =======================
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// =======================
// 🔲 BORDER RADIUS
// =======================
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

// =======================
// 🌫 SHADOW SYSTEM
// =======================
export const shadow = {
  sm: "0 4px 12px rgba(0,0,0,0.25)",
  md: "0 10px 30px rgba(0,0,0,0.35)",
  lg: "0 20px 60px rgba(0,0,0,0.45)",
  glow: "0 0 25px rgba(99,102,241,0.25)",
};

// =======================
// ✍️ TYPOGRAPHY SYSTEM (NEW)
// =======================
export const typography = {
  h1: { fontSize: 36, fontWeight: 900, lineHeight: 1.1 },
  h2: { fontSize: 28, fontWeight: 800, lineHeight: 1.2 },
  h3: { fontSize: 20, fontWeight: 700, lineHeight: 1.3 },
  body: { fontSize: 14, fontWeight: 400, lineHeight: 1.6 },
  small: { fontSize: 12, fontWeight: 400, lineHeight: 1.4 },
};

// =======================
// ⚡ UI STATES SYSTEM (IMPORTANT SaaS)
// =======================
export const state = {
  hoverOpacity: 0.85,
  disabledOpacity: 0.5,
  activeScale: 0.98,
  transition: "all 0.2s ease",
};

// =======================
// 📐 LAYOUT SYSTEM
// =======================
export const layout = {
  sidebarWidth: 260,
  topbarHeight: 60,
  containerMaxWidth: 1200,
};

// =======================
// 🎛 COMPONENT TOKENS
// =======================
export const buttonVariants = {
  primary: {
    background: colors.primary,
    color: colors.text,
    border: "none",
  },
  secondary: {
    background: "transparent",
    color: colors.text,
    border: `1px solid ${colors.border}`,
  },
  danger: {
    background: colors.danger,
    color: colors.text,
    border: "none",
  },
};

// =======================
// 🧠 Z-INDEX SYSTEM (SaaS UI NEED)
// =======================
export const zIndex = {
  base: 1,
  dropdown: 10,
  sticky: 20,
  modal: 50,
  toast: 100,
};
