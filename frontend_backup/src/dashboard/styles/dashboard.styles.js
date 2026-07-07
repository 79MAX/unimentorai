const COLORS = Object.freeze({
  pageBg: "#020617",
  surface: "#0f172a",
  surfaceLight: "#111827",
  border: "#1e293b",
  borderSoft: "#334155",

  primary: "#3b82f6",
  secondary: "#22c55e",

  text: "#ffffff",
  textSoft: "#94a3b8",
  textMuted: "#64748b",

  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444"
});

const SHADOWS = Object.freeze({
  md: "0 10px 30px rgba(0,0,0,0.25)",
  lg: "0 20px 45px rgba(0,0,0,0.35)"
});

const TRANSITIONS = Object.freeze({
  smooth: "all 0.25s ease"
});

export const dashboardStyles = {

  /* =========================
     🌍 PAGE
  ========================= */
  page: {
    minHeight: "100vh",

    background: `
      radial-gradient(circle at top left, rgba(59,130,246,0.08), transparent 25%),
      radial-gradient(circle at bottom right, rgba(34,197,94,0.06), transparent 25%),
      ${COLORS.pageBg}
    `,

    color: COLORS.text,

    padding: 24,

    fontFamily: `
      Inter,
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif
    `,

    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale"
  },

  /* =========================
     📦 LAYOUT
  ========================= */
  container: {
    width: "100%",
    maxWidth: 1440,
    margin: "0 auto"
  },

  grid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",

    gap: 20,

    marginTop: 24,

    alignItems: "start"
  },

  sectionSpacing: {
    marginTop: 28
  },

  /* =========================
     🧠 CARDS
  ========================= */
  card: {
    position: "relative",

    background: `
      linear-gradient(
        180deg,
        rgba(255,255,255,0.02),
        rgba(255,255,255,0.01)
      ),
      ${COLORS.surfaceLight}
    `,

    border: `1px solid ${COLORS.border}`,

    borderRadius: 20,

    padding: 22,

    boxShadow: SHADOWS.md,

    backdropFilter: "blur(12px)",

    overflow: "hidden",

    transition: TRANSITIONS.smooth
  },

  cardHover: {
    transform: "translateY(-2px)",
    border: `1px solid ${COLORS.borderSoft}`,
    boxShadow: SHADOWS.lg
  },

  /* =========================
     ✨ TYPOGRAPHY
  ========================= */
  title: {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
    marginBottom: 14
  },

  value: {
    fontSize: 38,
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: "-0.04em"
  },

  subtitle: {
    color: COLORS.textSoft,
    marginTop: 8,
    fontSize: 13,
    lineHeight: 1.5
  },

  mutedText: {
    color: COLORS.textMuted,
    fontSize: 12
  },

  /* =========================
     🏷️ BADGES
  ========================= */
  badge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",

    padding: "7px 12px",

    borderRadius: 999,

    background: `
      linear-gradient(
        135deg,
        ${COLORS.primary},
        #2563eb
      )
    `,

    color: COLORS.text,

    fontSize: 12,
    fontWeight: 700,

    letterSpacing: "0.02em",

    border: "1px solid rgba(255,255,255,0.08)",

    boxShadow: "0 6px 20px rgba(59,130,246,0.25)"
  },

  successBadge: {
    background: COLORS.success
  },

  warningBadge: {
    background: COLORS.warning
  },

  dangerBadge: {
    background: COLORS.danger
  },

  /* =========================
     📊 PROGRESS
  ========================= */
  progressWrapper: {
    marginTop: 14
  },

  progressBar: {
    width: "100%",
    height: 10,

    background: COLORS.border,

    borderRadius: 999,

    overflow: "hidden",

    position: "relative"
  },

  progressFill: percent => ({

    width: `${Math.max(0, Math.min(100, percent))}%`,

    height: "100%",

    borderRadius: 999,

    background: `
      linear-gradient(
        90deg,
        ${COLORS.primary},
        ${COLORS.secondary}
      )
    `,

    transition: "width 0.35s ease"
  }),

  /* =========================
     📋 LISTS
  ========================= */
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 14
  },

  /* =========================
     💼 JOB ITEM
  ========================= */
  jobItem: {
    padding: 16,

    borderRadius: 14,

    background: COLORS.surface,

    border: `1px solid ${COLORS.border}`,

    transition: TRANSITIONS.smooth
  },

  jobItemHover: {
    border: `1px solid ${COLORS.borderSoft}`,
    transform: "translateY(-1px)"
  },

  jobTitle: {
    fontWeight: 700,
    fontSize: 15,
    marginBottom: 6
  },

  jobMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: 10,

    flexWrap: "wrap",
    gap: 10
  },

  scoreText: {
    color: COLORS.success,
    fontWeight: 700,
    fontSize: 14
  },

  /* =========================
     💡 INSIGHTS
  ========================= */
  insight: {
    color: "#cbd5e1",

    lineHeight: 1.7,

    fontSize: 14,

    padding: 12,

    borderRadius: 12,

    background: "rgba(255,255,255,0.02)",

    border: `1px solid rgba(255,255,255,0.03)`
  },

  /* =========================
     ⚡ FLEX HELPERS
  ========================= */
  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  },

  rowCenter: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },

  column: {
    display: "flex",
    flexDirection: "column"
  },

  /* =========================
     📱 RESPONSIVE HELPERS
  ========================= */
  responsiveImage: {
    width: "100%",
    height: "auto",
    objectFit: "cover"
  }
};
