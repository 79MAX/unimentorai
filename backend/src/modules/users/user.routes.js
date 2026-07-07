import express from "express";

import { userController } from "./user.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = express.Router();

/**
 * ==================================================
 * UNIMENTORAI USERS MODULE V12
 * User Management API
 * ==================================================
 *
 * routes
 *   ↓
 * controller
 *   ↓
 * service
 *   ↓
 * database
 *
 * SECURITY:
 * - authentication middleware
 * - centralized controller
 * - safe fallback handlers
 * ==================================================
 */


function notImplemented(service) {
  return (req, res) => {
    res.status(501).json({
      success: false,
      service,
      message: `${service} not implemented yet`
    });
  };
}


/**
 * ==================================================
 * HEALTH
 * ==================================================
 */

router.get(
  "/health",
  (req, res, next) =>
    userController.health
      ? userController.health(req, res, next)
      : notImplemented("Users health")(req, res)
);


/**
 * ==================================================
 * CURRENT USER
 * ==================================================
 */

router.get(
  "/me",
  authMiddleware,
  (req, res, next) =>
    userController.me
      ? userController.me(req, res, next)
      : notImplemented("User profile")(req, res)
);


router.patch(
  "/me",
  authMiddleware,
  (req, res, next) =>
    userController.updateProfile
      ? userController.updateProfile(req, res, next)
      : notImplemented("Profile update")(req, res)
);


router.get(
  "/me/security",
  authMiddleware,
  (req, res, next) =>
    userController.getSecurityStatus
      ? userController.getSecurityStatus(req, res, next)
      : notImplemented("Security status")(req, res)
);


/**
 * ==================================================
 * ADMIN USER MANAGEMENT
 * ==================================================
 */

router.get(
  "/",
  authMiddleware,
  (req, res, next) =>
    userController.listUsers
      ? userController.listUsers(req, res, next)
      : notImplemented("User listing")(req, res)
);


router.get(
  "/:id",
  authMiddleware,
  (req, res, next) =>
    userController.getUser
      ? userController.getUser(req, res, next)
      : notImplemented("User lookup")(req, res)
);


router.patch(
  "/:id/role",
  authMiddleware,
  (req, res, next) =>
    userController.updateRole
      ? userController.updateRole(req, res, next)
      : notImplemented("Role management")(req, res)
);


router.patch(
  "/:id/quarantine",
  authMiddleware,
  (req, res, next) =>
    userController.quarantineUser
      ? userController.quarantineUser(req, res, next)
      : notImplemented("User quarantine")(req, res)
);


router.patch(
  "/:id/release",
  authMiddleware,
  (req, res, next) =>
    userController.releaseUser
      ? userController.releaseUser(req, res, next)
      : notImplemented("User release")(req, res)
);


router.delete(
  "/:id",
  authMiddleware,
  (req, res, next) =>
    userController.deleteUser
      ? userController.deleteUser(req, res, next)
      : notImplemented("User deletion")(req, res)
);


export default router;