import express from "express";

import {
  getMemory,
  clearMemory
} from "./memory.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

/* =========================
   🧠 UNIMENTOR AI MEMORY ROUTER
   ENTERPRISE-GRADE MEMORY API LAYER
   SECURITY + SCALABILITY + CLEAN DESIGN
========================= */

const router = express.Router();

/* =========================
   🔐 AUTHENTICATION LAYER
   All memory routes are protected
========================= */
router.use(protect);

/* =========================
   📚 MEMORY CORE ENDPOINTS
========================= */

/**
 * 📖 GET USER MEMORY
 * → Retrieve long-term AI memory context
 * → Used by AI engine for personalization
 */
router.get("/", getMemory);

/**
 * 🧹 CLEAR USER MEMORY (SOFT RESET)
 * → Archives or resets memory context
 */
router.delete("/clear", clearMemory);

/* =========================
   🚀 FUTURE READY ROUTES (OPTIONAL EXTENSIONS)
   (Prepared for scaling to GPT-level system)
========================= */

// router.get("/search", searchMemory);
// router.post("/save", saveMemory);
// router.delete("/delete/:id", deleteMemory);
// router.get("/pinned", getPinnedMemory);

export default router;
