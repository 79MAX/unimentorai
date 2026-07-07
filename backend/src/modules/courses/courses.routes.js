import express from "express";
import { courseController } from "./course.controller.js";
import { authMiddleware } from "../auth/auth.middleware.js";

const router = express.Router();

/**
 * ==================================================
 * COURSE ROUTES V3 (PRODUCTION READY)
 * ==================================================
 *
 * 🎯 FEATURES:
 * - Clean separation
 * - JWT protection
 * - Role-based access ready
 * - Scalable SaaS structure
 */

/**
 * ==========================
 * PUBLIC ROUTES
 * ==========================
 */

// Get all courses (public browsing)
router.get("/", (req, res, next) =>
  courseController.getAllCourses(req, res, next)
);

// Get course by ID
router.get("/:id", (req, res, next) =>
  courseController.getCourseById(req, res, next)
);

/**
 * ==========================
 * PROTECTED ROUTES (AUTH REQUIRED)
 * ==========================
 */

// Enroll in course
router.post(
  "/:courseId/enroll",
  authMiddleware,
  (req, res, next) => courseController.enrollCourse(req, res, next)
);

// Update progress
router.put(
  "/progress",
  authMiddleware,
  (req, res, next) => courseController.updateProgress(req, res, next)
);

/**
 * ==========================
 * ADMIN / MENTOR ROUTES
 * ==========================
 * Only creators/admins can create courses
 */

router.post(
  "/",
  authMiddleware,
  (req, res, next) => {
    if (!["admin", "mentor"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admin or Mentor only",
      });
    }

    return courseController.createCourse(req, res, next);
  }
);

/**
 * ==========================
 * FUTURE EXTENSION READY
 * ==========================
 * - /publish course
 * - /delete course
 * - /update course
 */

export default router;
