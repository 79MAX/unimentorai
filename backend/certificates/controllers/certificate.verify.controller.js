import Certificate from "../models/certificate.model.js";

/* =========================
   🔍 CERTIFICATE VERIFICATION CONTROLLER
   PUBLIC API (UniMentorAI)
========================= */

export const verifyCertificate = async (req, res) => {

  try {

    /* =========================
       📌 VALIDATE INPUT
    ========================= */
    const { certificateId } = req.params;

    if (!certificateId || certificateId.trim().length < 5) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "Invalid certificate ID"
      });
    }

    /* =========================
       🔍 FIND CERTIFICATE (OPTIMIZED QUERY)
    ========================= */
    const cert = await Certificate.findOne(
      { certificateId: certificateId.trim() },
      {
        certificateId: 1,
        courseTitle: 1,
        level: 1,
        score: 1,
        issuedAt: 1,
        status: 1,
        userId: 1
      }
    ).lean();

    /* =========================
       ❌ NOT FOUND
    ========================= */
    if (!cert) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: "Certificate not found"
      });
    }

    /* =========================
       ✅ SUCCESS RESPONSE
    ========================= */
    return res.status(200).json({
      success: true,
      valid: true,
      certificate: cert
    });

  } catch (error) {

    console.error("[VERIFY_CERT_ERROR]", {
      message: error.message,
      stack: error.stack
    });

    return res.status(500).json({
      success: false,
      valid: false,
      message: "Verification failed"
    });
  }
};
