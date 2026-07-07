import express from "express";
import { CertificateController } from "../controllers/certificate.controller.js";

const router = express.Router();

/* =========================
   🔐 PUBLIC QR VERIFICATION ROUTE
   GET /api/certificate/verify/:id
========================= */
router.get("/verify/:id", CertificateController.verify);

/* =========================
   📦 GET SINGLE CERTIFICATE (ADMIN / DASHBOARD)
   GET /api/certificate/:id
========================= */
router.get("/:id", CertificateController.getCertificate);

/* =========================
   👤 GET USER CERTIFICATES
   GET /api/certificate/user/:userId
========================= */
router.get("/user/:userId", CertificateController.getUserCertificates);

/* =========================
   ❌ REVOKE CERTIFICATE (ADMIN ONLY)
   PATCH /api/certificate/revoke/:id
========================= */
router.patch("/revoke/:id", CertificateController.revoke);

/* =========================
   🧠 VERIFY INTEGRITY (ANTI-FAKE SYSTEM)
   GET /api/certificate/integrity/:id
========================= */
router.get("/integrity/:id", CertificateController.verifyIntegrity);

export default router;
