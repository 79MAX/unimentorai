/**
 * VIDEO TUTOR METRICS REGISTRY - UniMentorAI
 * Central registry of all system metrics (learning + AI + business)
 */

const VideoTutorMetricsRegistry = Object.freeze({

  // =========================
  // 🧠 LEARNING METRICS
  // =========================
  LEARNING_PROGRESS: "learning.progress",
  LESSON_COMPLETION_RATE: "learning.lesson_completion_rate",
  QUIZ_SCORE: "learning.quiz_score",
  REWATCH_RATE: "learning.rewatch_rate",
  SKILL_IMPROVEMENT: "learning.skill_improvement",

  // =========================
  // 📡 ENGAGEMENT METRICS
  // =========================
  ATTENTION_SCORE: "engagement.attention_score",
  SESSION_DURATION: "engagement.session_duration",
  INTERACTION_RATE: "engagement.interaction_rate",
  CHAT_USAGE: "engagement.chat_usage",
  VOICE_USAGE: "engagement.voice_usage",
  SCROLL_DEPTH: "engagement.scroll_depth",

  // =========================
  // 🧠 BEHAVIOR METRICS
  // =========================
  FOCUS_SCORE: "behavior.focus_score",
  FRUSTRATION_LEVEL: "behavior.frustration_level",
  SKIP_RATE: "behavior.skip_rate",
  LEARNING_STYLE: "behavior.learning_style",

  // =========================
  // 📊 SYSTEM PERFORMANCE METRICS
  // =========================
  API_LATENCY: "system.api_latency",
  ERROR_RATE: "system.error_rate",
  THROUGHPUT: "system.throughput",
  MEMORY_USAGE: "system.memory_usage",

  // =========================
  // 💰 MONETIZATION METRICS
  // =========================
  CONVERSION_RATE: "monetization.conversion_rate",
  UPGRADE_RATE: "monetization.upgrade_rate",
  OFFER_ACCEPTANCE_RATE: "monetization.offer_acceptance_rate",
  CERTIFICATION_PURCHASE_RATE: "monetization.certification_purchase_rate",

  // =========================
  // 💸 REVENUE METRICS
  // =========================
  REVENUE_PER_USER: "revenue.revenue_per_user",
  TOTAL_REVENUE: "revenue.total_revenue",
  LTV: "revenue.ltv",
  ARPU: "revenue.arpu",

  // =========================
  // 🧠 AI PERFORMANCE METRICS
  // =========================
  RESPONSE_ACCURACY: "ai.response_accuracy",
  RESPONSE_TIME: "ai.response_time",
  CONTEXT_RELEVANCE: "ai.context_relevance",
  DECISION_CONFIDENCE: "ai.decision_confidence",

  // =========================
  // 🔁 RETENTION METRICS
  // =========================
  DAY_1_RETENTION: "retention.d1",
  DAY_7_RETENTION: "retention.d7",
  DAY_30_RETENTION: "retention.d30",
  CHURN_RATE: "retention.churn_rate",

  // =========================
  // ⚠️ SYSTEM HEALTH METRICS
  // =========================
  SYSTEM_HEALTH_SCORE: "health.system_health_score",
  INCIDENT_RATE: "health.incident_rate",
  STABILITY_INDEX: "health.stability_index"
});

module.exports = VideoTutorMetricsRegistry;
