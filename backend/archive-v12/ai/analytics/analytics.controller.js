
const AnalyticsEngine = require("./ai.analytics.engine");
const MetricsCollector = require("./ai.metrics.collector");
const BusinessInsightsEngine = require("./ai.business.insights");

/**
 * ========================
 * 📊 ANALYTICS CONTROLLER
 * UniMentorAI SaaS Intelligence API Layer
 * ========================
 * Orchestrates analytics, metrics, and insights
 */

class AnalyticsController {

  /**
   * ========================
   * 🚀 MAIN ANALYTICS DASHBOARD
   * ========================
   */
  async getDashboard(req, res) {

    try {

      const context = this.buildContext(req);

      const analytics = AnalyticsEngine.compute(context);

      const insights = BusinessInsightsEngine.generate(analytics);

      return res.status(200).json({
        success: true,
        data: {
          analytics,
          insights
        }
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: "Analytics dashboard error",
        error: error.message
      });
    }
  }

  /**
   * ========================
   * 📡 COLLECT METRICS EVENT
   * ========================
   */
  async collectMetric(req, res) {

    try {

      const event = req.body;

      const result = MetricsCollector.collect(event);

      return res.status(200).json({
        success: true,
        data: result
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: "Metric collection failed",
        error: error.message
      });
    }
  }

  /**
   * ========================
   * 📊 RAW ANALYTICS ENDPOINT
   * ========================
   */
  async getAnalytics(req, res) {

    try {

      const context = this.buildContext(req);

      const analytics = AnalyticsEngine.compute(context);

      return res.status(200).json({
        success: true,
        data: analytics
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: "Analytics computation failed",
        error: error.message
      });
    }
  }

  /**
   * ========================
   * 🧠 INSIGHTS ONLY ENDPOINT
   * ========================
   */
  async getInsights(req, res) {

    try {

      const context = this.buildContext(req);

      const analytics = AnalyticsEngine.compute(context);

      const insights = BusinessInsightsEngine.generate(analytics);

      return res.status(200).json({
        success: true,
        data: insights
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: "Insights generation failed",
        error: error.message
      });
    }
  }

  /**
   * ========================
   * 🧠 CONTEXT BUILDER
   * ========================
   */
  buildContext(req) {

    return {
      revenue: req.body.revenue || [],
      users: req.body.users || [],
      events: req.body.events || [],

      errorRate: req.body.errorRate || 0,
      latency: req.body.latency || 0,
      uptime: req.body.uptime || 1,

      metadata: req.body.metadata || {}
    };
  }

  /**
   * ========================
   * 🧠 SYSTEM HEALTH CHECK
   * ========================
   */
  async health(req, res) {

    return res.status(200).json({
      success: true,
      status: "operational",
      service: "ai-analytics-engine",
      components: [
        "metrics_collector",
        "analytics_engine",
        "insights_engine"
      ],
      timestamp: new Date()
    });
  }
}

module.exports = new AnalyticsController();
