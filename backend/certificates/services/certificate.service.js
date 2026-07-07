import { buildCertificateTemplate } from "./certificate.template.js";
import { generateCertificatePDF } from "./certificate.pdf.js";
import { generateQR } from "./certificate.qr.js";
import { generateHash } from "./certificate.hash.js";
import { certificateDB } from "FIX_REQUIRED_PATH";

export const certificateService = {
  /**
   * 🚀 FULL GENERATION FLOW
   */
  async generate(data) {
    // 1. SECURITY HASH
    const hash = generateHash(data);

    // 2. QR GENERATION
    const qr = await generateQR({
      certificateId: data.certificateId,
      userId: data.userId,
      courseId: data.courseId,
      hash,
    });

    // 3. TEMPLATE BUILD
    const template = await buildCertificateTemplate({
      ...data,
      hash,
      qr,
    });

    // 4. PDF GENERATION
    const pdfPath = await generateCertificatePDF(template);

    // 5. DATABASE SAVE (SOURCE OF TRUTH)
    const record = await certificateDB.create({
      certificateId: data.certificateId,
      userId: data.userId,
      userName: data.userName,
      courseId: data.courseId,
      courseName: data.courseName,
      hash,
      qrCode: qr,
      pdfUrl: pdfPath,
      status: "VALID",
    });

    // 6. RESPONSE FINAL
    return {
      success: true,
      certificateId: data.certificateId,
      hash,
      qr,
      pdf: pdfPath,
      record,
    };
  },

  /**
   * 🔍 VERIFY FLOW
   */
  async verify(data) {
    return await certificateDB.verifyHash(data.hash);
  },

  /**
   * 📱 QR / HASH DIRECT VERIFY
   */
  async verifyByHash(hash) {
    return await certificateDB.verifyHash(hash);
  },
};
