/**
 * 🎨 EDUCATION DESIGN SYSTEM CORE
 * AFRICA-FIRST + GLOBAL SCALABLE UI
 */

export const EducationDesignSystem = {

  // 🎨 COLORS
  colors: {

    primary: "#1E3A8A",      // deep trust blue
    secondary: "#FFFFFF",     // clean white
    background: "#F8FAFC",    // soft background
    textPrimary: "#111827",   // dark readable text
    textSecondary: "#6B7280", // soft gray

    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",

    accent: "#38BDF8"        // light modern blue
  },

  // 🔤 TYPOGRAPHY
  typography: {

    fontFamily: "Inter, Poppins, sans-serif",

    title: {
      fontSize: 22,
      fontWeight: "700"
    },

    subtitle: {
      fontSize: 16,
      fontWeight: "500"
    },

    body: {
      fontSize: 14,
      fontWeight: "400"
    },

    small: {
      fontSize: 12,
      fontWeight: "400"
    }
  },

  // 📐 SPACING SYSTEM
  spacing: {

    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32
  },

  // 📱 COMPONENT STYLE RULES
  components: {

    card: {
      borderRadius: 12,
      padding: 12,
      shadow: false, // ❌ disabled for low-end devices
      borderWidth: 1,
      borderColor: "#E5E7EB"
    },

    button: {
      borderRadius: 10,
      height: 44,
      fontWeight: "600"
    },

    input: {
      borderRadius: 8,
      padding: 10
    }
  },

  // ⚡ PERFORMANCE RULES (AFRICA MODE)
  performance: {

    enableAnimations: false,        // low-end devices
    imageQuality: "low",
    lazyLoading: true,
    offlineFirst: true,
    cacheEnabled: true
  },

  // 🌍 ADAPTIVE UI LEVELS
  uiLevels: {

    MVP: {
      complexity: "minimal",
      animations: false
    },

    GROWTH: {
      complexity: "moderate",
      animations: true
    },

    ENTERPRISE: {
      complexity: "advanced",
      analyticsUI: true
    }
  }
};
