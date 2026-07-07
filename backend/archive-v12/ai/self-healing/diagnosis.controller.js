/**
 * ==========================================
 * 🧠 DIAGNOSIS CONTROLLER
 * UniMentorAI Self-Healing Layer
 * ==========================================
 */

const DiagnosisEngine = require("./ai.diagnosis.engine");

class DiagnosisController {

  /**
   * ==========================================
   * FULL DIAGNOSIS
   * POST /api/diagnosis/analyze
   * ==========================================
   */
  async analyze(req, res) {

    const requestId =
      req.headers["x-request-id"] ||
      this.generateRequestId();

    try {

      const context =
        this.buildContext(req);

      const diagnosis =
        await DiagnosisEngine.analyze(
          context
        );

      return res.status(200).json({
        success: true,
        requestId,
        data: diagnosis,
        timestamp: new Date().toISOString()
      });

    } catch (error) {

      console.error(
        "[DiagnosisController]",
        error
      );

      return res.status(500).json({
        success: false,
        requestId,
        error: {
          code: "DIAGNOSIS_FAILED",
          message:
            "Unable to complete diagnosis"
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * ==========================================
   * QUICK HEALTH CHECK
   * GET /api/diagnosis/health
   * ==========================================
   */
  async health(req, res) {

    try {

      return res.status(200).json({
        success: true,
        service: "diagnosis-engine",
        status: "healthy",
        version: "1.0.0",
        timestamp: new Date().toISOString()
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        service: "diagnosis-engine",
        status: "unhealthy",
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * ==========================================
   * DIAGNOSIS SUMMARY
   * POST /api/diagnosis/summary
   * ==========================================
   */
  async summary(req, res) {

    const requestId =
      req.headers["x-request-id"] ||
      this.generateRequestId();

    try {

      const context =
        this.buildContext(req);

      const diagnosis =
        await DiagnosisEngine.analyze(
          context
        );

      return res.status(200).json({
        success: true,
        requestId,
        summary: {
          severity:
            diagnosis.severity,

          issueCount:
            diagnosis.issues?.length || 0,

          rootCause:
            diagnosis.rootCause?.primary ||
            "UNKNOWN",

          classification:
            diagnosis.classification?.category ||
            "unknown"
        }
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        requestId,
        error: {
          code: "SUMMARY_FAILED",
          message:
            "Unable to generate summary"
        }
      });
    }
  }

  /**
   * ==========================================
   * BUILD CONTEXT
   * ==========================================
   */
  buildContext(req) {

    return {

      system:
        req.body?.system || {},

      api:
        req.body?.api || {},

      database:
        req.body?.database || {},

      network:
        req.body?.network || {},

      logs:
        req.body?.logs || []
    };
  }

  /**
   * ==========================================
   * REQUEST ID
   * ==========================================
   */
  generateRequestId() {

    return (
      "diag_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .slice(2, 8)
    );
  }
}

module.exports =
  new DiagnosisController();
