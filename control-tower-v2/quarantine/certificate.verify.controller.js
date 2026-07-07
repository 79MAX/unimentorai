import Certificate from "./certificate.model.js";

/* =========================
   🏆 CERTIFICATE VERIFICATION ENGINE
   - secure public API
   - anti-fake ready
   - production optimized
========================= */

export const verifyCertificate = async (req, res) => {

  try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        valid: false,
        message: "Certificate ID is required"
      });
    }

    /* =========================
       🔍 FIND CERTIFICATE
    ========================= */
    const cert = await Certificate.findOne(
      { certificateId: id }
    )
    .select("-__v -updatedAt")
    .lean();

    /* =========================
       ❌ NOT FOUND CASE
    ========================= */
    if (!cert) {
      return res.status(404).json({
        valid: false,
        status: "NOT_FOUND",
        message: "Certificate not found"
      });
    }

    /* =========================
       🔐 RESPONSE (SECURE + CLEAN)
    ========================= */
    return res.json({
      valid: true,
      status: cert.status,
      certificate: {
        certificateId: cert.certificateId,
        userId: cert.userId,
        courseTitle: cert.courseTitle,
        level: cert.level,
        score: cert.score,
        issuedAt: cert.issuedAt,
        verifyHash: cert.verifyHash,
        status: cert.status
      }
    });

  } catch (err) {

    console.error("[CERT_VERIFY_ERROR]", err.message);

    return res.status(500).json({
      valid: false,
      status: "ERROR",
      message: "Internal server error"
    });
  }
};
