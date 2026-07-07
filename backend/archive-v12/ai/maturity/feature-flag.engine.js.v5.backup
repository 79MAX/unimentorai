/**
 * ⚙️ FEATURE FLAG ENGINE — PRODUCTION GRADE
 * Level: Stripe / LaunchDarkly / Uber feature control style
 */

export class FeatureFlagEngine {

  /* =========================
     ⚙️ DEFAULT CONFIGURATION
  ========================= */
  static config = {

    MVP: {
      vectorAI: false,
      legalAI: false,
      advancedJobs: false,
      orchestration: false,
      fraudDetection: true
    },

    GROWTH: {
      vectorAI: true,
      legalAI: false,
      advancedJobs: true,
      orchestration: false,
      fraudDetection: true
    },

    SCALE: {
      vectorAI: true,
      legalAI: false,
      advancedJobs: true,
      orchestration: true,
      fraudDetection: true
    },

    ENTERPRISE: {
      vectorAI: true,
      legalAI: true,
      advancedJobs: true,
      orchestration: true,
      fraudDetection: true
    }
  };

  /* =========================
     🚀 MAIN ENTRY
  ========================= */
  static getFeatures(level = "MVP") {

    const normalizedLevel = this.normalizeLevel(level);

    const features =
      this.config[normalizedLevel] ||
      this.config.MVP;

    /* =========================
       🧼 IMMUTABLE RETURN (IMPORTANT)
    ========================= */
    return Object.freeze({ ...features });
  }

  /* =========================
     🧠 LEVEL NORMALIZATION
  ========================= */
  static normalizeLevel(level) {

    if (!level || typeof level !== "string") {
      return "MVP";
    }

    const upper = level.toUpperCase();

    return this.config[upper]
      ? upper
      : "MVP";
  }

  /* =========================
     🔧 FUTURE EXTENSION (REMOTE OVERRIDE READY)
  ========================= */
  static overrideConfig(customConfig = {}) {

    this.config = {
      ...this.config,
      ...customConfig
    };
  }

  /* =========================
     📊 DEBUG / INSPECT
  ========================= */
  static debug() {

    return {
      availableLevels: Object.keys(this.config),
      status: "ACTIVE"
    };
  }
}

