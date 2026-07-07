
const Queue = require("./ai.approval.queue");
const Engine = require("./ai.approval.engine");
const Audit = require("./ai.approval.audit");

/**
 * ========================
 * 🔐 APPROVAL CONTROLLER
 * UniMentorAI SaaS Governance API Layer
 * ========================
 * Handles human-in-the-loop decisions
 */

class ApprovalController {

  /**
   * ========================
   * 📋 GET PENDING ACTIONS
   * ========================
   */
  getPending(req, res) {

    try {

      const data = Queue.getPending();

      return res.status(200).json({
        success: true,
        count: data.length,
        data
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
   * ✅ APPROVE ACTION
   * ========================
   */
  approve(req, res) {

    try {

      const { id, approvedBy } = req.body;

      const result = Queue.approve(id, approvedBy || "admin");

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Action not found"
        });
      }

      /**
       * 🧾 AUDIT LOG
       */
      Audit.log({
        type: "approved",
        action: result.action,
        status: result.status,
        userId: result.userId,
        riskLevel: result.riskLevel,
        source: "approval_controller"
      });

      return res.status(200).json({
        success: true,
        message: "Action approved",
        data: result
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
   * ❌ REJECT ACTION
   * ========================
   */
  reject(req, res) {

    try {

      const { id, rejectedBy, reason } = req.body;

      const result = Queue.reject(id, rejectedBy || "admin", reason);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Action not found"
        });
      }

      /**
       * 🧾 AUDIT LOG
       */
      Audit.log({
        type: "rejected",
        action: result.action,
        status: result.status,
        userId: result.userId,
        riskLevel: result.riskLevel,
        metadata: { reason },
        source: "approval_controller"
      });

      return res.status(200).json({
        success: true,
        message: "Action rejected",
        data: result
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
   * ⚡ EXECUTE APPROVED ACTION
   * ========================
   */
  execute(req, res) {

    try {

      const { id } = req.body;

      const item = Queue.findById(id);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Action not found"
        });
      }

      if (item.status !== "approved") {
        return res.status(400).json({
          success: false,
          message: "Action must be approved before execution"
        });
      }

      /**
       * ⚙️ EXECUTION VIA ENGINE
       */
      const execution = Engine.process(item.action);

      const result = Queue.markExecuted(id, execution);

      /**
       * 🧾 AUDIT LOG
       */
      Audit.log({
        type: "executed",
        action: item.action,
        status: "executed",
        userId: item.userId,
        riskLevel: item.riskLevel,
        metadata: execution,
        source: "approval_controller"
      });

      return res.status(200).json({
        success: true,
        message: "Action executed",
        data: result
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
   * 📊 GET APPROVAL STATS
   * ========================
   */
  getStats(req, res) {

    try {

      const queueStats = Queue.getStats();

      const auditStats = Audit.getStats();

      return res.status(200).json({
        success: true,
        queue: queueStats,
        audit: auditStats
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new ApprovalController();
