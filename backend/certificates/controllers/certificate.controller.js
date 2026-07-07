import { CertificateService } from "../services/certificate.service.js";
import { CertificatePDF } from "../services/certificate.pdf.js";

/* =========================
   🏆 GENERATE CERTIFICATE
   UniMentorAI V1
========================= */

export const generateCertificate = async (req, res) => {

  try {

    /* =========================
       🔐 VALIDATION INPUT
    ========================= */
    const {
      courseTitle,
      level,
      score,
      name
    } = req.body;

    if (!courseTitle || !name) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    /* =========================
       🏆 CREATE CERTIFICATE
    ========================= */
    const cert =
      await CertificateService.createCertificate({
        userId,
        courseTitle,
        level,
        score
      });

    /* =========================
       📄 GENERATE PDF
    ========================= */
    const pdf =
      await CertificatePDF.generate({
        name,
        courseTitle,
        level,
        score,
        certificateId: cert.certificateId,
        date: new Date().toDateString()
      });

    /* =========================
       📦 RESPONSE HEADERS
    ========================= */
    const fileName =
      `certificate-${cert.certificateId}.pdf`;

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`
    });

    return res.status(200).send(pdf);

  } catch (error) {

    console.error("[CERTIFICATE_ERROR]", error);

    return res.status(500).json({
      success: false,
      message: "Certificate generation failed"
    });
  }
};
