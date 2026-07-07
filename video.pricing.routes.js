
/**
 * ==========================================
 * 🛣️ VIDEO PRICING ROUTES
 * UniMentorAI Pricing Gateway Router
 * ==========================================
 * Defines all API endpoints for pricing system:
 * - real-time pricing
 * - simulation
 * - health checks
 */

const express = require("express");
const router = express.Router();

const pricingController =
  require("../controllers/video.pricing.api.controller");

/**
 * ==========================================
 * 🔥 REAL-TIME PRICING ENDPOINT
 * ==========================================
 * POST /api/pricing/optimize
 */
router.post(
  "/optimize",
  (req, res) => {
    return pricingController.getOptimalPrice(req, res);
  }
);

/**
 * ==========================================
 * 🧪 PRICING SIMULATION ENDPOINT
 * ==========================================
 * POST /api/pricing/simulate
 */
router.post(
  "/simulate",
  (req, res) => {
    return pricingController.simulatePricing(req, res);
  }
);

/**
 * ==========================================
 * ❤️ HEALTH CHECK ENDPOINT
 * ==========================================
 * GET /api/pricing/health
 */
router.get(
  "/health",
  (req, res) => {
    return pricingController.health(req, res);
  }
);

/**
 * ==========================================
 * 📊 PRICING DEBUG ENDPOINT (DEV ONLY)
 * ==========================================
 * GET /api/pricing/debug
 */
router.get(
  "/debug",
  (req, res) => {

    return res.json({
      status: "DEBUG_MODE",
      service: "video-pricing-routes",
      endpoints: [
        "/optimize",
        "/simulate",
        "/health"
      ],
      timestamp: Date.now()
    });
  }
);

module.exports = router;
