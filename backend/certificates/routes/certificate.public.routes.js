import express from "express";
import { verifyCertificate } from "../controllers/certificate.verify.controller.js";

const router = express.Router();

/* =========================
   🌍 CERTIFICATE PUBLIC API
   UniMentorAI V1
========================= */

/* =========================
   🔍 VERIFY BY CERTIFICATE ID
========================= */
router.get(
  "/:certificateId",
  verifyCertificate
);

export default router;
