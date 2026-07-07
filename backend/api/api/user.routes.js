import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
} from "FIX_REQUIRED_PATH";

import { authMiddleware } from "FIX_REQUIRED_PATH";
import { roleMiddleware } from "FIX_REQUIRED_PATH";

/* =========================
   USER ROUTES (SAAS CORE)
   - Secure RBAC system
   - Admin + self-service support
   - Production-ready structure
========================= */

const router = express.Router();

/* =========================
   GLOBAL AUTH GUARD
   (applies to all routes below)
========================= */
router.use(authMiddleware);

/* =========================
   USER MANAGEMENT ROUTES
========================= */

// 📊 Get all users (ADMIN ONLY)
router.get(
  "/",
  roleMiddleware(["admin"]),
  getAllUsers
);

// 👤 Get user by ID
// - Admin can access any user
// - User can access own profile (future improvement in controller)
router.get("/:id", getUserById);

// ✏️ Update user profile
// - Self-update or admin override handled in controller
router.put("/:id", updateUser);

// 🗑️ Delete user (ADMIN ONLY)
router.delete(
  "/:id",
  roleMiddleware(["admin"]),
  deleteUser
);

// 🔐 Update user role (CRITICAL SECURITY ROUTE)
router.patch(
  "/:id/role",
  roleMiddleware(["admin"]),
  updateUserRole
);

/* =========================
   EXPORT ROUTER
========================= */
export default router;
