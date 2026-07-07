/**
 * 🎨 AURORA EDUCATION UI SYSTEM
 * MOBILE + WEB PRODUCTION-GRADE DESIGN SYSTEM
 */

export class AuroraUISystem {

  // 🎨 THEME CONFIGURATION
  static theme = {

    colors: {

      primary: "#1E3A8A",
      secondary: "#FFFFFF",
      background: "#F8FAFC",

      textPrimary: "#111827",
      textSecondary: "#6B7280",

      success: "#22C55E",
      warning: "#F59E0B",
      error: "#EF4444",

      accent: "#38BDF8"
    },

    typography: {

      fontFamily: "Inter, Poppins, sans-serif",

      h1: { size: 24, weight: "700" },
      h2: { size: 20, weight: "600" },
      body: { size: 14, weight: "400" },
      small: { size: 12, weight: "400" }
    }
  };

  // 📱 DEVICE ADAPTATION ENGINE
  static deviceModes = {

    LOW_END_MOBILE: {
      animations: false,
      shadows: false,
      imageQuality: "low",
      caching: true,
      offlineMode: true
    },

    MID_RANGE: {
      animations: true,
      shadows: true,
      imageQuality: "medium"
    },

    HIGH_END: {
      animations: true,
      shadows: true,
      imageQuality: "high"
    }
  };

  // ⚡ PERFORMANCE DETECTOR
  static detectDeviceMode(device) {

    if (device.ram < 2 || device.cpu < 4) {
      return "LOW_END_MOBILE";
    }

    if (device.ram < 6) {
      return "MID_RANGE";
    }

    return "HIGH_END";
  }

  // 🎨 COMPONENT SYSTEM
  static components = {

    card: {
      borderRadius: 12,
      padding: 12,
      border: "1px solid #E5E7EB",
      shadow: false // disabled for performance
    },

    button: {
      height: 44,
      borderRadius: 10,
      fontWeight: "600",
      fullWidth: true
    },

    input: {
      height: 42,
      borderRadius: 8,
      padding: 10
    },

    container: {
      maxWidth: 1200,
      padding: 16
    }
  };

  // 🌍 RESPONSIVE LAYOUT ENGINE
  static layout = {

    mobile: {
      columns: 1,
      spacing: 12,
      navigation: "bottom"
    },

    tablet: {
      columns: 2,
      spacing: 16,
      navigation: "side"
    },

    desktop: {
      columns: 3,
      spacing: 20,
      navigation: "side"
    }
  };

  // ⚡ PERFORMANCE SWITCH
  static applyPerformanceMode(mode) {

    switch (mode) {

      case "LOW_END_MOBILE":
        return this.deviceModes.LOW_END_MOBILE;

      case "MID_RANGE":
        return this.deviceModes.MID_RANGE;

      default:
        return this.deviceModes.HIGH_END;
    }
  }

  // 🎨 GET THEME
  static getTheme() {
    return this.theme;
  }

  // 📱 GET COMPONENT
  static getComponent(name) {
    return this.components[name];
  }
}
