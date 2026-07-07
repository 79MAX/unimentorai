/**
 * video.tutor.config.js
 * UniMentorAI - Central Configuration Hub
 */

const VideoTutorConfig = {
  // =========================
  // 🧠 SYSTEM MODES
  // =========================
  system: {
    mode: "production", // dev | staging | production
    region: "global",
    multiLanguage: true,
    liteModeEnabled: true
  },

  // =========================
  // 🧠 AI BEHAVIOR TUNING
  // =========================
  ai: {
    difficulty: {
      easyThreshold: 0.3,
      mediumThreshold: 0.7,
      hardThreshold: 1.0
    },

    engagement: {
      low: 40,
      medium: 60,
      high: 80
    },

    dropoutRisk: {
      warning: 0.4,
      critical: 0.7
    },

    learning: {
      masteryTarget: 0.8,
      retentionTarget: 0.75
    }
  },

  // =========================
  // 💰 BUSINESS CONFIG
  // =========================
  business: {
    currency: "USD",

    plans: {
      free: 0,
      basic: 4.99,
      premium: 12.99,
      enterprise: 49.99
    },

    trialDays: 7,

    monetization: {
      enableUpsell: true,
      enableDynamicPricing: true,
      enableGeoPricing: true
    }
  },

  // =========================
  // 📊 ANALYTICS & TELEMETRY
  // =========================
  analytics: {
    enabled: true,
    realtime: true,
    retentionTracking: true,
    learningFlowTracking: true
  },

  // =========================
  // 🔐 SECURITY & GUARDS
  // =========================
  security: {
    rateLimiting: true,
    abuseDetection: true,
    authRequired: true
  },

  // =========================
  // 🌍 GLOBALIZATION
  // =========================
  localization: {
    defaultLanguage: "fr",
    supportedLanguages: [
      "fr",
      "en",
      "sw",
      "yo",
      "fon",
      "ha"
    ],

    geoPricing: {
      enabled: true,
      regions: {
        BJ: 0.5,
        NG: 0.4,
        US: 1.2,
        EU: 1.1
      }
    }
  },

  // =========================
  // ⚡ PERFORMANCE SETTINGS
  // =========================
  performance: {
    cacheEnabled: true,
    eventBatchSize: 50,
    telemetryFlushInterval: 5000
  },

  // =========================
  // 🧠 FEATURE FLAGS
  // =========================
  features: {
    videoTutor: true,
    adaptiveDifficulty: true,
    skillGraph: true,
    aiInsights: true,
    certificationEngine: true,
    revenueOptimization: true
  }
};

module.exports = VideoTutorConfig;
