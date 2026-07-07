import express from "express";

import { userController } from "./user.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = express.Router();

/**
 * ==================================================
 * USER ROUTES V3
 * UniMentorAI User Management API
 * ==================================================
 */

/**
 * ==================================================
 * CURRENT USER
 * ==================================================
 */

// Get current authenticated user
router.get(
  "/me",
  authMiddleware,
  (req, res) => userController.me(req, res)
);

// Update own profile
router.patch(
  "/me",
  authMiddleware,
  (req, res) => userController.updateProfile(req, res)
);

// Security status
router.get(
  "/me/security",
  authMiddleware,
  (req, res) => userController.getSecurityStatus(req, res)
);

/**
 * ==================================================
 * ADMIN ROUTES
 * ==================================================
 */

// List users
router.get(
  "/",
  authMiddleware,
  (req, res) => userController.listUsers(req, res)
);

// Get user by id
router.get(
  "/:id",
  authMiddleware,
  (req, res) => userController.getUser(req, res)
);

// Update role
router.patch(
  "/:id/role",
  authMiddleware,
  (req, res) => userController.updateRole(req, res)
);

// Quarantine user
router.patch(
  "/:id/quarantine",
  authMiddleware,
  (req, res) => userController.quarantineUser(req, res)
);

// Release user
router.patch(
  "/:id/release",
  authMiddleware,
  (req, res) => userController.releaseUser(req, res)
);

// Delete user
router.delete(
  "/:id",
  authMiddleware,
  (req, res) => userController.deleteUser(req, res)
);

export default router;
