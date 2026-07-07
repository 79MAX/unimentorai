/**
 * VIDEO TUTOR CONTEXT STORE - UniMentorAI
 * Runtime context builder for AI Tutor system
 */

class VideoTutorContextStore {
  constructor({ stateManager, sessionMemory, logger }) {
    this.stateManager = stateManager;
    this.sessionMemory = sessionMemory;
    this.logger = logger;

    this.contextCache = new Map();
  }

  /**
   * 🎯 Build unified AI context snapshot
   */
  build({ userId, payload = {} }) {
    try {
      const state = this.stateManager.getState(userId);
      const memory = this.sessionMemory.getLearningProfile(userId);

      const context = {
        userId,

        // =========================
        // 🧠 REAL-TIME STATE
        // =========================
        state: state,

        // =========================
        // 📚 LEARNING HISTORY
        // =========================
        memory: memory,

        // =========================
        // 📡 CURRENT INPUT
        // =========================
        input: payload,

        // =========================
        // 🧠 DERIVED CONTEXT FEATURES
        // =========================
        derived: this._buildDerivedContext(state, memory, payload),

        // =========================
        // ⏱ TIMING CONTEXT
        // =========================
        timing: {
          timestamp: Date.now(),
          sessionDuration: Date.now() - state.session.startTime,
          lastActivity: state.session.lastActivity
        }
      };

      this._cacheContext(userId, context);

      return context;

    } catch (error) {
      this.logger.error("ContextStore error", error);

      return {
        userId,
        error: true,
        fallback: true
      };
    }
  }

  /**
   * 🧠 Build derived AI features
   */
  _buildDerivedContext(state, memory, payload) {
    return {
      learningMode: this._detectLearningMode(state, memory),
      engagementLevel: state.behavior?.classification || "unknown",
      riskLevel: this._detectRisk(state, memory),
      monetizationReadiness: this._detectMonetizationReadiness(state, memory),
      attentionState: state.attention || "medium"
    };
  }

  /**
   * 🎓 Detect learning mode
   */
  _detectLearningMode(state, memory) {
    if (state.behavior?.classification === "high_achiever") {
      return "accelerated";
    }

    if (memory.dominantBehavior === "struggling") {
      return "support_mode";
    }

    if (state.session.active && state.learning.progress > 0.7) {
      return "completion_mode";
    }

    return "standard";
  }

  /**
   * ⚠️ Detect user risk (churn / drop / frustration)
   */
  _detectRisk(state, memory) {
    const frustration = state.behavior?.history?.length || 0;
    const sessions = memory.sessionCount || 0;

    if (frustration > 10 && sessions < 3) return "high_risk";
    if (state.attention?.attentionScore < 40) return "medium_risk";

    return "low_risk";
  }

  /**
   * 💰 Detect monetization readiness
   */
  _detectMonetizationReadiness(state, memory) {
    const engagement = state.attention?.attentionScore || 0;
    const completion = state.learning?.progress || 0;

    if (engagement > 75 && completion > 0.6) return "high";
    if (completion > 0.4) return "medium";

    return "low";
  }

  /**
   * 📦 Cache context (performance optimization)
   */
  _cacheContext(userId, context) {
    this.contextCache.set(userId, {
      context,
      timestamp: Date.now()
    });

    // prevent memory overflow
    if (this.contextCache.size > 1000) {
      const oldestKey = this.contextCache.keys().next().value;
      this.contextCache.delete(oldestKey);
    }
  }

  /**
   * ⚡ Get cached context if available
   */
  getCached(userId) {
    return this.contextCache.get(userId)?.context || null;
  }

  /**
   * 🧹 Clear context cache
   */
  clear(userId) {
    this.contextCache.delete(userId);
  }
}

module.exports = VideoTutorContextStore;
