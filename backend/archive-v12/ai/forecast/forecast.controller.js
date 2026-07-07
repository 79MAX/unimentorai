
const RevenuePredictor = require("./ai.revenue.predictor");

/**
 * ========================
 * 📊 FORECAST CONTROLLER
 * UniMentorAI SaaS Intelligence API Layer
 * ========================
 * Orchestrates revenue prediction requests
 */

class ForecastController {

  /**
   * ========================
   * 🚀 MAIN FORECAST ENDPOINT
   * ========================
   */
  async predict(req, res) {

    try {

      const context = this.buildContext(req);

      const result = RevenuePredictor.predict(context);

      return res.status(200).json({
        success: true,
        data: result
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: "Forecast prediction failed",
        error: error.message
      });
    }
  }

  /**
   * ========================
   * 📊 BATCH FORECAST ENDPOINT
   * ========================
   */
  async batchPredict(req, res) {

    try {

      const items = req.body.items || [];

      const results = items.map(item =>
        RevenuePredictor.predict(item)
      );

      return res.status(200).json({
        success: true,
        count: results.length,
        data: results
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: "Batch forecast failed",
        error: error.message
      });
    }
  }

  /**
   * ========================
   * 🧠 SYSTEM HEALTH ENDPOINT
   * ========================
   */
  async health(req, res) {

    return res.status(200).json({
      success: true,
      status: "operational",
      service: "forecast-engine",
      timestamp: new Date()
    });
  }

  /**
   * ========================
   * 🔧 CONTEXT BUILDER
   * ========================
   */
  buildContext(req) {

    return {
      history: req.body.history || [],
      conversionRate: req.body.conversionRate || 0,
      churnRate: req.body.churnRate || 0,
      activeUsers: req.body.activeUsers || 0
    };
  }
}

module.exports = new ForecastController();
