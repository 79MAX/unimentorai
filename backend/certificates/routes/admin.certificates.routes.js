import express from "express";
import { certificateDB } from "../services/certificate.db.service.js";

const router = express.Router();

/**
 * =========================
 * 📊 DASHBOARD STATS
 * =========================
 * GET /api/certificates/admin/stats
 */
router.get("/stats", async (req, res) => {
  try {
    const total = await certificateDB.countAll();
    const valid = await certificateDB.findByStatus("VALID");
    const revoked = await certificateDB.findByStatus("REVOKED");

    return res.json({
      success: true,
      data: {
        total,
        valid: valid.length,
        revoked: revoked.length,
      },
    });
  } catch (error) {
    console.error("[ADMIN_STATS_ERROR]", error.message);

    return res.status(500).json({
      success: false,
      message: "ADMIN_STATS_FAILED",
    });
  }
});

/**
 * =========================
 * 🔍 SEARCH CERTIFICATES
 * =========================
 * GET /api/certificates/admin/search
 */
router.get("/search", async (req, res) => {
  try {
    const { userId, courseId, status, certificateId } = req.query;

    const filters = {};

    if (userId) filters.userId = userId;
    if (courseId) filters.courseId = courseId;
    if (status) filters.status = status;
    if (certificateId) filters.certificateId = certificateId;

    const results = await certificateDB.search(filters);

    return res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("[ADMIN_SEARCH_ERROR]", error.message);

    return res.status(500).json({
      success: false,
      message: "ADMIN_SEARCH_FAILED",
    });
  }
});

/**
 * =========================
 * 🚫 REVOKE CERTIFICATE
 * =========================
 * POST /api/certificates/admin/revoke/:id
 */
router.post("/revoke/:certificateId", async (req, res) => {
  try {
    const { certificateId } = req.params;

    if (!certificateId) {
      return res.status(400).json({
        success: false,
        message: "CERTIFICATE_ID_REQUIRED",
      });
    }

    const result = await certificateDB.revoke(certificateId);

    return res.json({
      success: true,
      message: "CERTIFICATE_REVOKED",
      data: result,
    });
  } catch (error) {
    console.error("[ADMIN_REVOKE_ERROR]", error.message);

    return res.status(500).json({
      success: false,
      message: "REVOKE_FAILED",
    });
  }
});

export default router;
