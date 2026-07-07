import { buildTemplate } from "./certificate.template.js";
import { generateQR } from "./certificate.qr.js";
import crypto from "crypto";

import { getCertificateLanguage } from "../languages/language.service.js";
import { validateLanguageForCertificate } from "../languages/language.validator.js";

/* =========================
   🎓 UniMentorAI Certificate Generator (CLEAN CORE)
========================= */
export class CertificateGenerator {

  /* =========================
     🚀 MAIN GENERATION METHOD
  ========================= */
  static async generate({ user, course, languageCode }) {

    // 1. VALIDATION INPUTS
    if (!user || !course) {
      throw new Error("Missing user or course data");
    }

    if (!languageCode) {
      languageCode = "en"; // safe fallback
    }

    // 2. LANGUAGE VALIDATION SYSTEM
    const validation = validateLanguageForCertificate(languageCode);
    const lang = getCertificateLanguage(languageCode);

    // 3. CERTIFICATE ID (ANTI-FAKE SYSTEM)
    const certificateId = this.generateSecureId();

    // 4. VERIFICATION URL (IMPORTANT UPGRADE)
    const verificationUrl = this.buildVerificationUrl(certificateId);

    // 5. QR CODE GENERATION
    const qr = await generateQR(verificationUrl);

    // 6. BUILD FINAL TEMPLATE
    return buildTemplate({
      certificateId,
      user,
      course,
      qr,
      language: lang,
      validation
    });
  }

  /* =========================
     🔐 SECURE ID GENERATOR
  ========================= */
  static generateSecureId() {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString("hex");

    return `UAI-${timestamp}-${random}`;
  }

  /* =========================
     🔗 VERIFICATION URL BUILDER
  ========================= */
  static buildVerificationUrl(certificateId) {
    return `https://verify.unimentorai.com/certificate/${certificateId}`;
  }

  /* =========================
     🧪 DEBUG METHOD (DEV ONLY)
  ========================= */
  static debug(data) {
    return {
      input: data,
      generatedId: this.generateSecureId(),
      sampleUrl: this.buildVerificationUrl("TEST-ID"),
      timestamp: new Date().toISOString()
    };
  }
}
