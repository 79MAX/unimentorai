import express from "express";

import { paymentController } from "./payment.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = express.Router();

/**
 * ==================================================
 * PAYMENT ROUTES V3
 * UniMentorAI Fintech API Layer
 * ==================================================
 */

/**
 * ==================================================
 * USER PAYMENT ROUTES
 * ==================================================
 */

// Create payment intent
router.post(
  "/create",
  authMiddleware,
  (req, res) =>
    paymentController.createPayment(req, res)
);

// Confirm payment
router.post(
  "/:paymentId/confirm",
  authMiddleware,
  (req, res) =>
    paymentController.confirmPayment(req, res)
);

// Fail payment
router.post(
  "/:paymentId/fail",
  authMiddleware,
  (req, res) =>
    paymentController.failPayment(req, res)
);

// Get user payments history
router.get(
  "/me",
  authMiddleware,
  (req, res) =>
    paymentController.getUserPayments(req, res)
);

/**
 * ==================================================
 * ADMIN ROUTES
 * ==================================================
 */

// Refund payment (admin only - RBAC later)
router.post(
  "/:paymentId/refund",
  authMiddleware,
  (req, res) =>
    paymentController.refundPayment(req, res)
);

// Revenue stats (admin dashboard)
router.get(
  "/admin/stats",
  authMiddleware,
  (req, res) =>
    paymentController.getRevenueStats(req, res)
);

export default router;
