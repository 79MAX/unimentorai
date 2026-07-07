import express from "express";
import { certificateService } from "FIX_REQUIRED_PATH";

const router = express.Router();

/**
 * =========================
 * GENERATE CERTIFICATE
 * =========================
 * POST /api/certificates/generate
 */
router.post("/generate", async (req, res) => {
  try {
    const result = await certificateService.generate(req.body);

    return res.status(201).json({
      success: true,
      message: "CERTIFICATE_GENERATED",
      data: result,
    });
  } catch (error) {
    console.error("[CERTIFICATE_GENERATE_ERROR]", error.message);

    return res.status(500).json({
      success: false,
      message: "CERTIFICATE_GENERATION_FAILED",
    });
  }
});

/**
 * =========================
 * VERIFY CERTIFICATE
 * =========================
 * POST /api/certificates/verify
 */
router.post("/verify", async (req, res) => {
  try {
    const { certificateId, userName, courseName, hash } = req.body;

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
    console.error("[CERTIFICATE_VERIFY_ERROR]", error.message);

    return res.status(500).json({
      success: false,
      message: "CERTIFICATE_VERIFY_FAILED",
    });
  }
});

/**
 * =========================
 * HEALTH CHECK
 * =========================
 * GET /api/certificates/health
 */
router.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "CERTIFICATE_SERVICE",
    status: "OK",
  });
});

export default router;
