import express from "express";
import {
  getCourses,
  enrollCourse,
  updateProgress
} from "../controllers/course.controller.js";

import { protect } from "../../auth/auth.middleware.js";

/* =========================
   📚 COURSE ROUTES (V1 PRO)
========================= */

const router = express.Router();

/* =========================
   🔐 GLOBAL AUTH MIDDLEWARE
========================= */
router.use(protect);

/* =========================
   📖 GET COURSES
========================= */
router.get("/", getCourses);

/* =========================
   🧑‍🎓 ENROLL COURSE
========================= */
router.post("/:courseId/enroll", enrollCourse);

/* =========================
   📊 UPDATE PROGRESS
========================= */
router.put("/:courseId/progress", updateProgress);

export default router;
