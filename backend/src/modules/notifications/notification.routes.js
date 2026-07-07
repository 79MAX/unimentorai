import express from "express";

import { notificationController } from "./notification.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = express.Router();

/**
 * ==================================================
 * NOTIFICATION ROUTES V3
 * UniMentorAI Engagement API Layer
 * ==================================================
 */

/**
 * ==================================================
 * USER NOTIFICATIONS
 * ==================================================
 */

// Get all notifications for user
router.get(
  "/",
  authMiddleware,
  (req, res) =>
    notificationController.getUserNotifications(
      req,
      res
    )
);

// Get unread count (badge UI)
router.get(
  "/unread",
  authMiddleware,
  (req, res) =>
    notificationController.getUnreadCount(
      req,
      res
    )
);

// Mark notification as read
router.patch(
  "/:notificationId/read",
  authMiddleware,
  (req, res) =>
    notificationController.markAsRead(
      req,
      res
    )
);

/**
 * ==================================================
 * SYSTEM EVENTS (INTERNAL / APP EVENTS)
 * ==================================================
 */

// Course event notification
router.post(
  "/course-event",
  authMiddleware,
  (req, res) =>
    notificationController.courseEvent(
      req,
      res
    )
);

// Payment event notification
router.post(
  "/payment-event",
  authMiddleware,
  (req, res) =>
    notificationController.paymentEvent(
      req,
      res
    )
);

// Security alert notification
router.post(
  "/security-alert",
  authMiddleware,
  (req, res) =>
    notificationController.securityAlert(
      req,
      res
    )
);

/**
 * ==================================================
 * ADMIN / INTERNAL SYSTEM (OPTIONAL FUTURE)
 * ==================================================
 */

// Create manual notification (admin/system)
router.post(
  "/create",
  authMiddleware,
  (req, res) =>
    notificationController.create(req, res)
);

export default router;
