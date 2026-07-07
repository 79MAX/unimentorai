import { buildCertificateTemplate } from "./certificate.template.js";
import { generateCertificatePDF } from "./certificate.pdf.js";
import { generateQR } from "./certificate.qr.js";
import { generateHash } from "./certificate.hash.js";
import { verifyCertificate } from "FIX_REQUIRED_PATH";

/**
 * CERTIFICATE SERVICE V2 (CLEAN ORCHESTRATOR)
 */
export const certificateService = {
  async generate(data) {
    const hash = generateHash(data);

    const qr = await generateQR({
      userId: data.userId,
      courseId: data.courseId,
      hash,
    });

    const template = await buildCertificateTemplate({
      ...data,
      hash,
      qr,
    });

    const pdf = await generateCertificatePDF(template);

    return {
      pdf,
      hash,
      qr,
    };
  },

  async verify(code) {
    return verifyCertificate(code);
  },
};
