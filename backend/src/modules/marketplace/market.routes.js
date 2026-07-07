import express from "express";

import { marketController } from "./market.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = express.Router();

/**
 * ==================================================
 * MARKET ROUTES V3
 * UniMentorAI Marketplace API Layer
 * ==================================================
 */

/**
 * ==================================================
 * PUBLIC MARKET ROUTES
 * ==================================================
 */

// Get marketplace listings (public browsing)
router.get("/", (req, res) =>
  marketController.getMarketplace(req, res)
);

/**
 * ==================================================
 * INSTRUCTOR ROUTES
 * ==================================================
 */

// Create listing (course → product)
router.post(
  "/listing",
  authMiddleware,
  (req, res) =>
    marketController.createListing(req, res)
);

// Update price
router.patch(
  "/:marketId/price",
  authMiddleware,
  (req, res) =>
    marketController.updatePrice(req, res)
);

// Feature listing (boost visibility)
router.post(
  "/:marketId/feature",
  authMiddleware,
  (req, res) =>
    marketController.featureListing(req, res)
);

/**
 * ==================================================
 * SALES / BUSINESS EVENTS
 * ==================================================
 */

// Register sale (called after payment success)
router.post(
  "/sale",
  authMiddleware,
  (req, res) =>
    marketController.registerSale(req, res)
);

/**
 * ==================================================
 * ADMIN ROUTES
 * ==================================================
 */

// Marketplace analytics dashboard
router.get(
  "/admin/analytics",
  authMiddleware,
  (req, res) =>
    marketController.analytics(req, res)
);

export default router;
