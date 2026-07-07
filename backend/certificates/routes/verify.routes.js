import express from "express";
import { certificateService } from "FIX_REQUIRED_PATH";

const router = express.Router();

/**
 * =========================
 * VERIFY CERTIFICATE
 * =========================
 * POST /api/certificates/verify
 */
router.post("/", async (req, res) => {
  try {
    const { certificateId, userName, courseName, hash } = req.body;

    if (!certificateId || !userName || !courseName || !hash) {
      return res.status(400).json({
        success: false,
        message: "MISSING_REQUIRED_FIELDS",
      });
    }

    const result = await certificateService.verify({
      certificateId,
      userName,
      courseName,
      hash,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("[VERIFY_CERTIFICATE_ERROR]", error.message);

    return res.status(500).json({
      success: false,
      message: "CERTIFICATE_VERIFICATION_FAILED",
    });
  }
});

/**
 * =========================
 * VERIFY BY HASH (QR MODE)
 * =========================
 * GET /api/certificates/verify/:hash
 */
router.get("/:hash", async (req, res) => {
  try {
    const { hash } = req.params;

    if (!hash) {
      return res.status(400).json({
        success: false,
        message: "HASH_REQUIRED",
      });
    }

    const result = await certificateService.verifyByHash?.(hash);

    return res.status(200).json({
      success: true,
      data: result || {
        valid: false,
        reason: "NOT_FOUND",
      },
    });
  } catch (error) {
    console.error("[VERIFY_HASH_ERROR]", error.message);

    return res.status(500).json({
      success: false,
      message: "HASH_VERIFICATION_FAILED",
    });
  }
});

export default router;
