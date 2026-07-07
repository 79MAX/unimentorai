/* =========================
   🧾 CERTIFICATE STORE
   UniMentorAI - Secure Verification Registry
========================= */

/* =========================
   ⚡ IN-MEMORY CACHE (DEV / FALLBACK)
   👉 remplaçable par MongoDB / PostgreSQL / Redis
========================= */
const certificateDB = new Map();

/* =========================
   💾 STORE CERTIFICATE
========================= */
export function storeCertificate(cert) {

  if (!cert?.certificateId) {
    return {
      success: false,
      error: "INVALID_CERTIFICATE"
    };
  }

  const record = {
    ...cert,

    /* =========================
       🔐 SECURITY METADATA
    ========================= */
    storedAt: new Date().toISOString(),
    version: "1.0",
    verified: true
  };

  certificateDB.set(cert.certificateId, record);

  return {
    success: true,
    certificateId: cert.certificateId
  };
}

/* =========================
   🔍 VERIFY CERTIFICATE
========================= */
export function verifyCertificate(id) {

  if (!id) {
    return {
      valid: false,
      reason: "MISSING_CERTIFICATE_ID"
    };
  }

  const cert = certificateDB.get(id);

  /* =========================
     ❌ NOT FOUND
  ========================= */
  if (!cert) {
    return {
      valid: false,
      reason: "CERTIFICATE_NOT_FOUND"
    };
  }

  /* =========================
     ✅ VALID CERTIFICATE
  ========================= */
  return {
    valid: true,

    certificate: {
      ...cert,

      /* =========================
         🧠 SECURITY CHECK DATA
      ========================= */
      verifiedAt: new Date().toISOString(),
      trustLevel: "HIGH"
    }
  };
}

/* =========================
   📊 STATS (ADMIN / ANALYTICS READY)
========================= */
export function getCertificateStats() {

  return {
    total: certificateDB.size,
    timestamp: new Date().toISOString()
  };
}

/* =========================
   🧹 DELETE CERTIFICATE (ADMIN)
========================= */
export function deleteCertificate(id) {

  return certificateDB.delete(id);
}
