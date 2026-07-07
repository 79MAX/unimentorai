
const FraudEngine = require("./ai.fraud.engine");
const FraudResponseEngine = require("./ai.fraud.response.engine");

/**
 * ========================
 * 🚨 FRAUD CONTROLLER
 * UniMentorAI SaaS Intelligence API Layer
 * ========================
 * Orchestrates fraud detection + response pipeline
 */

class FraudController {

  /**
   * ========================
   * 🚀 MAIN FRAUD ANALYSIS ENDPOINT
   * ========================
   */
  async analyze(req, res) {

    try {

      const context = this.buildContext(req);

      // 🧠 STEP 1 — FRAUD DETECTION
      const analysis = FraudEngine.analyze(context);

      // 🚨 STEP 2 — FRAUD RESPONSE EXECUTION
      const response = FraudResponseEngine.handle(analysis);

      return res.status(200).json({
        success: true,
        data: {
          analysis,
          response
        }
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: "Fraud analysis failed",
        error: error.message
      });
    }
  }

  /**
   * ========================
   * 📡 QUICK RISK CHECK ENDPOINT
   * ========================
   */
  async quickCheck(req, res) {

    try {

      const context = this.buildContext(req);

      const analysis = FraudEngine.analyze(context);

      return res.status(200).json({
        success: true,
        riskScore: analysis.riskScore,
        riskLevel: analysis.riskLevel,
        decision: analysis.decision
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: "Quick fraud check failed",
        error: error.message
      });
    }
  }

  /**
   * ========================
   * 📊 FRAUD HEALTH STATUS
   * ========================
   */
  async health(req, res) {

    return res.status(200).json({
      success: true,
      status: "operational",
      service: "fraud-detection-engine",
      components: [
        "signals_engine",
        "rules_engine",
        "anomaly_detector",
        "risk_scorer",
        "response_engine"
      ],
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
      events: req.body.events || [],
      users: req.body.users || [],
      transactions: req.body.transactions || [],

      metadata: req.body.metadata || {},

      source: req.body.source || "api"
    };
  }
}

module.exports = new FraudController();
