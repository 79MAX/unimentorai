import express from "express";

import { protect } from "../middlewares/auth.middleware.js";

import { MemoryVectorService } from "./vector.memory.service.js";
import { MemoryProfileService } from "./profile.service.js";

const router = express.Router();

/* =========================
   🔐 GLOBAL AUTH MIDDLEWARE
========================= */
router.use(protect);

/* =========================
   🧠 SAFE WRAPPER (ERROR HANDLING)
========================= */
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* =========================
   🔍 SEMANTIC MEMORY SEARCH
   (VECTOR + AI RELEVANCE)
========================= */
router.post(
  "/search",
  asyncHandler(async (req, res) => {

    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        message: "Query is required"
      });
    }

    const results =
      await MemoryVectorService.search(
        req.user.id,
        query,
        10
      );

    res.json({
      success: true,
      count: results.length,
      results
    });

  })
);

/* =========================
   🧠 USER AI PROFILE
   (PERSONALITY + BEHAVIOR MODEL)
========================= */
router.get(
  "/profile",
  asyncHandler(async (req, res) => {

    const profile =
      await MemoryProfileService.buildProfile(
        req.user.id
      );

    res.json({
      success: true,
      profile
    });

  })
);

/* =========================
   🚀 FUTURE READY ENDPOINTS
========================= */

// router.post("/save", saveMemory);
// router.delete("/clear", clearMemory);
// router.get("/recent", getRecentMemory);

export default router;
