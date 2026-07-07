
const router = require("express").Router();

const ApprovalController = require("./approval.controller");
const authMiddleware = require("../../auth/auth.middleware");

/**
 * ========================
 * 🔐 HUMAN-IN-THE-LOOP APPROVAL ROUTES
 * UniMentorAI SaaS Governance Layer
 * ========================
 * Admin-only AI action approval system
 */

/**
 * ========================
 * 📋 GET PENDING APPROVALS
 * ========================
 */
router.get(
  "/pending",
  authMiddleware,
  ApprovalController.getPending
);

/**
 * ========================
 * 📊 GET APPROVAL STATS
 * ========================
 */
router.get(
  "/stats",
  authMiddleware,
  ApprovalController.getStats
);

/**
 * ========================
 * ✅ APPROVE ACTION
 * ========================
 */
router.post(
  "/approve",
  authMiddleware,
  ApprovalController.approve
);

/**
 * ========================
 * ❌ REJECT ACTION
 * ========================
 */
router.post(
  "/reject",
  authMiddleware,
  ApprovalController.reject
);

/**
 * ========================
 * ⚡ EXECUTE APPROVED ACTION
 * ========================
 */
router.post(
  "/execute",
  authMiddleware,
  ApprovalController.execute
);

module.exports = router;
