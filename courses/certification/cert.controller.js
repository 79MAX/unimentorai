/* =========================
   🧾 CERTIFICATE CONTROLLER
   UniMentorAI - Production API Layer
========================= */

import { CertificateGenerator } from "./cert.generator.js";
import { storeCertificate, verifyCertificate } from "./cert.store.js";

/* =========================
   🚀 CERTIFICATE CONTROLLER
========================= */
export class CertificateController {

  /* =========================
     🧾 ISSUE CERTIFICATE
  ========================= */
  static async issue(req, res) {

    try {

      const { user, course } = req.body;

      /* =========================
         🔐 BASIC VALIDATION
      ========================= */
      if (!user?.id || !course?.id) {
        return res.status(400).json({
          success: false,
          code: "INVALID_INPUT",
          message: "User or course data missing"
        });
      }

      /* =========================
         🧾 GENERATE CERTIFICATE
      ========================= */
      const certificate = await CertificateGenerator.generate({
        user,
        course
      });

      /* =========================
         💾 STORE CERTIFICATE
      ========================= */
      const stored = storeCertificate(certificate.certificate);

      if (!stored?.success && stored === false) {
        return res.status(500).json({
          success: false,
          code: "STORE_FAILED",
          message: "Failed to store certificate"
        });
      }

      /* =========================
         ✅ RESPONSE SUCCESS
      ========================= */
      return res.status(201).json({
        success: true,
        code: "CERTIFICATE_ISSUED",
        certificate
      });

    } catch (err) {

      console.error("[CERT_ISSUE_ERROR]", err);

      return res.status(500).json({
        success: false,
        code: "INTERNAL_ERROR",
        message: "Certificate generation failed"
      });
    }
  }

  /* =========================
     🔍 VERIFY CERTIFICATE
  ========================= */
  static verify(req, res) {

    try {

      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          code: "MISSING_ID",
          message: "Certificate ID required"
        });
      }

      const result = verifyCertificate(id);

      return res.status(200).json({
        success: true,
        code: result.valid ? "CERT_VALID" : "CERT_INVALID",
        ...result
      });

    } catch (err) {

      console.error("[CERT_VERIFY_ERROR]", err);

      return res.status(500).json({
        success: false,
        code: "INTERNAL_ERROR",
        message: "Verification failed"
      });
    }
  }
}
