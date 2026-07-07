
const Engine = require("./ai.alert.engine");
const Processor = require("./ai.alert.processor");

/**
 * ========================
 * 🚨 ALERT CONTROLLER
 * UniMentorAI SaaS Observability API Layer
 * ========================
 * Exposes real-time alert system to external clients & dashboards
 */

class AlertController {

  /**
   * ========================
   * 🚨 TRIGGER SINGLE ALERT
   * ========================
   */
  trigger(req, res) {

    try {

      const event = req.body;

      const alert = Engine.trigger(event);

      return res.status(200).json({
        success: true,
        data: alert
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * ========================
   * ⚡ TRIGGER BATCH ALERTS
   * ========================
   */
  batch(req, res) {

    try {

      const { events } = req.body;

      if (!Array.isArray(events)) {
        return res.status(400).json({
          success: false,
          message: "events must be an array"
        });
      }

      const alerts = Engine.triggerBatch(events);

      return res.status(200).json({
        success: true,
        count: alerts.length,
        data: alerts
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * ========================
   * 📊 GET SYSTEM STATS
   * ========================
   */
  stats(req, res) {

    try {

      const processorStats = Processor.getStats();
      const health = Processor.health();

      return res.status(200).json({
        success: true,
        stats: processorStats,
        health
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * ========================
   * 🧠 HEALTH CHECK ENDPOINT
   * ========================
   */
  health(req, res) {

    try {

      return res.status(200).json({
        success: true,
        status: "operational",
        timestamp: new Date()
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new AlertController();
