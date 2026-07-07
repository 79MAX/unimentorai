/* =========================
   🧾 CERTIFICATION ENGINE
   UniMentorAI - Secure Verification System
========================= */

import { generateQR } from "./cert.qr.js";
import { buildTemplate } from "./cert.template.js";

/* =========================
   🔐 IN-MEMORY CACHE (ANTI DUPLICATE GENERATION)
========================= */
const generatedCache = new Map();

/* =========================
   🧾 CERTIFICATE GENERATOR
========================= */
export class CertificateGenerator {

  static async generate({ user, course }) {

    /* =========================
       🔐 INPUT VALIDATION
    ========================= */
    if (!user?.id || !course?.id) {
      throw new Error("INVALID_CERTIFICATE_DATA");
    }

    /* =========================
       🔁 ANTI DUPLICATE CERT GENERATION
    ========================= */
    const cacheKey = `${user.id}-${course.id}`;

    if (generatedCache.has(cacheKey)) {

      return {
        status: "ALREADY_EXISTS",
        certificate: generatedCache.get(cacheKey)
      };
    }

    /* =========================
       🆔 SECURE CERTIFICATE ID
    ========================= */
    const certificateId = this._generateCertificateId(user.id, course.id);

    const verificationUrl =
      `${process.env.BASE_URL || "https://unimentorai.com"}/verify/${certificateId}`;

    /* =========================
       📲 QR CODE GENERATION
    ========================= */
    const qrCode = await generateQR(verificationUrl);

    /* =========================
       🧾 BUILD CERTIFICATE
    ========================= */
    const certificate = buildTemplate({
      certificateId,
      user,
      course,
      qrCode,
      verificationUrl
    });

    /* =========================
       💾 CACHE RESULT
    ========================= */
    generatedCache.set(cacheKey, certificate);

    return {
      status: "GENERATED",
      certificate
    };
  }

  /* =========================
     🔐 SECURE ID GENERATOR (ANTI COLLISION)
  ========================= */
  static _generateCertificateId(userId, courseId) {

    const base = `${userId}-${courseId}-${Date.now()}`;

    const hash = Buffer.from(base)
      .toString("base64")
      .replace(/[/+=]/g, "")
      .slice(0, 12);

    return `CERT-${hash}-${Math.floor(Math.random() * 9999)}`;
  }
}
