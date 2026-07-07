const crypto = require("crypto");

/* =========================
   🔐 CONFIG GLOBAL SECURITY
========================= */
const SECRET = process.env.CERT_SECRET;

if (!SECRET) {
  throw new Error("CERT_SECRET missing (CRITICAL SECURITY FAILURE)");
}

/* =========================
   🧠 CANONICAL NORMALIZATION
========================= */
function normalize(cert) {
  return JSON.stringify({
    v: "2", // versioning system
    id: String(cert.id || ""),
    userId: String(cert.userId || ""),
    course: String(cert.course || ""),
    level: String(cert.level || ""),
    score: String(cert.score || ""),
    issuedAt: String(cert.issuedAt || "")
  });
}

/* =========================
   🔐 PUBLIC HASH (QR + VERIFY)
========================= */
function generateHash(cert) {

  return crypto
    .createHash("sha256")
    .update(normalize(cert))
    .digest("hex");
}

/* =========================
   🛡️ SERVER SIGNATURE (AUTHORITY)
========================= */
function generateSignature(cert) {

  return crypto
    .createHmac("sha256", SECRET)
    .update(normalize(cert))
    .digest("hex");
}

/* =========================
   🚫 CERTIFICATE STATUS SYSTEM
========================= */
const STATUS = {
  VALID: "VALID",
  REVOKED: "REVOKED",
  SUSPICIOUS: "SUSPICIOUS"
};

/* =========================
   🧪 VERIFY GLOBAL SECURITY
========================= */
function verifyCertificate(cert) {

  if (!cert) return { valid: false, reason: "EMPTY_CERT" };

  if (cert.status === STATUS.REVOKED) {
    return { valid: false, reason: "REVOKED" };
  }

  const expectedHash = generateSignature(cert);

  const a = Buffer.from(expectedHash);
  const b = Buffer.from(cert.signature || "");

  if (a.length !== b.length) {
    return { valid: false, reason: "INVALID_SIGNATURE_LENGTH" };
  }

  const valid = crypto.timingSafeEqual(a, b);

  return {
    valid,
    status: cert.status || STATUS.SUSPICIOUS,
    tampered: !valid,
    version: "v2"
  };
}

/* =========================
   🧾 ISSUE CERTIFICATE CORE
========================= */
function issueCertificate(data) {

  const cert = {
    ...data,
    status: STATUS.VALID,
    issuedAt: new Date().toISOString()
  };

  return {
    ...cert,
    hash: generateHash(cert),
    signature: generateSignature(cert),
    version: "v2"
  };
}

/* =========================
   🔁 REVOKE CERTIFICATE
========================= */
function revokeCertificate(cert) {

  return {
    ...cert,
    status: STATUS.REVOKED,
    revokedAt: new Date().toISOString()
  };
}

module.exports = {
  generateHash,
  generateSignature,
  verifyCertificate,
  issueCertificate,
  revokeCertificate,
  STATUS
};
