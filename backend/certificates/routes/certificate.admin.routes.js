import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
import { certificateAdminController } from "../controllers/certificate.admin.controller.js";

const router = express.Router();

/**
 * 🔐 GLOBAL SECURITY LAYER
 * → all routes protected
 */
router.use(authMiddleware);
router.use(roleMiddleware("admin", "superadmin"));

/**
 * 📊 DASHBOARD STATS
 */
router.get("/stats", certificateAdminController.getStats);

/**
 * 🔍 SEARCH CERTIFICATES
 */
router.get("/search", certificateAdminController.searchCertificates);

/**
 * 👤 USER CERTIFICATES
 */
router.get("/user/:userId", certificateAdminController.getUserCertificates);

/**
 * 📚 COURSE CERTIFICATES
 */
router.get("/course/:courseId", certificateAdminController.getCourseCertificates);

/**
 * 🚫 REVOKE CERTIFICATE
 */
router.post("/revoke/:certificateId", certificateAdminController.revokeCertificate);

/**
 * 📦 EXPORT DATA (CSV / JSON future)
 */
router.get("/export", certificateAdminController.exportCertificates);

export default router;
