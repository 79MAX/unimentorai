const mongoose = require("mongoose");

/**
 * AI METRICS SERVICE - UniMentorAI
 * Observabilité IA + analytics + performance learning engine
 * (base pour adaptive learning + AI optimization)
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

    // ========================
    // AI INTERACTION DATA
    // ========================
    prompt: {
      type: String,
      default: "",
    },

    response: {
      type: String,
      default: "",
    },

    model: {
      type: String,
      default: "gpt-like-model",
    },

    tokensUsed: {
      type: Number,
      default: 0,
    },

    latencyMs: {
      type: Number,
      default: 0,
    },

    cost: {
      type: Number,
      default: 0,
    },

    // ========================
    // QUALITY METRICS
    // ========================
    relevanceScore: {
      type: Number,
      default: 0,
    },

    userSatisfactionScore: {
      type: Number,
      default: 0,
    },

    completionRate: {
      type: Number,
      default: 0,
    },

    success: {
      type: Boolean,
      default: true,
    },

    // ========================
    // CONTEXT TYPE
    // ========================
    type: {
      type: String,
      enum: [
        "chat",
        "course_generation",
        "quiz_generation",
        "recommendation",
        "support",
        "assessment",
      ],
      default: "chat",
    },

    // ========================
    // ERROR TRACKING
    // ========================
    errorMessage: {
      type: String,
      default: null,
    },

    retryCount: {
      type: Number,
      default: 0,
    },

    // ========================
    // META (FUTURE AI TRAINING)
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

aiMetrics({ user: 1, createdAt: -1 });
aiMetrics({ course: 1, createdAt: -1 });
aiMetrics({ type: 1 });
aiMetrics({ success: 1 });

const AIMetrics = mongoose.model("AIMetrics", aiMetricsSchema);

---

class AIMetricsService {

  /**
   * 📊 LOG AI INTERACTION
   */
  async logInteraction(data) {
    return await AIMetrics.create({
      user: data.userId,
      course: data.courseId,
      sessionId: data.sessionId,
      prompt: data.prompt,
      response: data.response,
      model: data.model,
      tokensUsed: data.tokensUsed,
      latencyMs: data.latencyMs,
      cost: data.cost,
      relevanceScore: data.relevanceScore || 0,
      userSatisfactionScore: data.userSatisfactionScore || 0,
      completionRate: data.completionRate || 0,
      success: data.success ?? true,
      type: data.type || "chat",
      errorMessage: data.errorMessage || null,
      metadata: data.metadata || {},
    });
  }

  /**
   * 📈 USER AI USAGE STATS
   */
  async getUserAIStats(userId) {
    const logs = await AIMetrics.find({ user: userId });

    const totalRequests = logs.length;
    const totalTokens = logs.reduce((acc, l) => acc + l.tokensUsed, 0);
    const totalCost = logs.reduce((acc, l) => acc + l.cost, 0);
    const avgLatency =
      totalRequests === 0
        ? 0
        : logs.reduce((acc, l) => acc + l.latencyMs, 0) / totalRequests;

    const successRate =
      totalRequests === 0
        ? 0
        : logs.filter(l => l.success).length / totalRequests;

    return {
      totalRequests,
      totalTokens,
      totalCost,
      avgLatency: parseFloat(avgLatency.toFixed(2)),
      successRate: parseFloat(successRate.toFixed(2)),
    };
  }

  /**
   * 🧠 COURSE AI PERFORMANCE
   */
  async getCourseAIMetrics(courseId) {
    const logs = await AIMetrics.find({ course: courseId });

    const avgRelevance =
      logs.length === 0
        ? 0
        : logs.reduce((acc, l) => acc + (l.relevanceScore || 0), 0) /
          logs.length;

    const avgSatisfaction =
      logs.length === 0
        ? 0
        : logs.reduce((acc, l) => acc + (l.userSatisfactionScore || 0), 0) /
          logs.length;

    return {
      totalInteractions: logs.length,
      avgRelevance: parseFloat(avgRelevance.toFixed(2)),
      avgSatisfaction: parseFloat(avgSatisfaction.toFixed(2)),
    };
  }

  /**
   * ⚠️ DETECT ANOMALIES (AI OBSERVABILITY)
   */
  async detectAnomalies() {
    const logs = await AIMetrics.find();

    const highLatency = logs.filter(l => l.latencyMs > 3000).length;
    const failed = logs.filter(l => !l.success).length;

    return {
      totalLogs: logs.length,
      highLatencyRequests: highLatency,
      failedRequests: failed,
      failureRate:
        logs.length === 0 ? 0 : failed / logs.length,
    };
  }

  /**
   * 📉 COST ANALYTICS
   */
  async getCostReport() {
    const logs = await AIMetrics.find();

    const totalCost = logs.reduce((acc, l) => acc + (l.cost || 0), 0);
    const totalTokens = logs.reduce((acc, l) => acc + (l.tokensUsed || 0), 0);

    return {
      totalCost,
      totalTokens,
      costPerToken:
        totalTokens === 0 ? 0 : totalCost / totalTokens,
    };
  }

  /**
   * 🧠 AI OPTIMIZATION FEEDBACK LOOP
   */
  async feedbackLoop(userId, score) {
    return await AIMetrics.updateMany(
      { user: userId },
      {
        userSatisfactionScore: score,
      }
    );
  }
}

module.exports = new AIMetricsService();
