class MentorFeedbackLoop {

  constructor() {
    // cache léger pour MVP (sera remplacé par DB plus tard)
    this.feedbackStore = new Map();
  }

  // =========================
  // 🧠 STORE FEEDBACK
  // =========================
  async store(userId, data = {}) {
    if (!userId) return;

    const existing = this.feedbackStore.get(userId) || [];

    const entry = {
      message: data.message,
      response: data.response,
      timestamp: Date.now(),
      score: this.estimateQuality(data.message, data.response)
    };

    const updated = [...existing, entry].slice(-100);

    this.feedbackStore.set(userId, updated);

    return {
      success: true,
      stored: true
    };
  }

  // =========================
  // 📊 QUALITY ESTIMATION ENGINE
  // =========================
  estimateQuality(message, response) {
    let score = 50;

    if (!message || !response) return 0;

    // longueur utile
    if (response.length > 200) score += 10;
    if (response.length < 50) score -= 10;

    // engagement signals
    if (response.includes("exemple")) score += 10;
    if (response.includes("👉")) score += 5;

    // question quality
    if (message.includes("?")) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  // =========================
  // 📈 GET USER FEEDBACK SUMMARY
  // =========================
  async getSummary(userId) {
    const history = this.feedbackStore.get(userId) || [];

    if (history.length === 0) {
      return {
        avgScore: 50,
        totalInteractions: 0,
        trend: "neutral"
      };
    }

    const avgScore =
      history.reduce((acc, h) => acc + h.score, 0) /
      history.length;

    return {
      avgScore: Math.round(avgScore),
      totalInteractions: history.length,
      trend: this.getTrend(history)
    };
  }

  // =========================
  // 📊 TREND ANALYSIS
  // =========================
  getTrend(history) {
    if (history.length < 5) return "insufficient_data";

    const last = history.slice(-5);
    const first = history.slice(0, 5);

    const avgLast =
      last.reduce((a, b) => a + b.score, 0) / last.length;

    const avgFirst =
      first.reduce((a, b) => a + b.score, 0) / first.length;

    if (avgLast > avgFirst) return "improving";
    if (avgLast < avgFirst) return "declining";

    return "stable";
  }

  // =========================
  // 🔥 INSIGHT GENERATOR
  // =========================
  async getInsights(userId) {
    const history = this.feedbackStore.get(userId) || [];

    const lowQuality = history.filter(h => h.score < 40).length;
    const highQuality = history.filter(h => h.score > 70).length;

    return {
      weakResponses: lowQuality,
      strongResponses: highQuality,
      recommendation:
        lowQuality > highQuality
          ? "improve_explanation_style"
          : "maintain_current_quality"
    };
  }

  // =========================
  // 🧹 CLEANUP MEMORY
  // =========================
  async clear(userId) {
    this.feedbackStore.delete(userId);

    return {
      success: true,
      message: "Feedback cleared"
    };
  }
}

export default MentorFeedbackLoop;
