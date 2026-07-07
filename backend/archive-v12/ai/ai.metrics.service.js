const mongoose = require("mongoose");

/**
 * AI METRICS SERVICE - UniMentorAI
 * AI Observability + Cost Intelligence + Quality Tracking
 * (Production-grade AI telemetry layer)
 */

// ========================
// AI METRICS MODEL
// ========================
const aiMetricsSchema = new mongoose.Schema(
  {
    // ========================
    // CONTEXT
    // ========================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      index: true,
    },

    sessionId: {
      type: String,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "chat",
        "course_generation",
        "quiz_generation",
        "recommendation",
        "assessment",
        "support",
      ],
      default: "chat",
      index: true,
    },

    // ========================
    // AI PERFORMANCE METRICS
    // ========================
    prompt: String,
    response: String,

    model: {
      type: String,
      default: "unimentor-ai-core",
    },

    latencyMs: {
      type: Number,
      default: 0,
    },

    tokensInput: {
      type: Number,
      default: 0,
    },

    tokensOutput: {
      type: Number,
      default: 0,
    },

    totalTokens: {
      type: Number,
      default: 0,
    },

    cost: {
      type: Number,
      default: 0,
    },

    // ========================
    // QUALITY SIGNALS
    // ========================
    success: {
      type: Boolean,
      default: true,
      index: true,
    },

    relevanceScore: {
      type: Number, // 0 → 1
      default: 0,
    },

    userSatisfactionScore: {
      type: Number, // 0 → 5
      default: 0,
    },

    completionRate: {
      type: Number, // 0 → 1
      default: 0,
    },

    // ========================
    // ERROR TRACKING
    // ========================
    errorMessage: String,
    retryCount: {
      type: Number,
      default: 0,
    },

    // ========================
    // CONTEXT METADATA
    // ========================
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// ========================
// INDEXES (PERFORMANCE)
// ========================
aiMetrics({ user: 1, createdAt: -1 });
aiMetrics({ type: 1, createdAt: -1 });
aiMetrics({ success: 1 });
aiMetrics({ latencyMs: -1 });

const AIMetrics = mongoose.model("AIMetrics", aiMetricsSchema);

---

class AIMetricsService {

  /**
   * 📊 LOG AI INTERACTION (CORE FUNCTION)
   */
  async logInteraction(data) {

    const tokensInput = this.estimateTokens(data.prompt || "");
    const tokensOutput = this.estimateTokens(data.response || "");
    const totalTokens = tokensInput + tokensOutput;

    const cost = this.calculateCost(totalTokens);

    return await AIMetrics.create({
      user: data.userId,
      course: data.courseId,
      sessionId: data.sessionId,

      type: data.type || "chat",

      prompt: data.prompt,
      response: data.response,

      model: data.model || "unimentor-ai-core",

      latencyMs: data.latencyMs || 0,

      tokensInput,
      tokensOutput,
      totalTokens,
      cost,

      success: data.success ?? true,

      relevanceScore: data.relevanceScore || 0,
      userSatisfactionScore: data.userSatisfactionScore || 0,
      completionRate: data.completionRate || 0,

      errorMessage: data.errorMessage || null,

      retryCount: data.retryCount || 0,

      metadata: data.metadata || {},
    });
  }

  /**
   * 📈 USER AI USAGE ANALYTICS
   */
  async getUserAIStats(userId) {

    const logs = await AIMetrics.find({ user: userId });

    const totalRequests = logs.length;

    const totalTokens = logs.reduce(
      (acc, l) => acc + (l.totalTokens || 0),
      0
    );

    const totalCost = logs.reduce(
      (acc, l) => acc + (l.cost || 0),
      0
    );

    const avgLatency =
      totalRequests === 0
        ? 0
        : logs.reduce((acc, l) => acc + (l.latencyMs || 0), 0) /
          totalRequests;

    const successRate =
      totalRequests === 0
        ? 0
        : logs.filter(l => l.success).length / totalRequests;

    return {
      totalRequests,
      totalTokens,
      totalCost: parseFloat(totalCost.toFixed(6)),
      avgLatency: parseFloat(avgLatency.toFixed(2)),
      successRate: parseFloat(successRate.toFixed(2)),
    };
  }

  /**
   * 🧠 AI QUALITY INSIGHTS (VERY IMPORTANT)
   */
  async getQualityInsights() {

    const logs = await AIMetrics.find();

    const avgRelevance =
      logs.length === 0
        ? 0
        : logs.reduce((a, b) => a + (b.relevanceScore || 0), 0) /
          logs.length;

    const avgSatisfaction =
      logs.length === 0
        ? 0
        : logs.reduce((a, b) => a + (b.userSatisfactionScore || 0), 0) /
          logs.length;

    const avgCompletion =
      logs.length === 0
        ? 0
        : logs.reduce((a, b) => a + (b.completionRate || 0), 0) /
          logs.length;

    return {
      avgRelevance: parseFloat(avgRelevance.toFixed(2)),
      avgSatisfaction: parseFloat(avgSatisfaction.toFixed(2)),
      avgCompletion: parseFloat(avgCompletion.toFixed(2)),
    };
  }

  /**
   * ⚠️ ANOMALY DETECTION (AI OBSERVABILITY)
   */
  async detectAnomalies() {

    const logs = await AIMetrics.find();

    const highLatency = logs.filter(l => l.latencyMs > 3000).length;
    const failures = logs.filter(l => !l.success).length;

    const total = logs.length;

    return {
      totalLogs: total,
      highLatencyRequests: highLatency,
      failureRate: total === 0 ? 0 : failures / total,
    };
  }

  /**
   * 💰 COST ENGINE (SaaS CONTROL)
   */
  calculateCost(totalTokens) {
    // mock pricing (replace with OpenAI / Claude pricing later)
    return totalTokens * 0.00002;
  }

  /**
   * 🧮 TOKEN ESTIMATION (LIGHTWEIGHT)
   */
  estimateTokens(text = "") {
    return Math.ceil(text.length / 4);
  }

  /**
   * 📊 GLOBAL DASHBOARD METRICS
   */
  async getGlobalMetrics() {

    const logs = await AIMetrics.find();

    const totalCost = logs.reduce((a, b) => a + (b.cost || 0), 0);
    const totalTokens = logs.reduce((a, b) => a + (b.totalTokens || 0), 0);

    return {
      totalRequests: logs.length,
      totalCost: parseFloat(totalCost.toFixed(6)),
      totalTokens,
      avgCostPerRequest:
        logs.length === 0 ? 0 : totalCost / logs.length,
    };
  }
}

module.exports = new AIMetricsService();
