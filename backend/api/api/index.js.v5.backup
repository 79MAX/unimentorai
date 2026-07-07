import express from "express";
import userRoutes from "./user.routes.js";

/* =========================
   API GATEWAY (UNIMENTORAI CORE)
   - Central routing layer
   - Scalable SaaS architecture
   - Ready for microservices evolution
========================= */

const router = express.Router();

/* =========================
   HEALTH CHECK (OBSERVABILITY READY)
========================= */
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "UniMentorAI API",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

/* =========================
   MODULE REGISTRATION
========================= */

// 👤 USERS MODULE
router.use("/users", userRoutes);

/* =========================
   FUTURE MODULE PLACEHOLDERS
   (AI / AUTH / BILLING / ANALYTICS)
========================= */
// router.use("/auth", authRoutes);
// router.use("/ai", aiRoutes);
// router.use("/analytics", analyticsRoutes);
// router.use("/billing", billingRoutes);

/* =========================
   GLOBAL 404 HANDLER
   - Consistent API response format
========================= */
router.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "ROUTE_NOT_FOUND",
    message: "The requested API endpoint does not exist",
    path: req.originalUrl,
  });
});

/* =========================
   EXPORT
========================= */
export default router;
