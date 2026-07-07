import express from "express";
import { verifyCertificate } from "../controllers/certificate.verify.controller.js";

const router = express.Router();

/* =========================
   🔍 PUBLIC CERTIFICATE VERIFY API
   UniMentorAI V1
========================= */

/* =========================
   🧠 PARAM VALIDATION MIDDLEWARE (LIGHT)
========================= */
router.param("certificateId", (req, res, next, certificateId) => {

  if (!certificateId || certificateId.trim().length < 5) {
    return res.status(400).json({
      success: false,
      message: "Invalid certificate ID"
    });
  }

  next();
});

/* =========================
   🔍 VERIFY CERTIFICATE
========================= */
router.get(
  "/:certificateId",
  verifyCertificate
);

export default router;
