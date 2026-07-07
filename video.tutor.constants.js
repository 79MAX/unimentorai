/**
 * video.tutor.constants.js
 * UniMentorAI - System-wide constants registry
 */

const VIDEO_TUTOR_CONSTANTS = {
  // =========================
  // 🔐 SUBSCRIPTION STATES
  // =========================
  SUBSCRIPTION_STATUS: {
    TRIAL: "trial",
    ACTIVE: "active",
    PAST_DUE: "past_due",
    GRACE_PERIOD: "grace_period",
    SUSPENDED: "suspended",
    CANCELLED: "cancelled",
    EXPIRED: "expired",
    REFUNDED: "refunded"
  },

  // =========================
  // 🧠 LEARNING STATES
  // =========================
  LEARNING_STATUS: {
    NOT_STARTED: "not_started",
    IN_PROGRESS: "in_progress",
    MASTERED: "mastered",
    STRUGGLING: "struggling",
    BLOCKED: "blocked"
  },

  // =========================
  // 🎯 DIFFICULTY LEVELS
  // =========================
  DIFFICULTY_LEVELS: {
    EASY: "easy",
    MEDIUM: "medium",
    HARD: "hard"
  },

  DIFFICULTY_RANGE: {
    EASY_MAX: 0.3,
    MEDIUM_MAX: 0.7,
    HARD_MAX: 1.0
  },

  // =========================
  // 📊 ENGAGEMENT LEVELS
  // =========================
  ENGAGEMENT_LEVELS: {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high"
  },

  ENGAGEMENT_THRESHOLD: {
    LOW: 40,
    MEDIUM: 60,
    HIGH: 80
  },

  // =========================
  // 🚨 RISK LEVELS
  // =========================
  RISK_LEVELS: {
    SAFE: "safe",
    WARNING: "warning",
    CRITICAL: "critical"
  },

  RISK_THRESHOLD: {
    WARNING: 0.4,
    CRITICAL: 0.7
  },

  // =========================
  // 📈 LEARNING SCORES
  // =========================
  SCORES: {
    MASTERY_TARGET: 0.8,
    RETENTION_TARGET: 0.75,
    COMPLETION_TARGET: 0.85,
    PASS_THRESHOLD: 0.7
  },

  // =========================
  // 💰 BUSINESS PLANS
  // =========================
  PLANS: {
    FREE: "free",
    BASIC: "basic",
    PREMIUM: "premium",
    ENTERPRISE: "enterprise"
  },

  PLAN_PRICING: {
    FREE: 0,
    BASIC: 4.99,
    PREMIUM: 12.99,
    ENTERPRISE: 49.99
  },

  // =========================
  // 📡 EVENT SYSTEM (CRITICAL)
  // =========================
  EVENTS: {
    SYSTEM_BOOT: "system.boot",

    LEARNING_UPDATED: "learning.model.updated",
    SKILL_UPDATED: "skill.graph.event",

    DIFFICULTY_UPDATED: "difficulty.updated",

    SUBSCRIPTION_CREATED: "subscription.created",
    SUBSCRIPTION_UPDATED: "subscription.updated",
    SUBSCRIPTION_CANCELLED: "subscription.cancelled",

    PAYMENT_SUCCESS: "payment.success",
    PAYMENT_FAILED: "payment.failed"
  },

  // =========================
  // 🌍 GLOBALIZATION
  // =========================
  LANGUAGES: {
    DEFAULT: "fr",
    SUPPORTED: [
      "fr",
      "en",
      "sw",
      "yo",
      "fon",
      "ha"
    ]
  },

  CURRENCIES: {
    DEFAULT: "USD",
    SUPPORTED: ["USD", "EUR", "XOF", "NGN"]
  },

  GEO_PRICING: {
    BJ: 0.5,
    NG: 0.4,
    US: 1.2,
    EU: 1.1
  },

  // =========================
  // ⚙️ SYSTEM LIMITS
  // =========================
  LIMITS: {
    MAX_SKILL_HISTORY: 100,
    MAX_EVENT_BATCH: 50,
    TELEMETRY_FLUSH_INTERVAL: 5000
  }
};

module.exports = VIDEO_TUTOR_CONSTANTS;
