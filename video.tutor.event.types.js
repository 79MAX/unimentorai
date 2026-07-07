/**
 * VIDEO TUTOR EVENT TYPES - UniMentorAI
 * Centralized event taxonomy for Tutor AI system
 */

const VideoTutorEventTypes = Object.freeze({

  // =========================
  // 🧠 CORE LIFECYCLE EVENTS
  // =========================
  SESSION_START: "session.start",
  SESSION_END: "session.end",
  SESSION_PAUSE: "session.pause",
  SESSION_RESUME: "session.resume",

  // =========================
  // 🎓 LEARNING EVENTS
  // =========================
  LESSON_START: "lesson.start",
  LESSON_PROGRESS: "lesson.progress",
  LESSON_COMPLETE: "lesson.complete",
  LESSON_FAIL: "lesson.fail",

  CONTENT_VIEW: "content.view",
  CONTENT_SKIP: "content.skip",
  CONTENT_REWATCH: "content.rewatch",

  QUIZ_START: "quiz.start",
  QUIZ_SUBMIT: "quiz.submit",
  QUIZ_PASS: "quiz.pass",
  QUIZ_FAIL: "quiz.fail",

  // =========================
  // 💬 INTERACTION EVENTS
  // =========================
  CHAT_MESSAGE: "chat.message",
  CHAT_RESPONSE: "chat.response",

  VOICE_START: "voice.start",
  VOICE_END: "voice.end",
  VOICE_INTERACTION: "voice.interaction",

  // =========================
  // 🧠 BEHAVIOR EVENTS
  // =========================
  ATTENTION_LOW: "attention.low",
  ATTENTION_HIGH: "attention.high",
  FOCUS_DROP: "focus.drop",

  FAST_SKIP: "behavior.fast_skip",
  DEEP_LEARN: "behavior.deep_learn",

  // =========================
  // 📊 ANALYTICS EVENTS
  // =========================
  ANALYTICS_EVENT: "analytics.event",
  INSIGHT_GENERATED: "insight.generated",

  // =========================
  // 💰 MONETIZATION EVENTS
  // =========================
  MONETIZATION_TRIGGER: "monetization.trigger",
  PREMIUM_OFFER: "monetization.premium_offer",
  CERTIFICATION_OFFER: "monetization.certification_offer",
  COACHING_OFFER: "monetization.coaching_offer",

  // =========================
  // 💸 REVENUE EVENTS
  // =========================
  REVENUE_LINKED: "revenue.linked",
  LTV_UPDATED: "revenue.ltv_updated",
  PAYMENT_INTENT: "revenue.payment_intent",

  // =========================
  // 🧠 AI ORCHESTRATION EVENTS
  // =========================
  AI_RESPONSE_GENERATED: "ai.response_generated",
  AI_DECISION_MADE: "ai.decision_made",
  AI_ROUTE_SELECTED: "ai.route_selected",

  // =========================
  // ⚠️ SYSTEM / SAFETY EVENTS
  // =========================
  SYSTEM_ERROR: "system.error",
  GUARD_BLOCKED: "system.guard_blocked",
  RATE_LIMIT_TRIGGERED: "system.rate_limited",

  // =========================
  // 🔁 SELF-IMPROVEMENT EVENTS
  // =========================
  MODEL_FEEDBACK: "self.model_feedback",
  SYSTEM_OPTIMIZED: "self.system_optimized",
  EXPERIENCE_IMPROVED: "self.experience_improved"
});

module.exports = VideoTutorEventTypes;
