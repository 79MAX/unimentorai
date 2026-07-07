import express from "express";
import { JobsAPIEngine } from "../ai/jobs/jobs.api.engine.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* =========================
   🔐 AI JOB RECOMMENDATION (PROTECTED)
========================= */
router.post("/recommend", authMiddleware, (req, res) => {

  try {

    const { user, jobs } = req.body;

    /* =========================
       ⚠️ VALIDATION SAFE
    ========================= */
    if (!user || !Array.isArray(jobs)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request payload"
      });
    }

    /* =========================
       🚀 AI ENGINE EXECUTION
    ========================= */
    const result = JobsAPIEngine.run(user, jobs);

    return res.json({
      success: true,
      data: result
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});

export default router;

