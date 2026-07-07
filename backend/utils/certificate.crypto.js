const crypto = require("crypto");

/* =========================
   🔐 CONFIG SAFE LOAD
========================= */
const SECRET = process.env.CERT_SECRET;

if (!SECRET) {
  throw new Error("CERT_SECRET is not defined in environment");
}

const CRYPTO_VERSION = "v3";

Object.freeze({ CRYPTO_VERSION });

/* =========================
   🧠 SAFE CAST (FAST PATH)
========================= */
function s(v) {
  return v == null ? "" : String(v);
}

/* =========================
   🧠 STABLE NORMALIZATION (ORDER FIXED)
========================= */
function normalize(cert = {}) {

  return JSON.stringify({
    v: CRYPTO_VERSION,
    id: s(cert.id),
    name: s(cert.name),
    course: s(cert.course),
    date: s(cert.date),
    issuedAt: s(cert.issuedAt)
  });
}

/* =========================
   🔐 INTERNAL HASH CORE (DRY)
========================= */
function hash(data, algo = "sha256") {
  return crypto.createHash(algo).update(data).digest("hex");
}

/* =========================
   🔐 HMAC CORE (DRY)
========================= */
function hmac(data) {
  return crypto.createHmac("sha256", SECRET).update(data).digest("hex");
}

/* =========================
   🔐 PUBLIC HASH (QR / LEDGER)
========================= */
function generateHash(cert) {
  return hash(normalize(cert));
}

/* =========================
   🔐 SIGNATURE (ANTI-FAKE CORE)
========================= */
function generateSignature(cert) {
  return hmac(normalize(cert));
}

/* =========================
   🧪 VERIFY (SAFE + FAST)
========================= */
function verifyIntegrity(cert = {}) {

  const sig = cert.signature;
  if (typeof sig !== "string" || sig.length === 0) return false;

  try {

    const expected = generateSignature(cert);

    const a = Buffer.from(expected);
    const b = Buffer.from(sig);

    if (a.length !== b.length) return false;

    return crypto.timingSafeEqual(a, b);

  } catch {
    return false;
  }
}

/* =========================
   🔗 CHAIN LINK (BLOCKCHAIN READY)
========================= */
function generateChainLink(prevHash = "", certHash = "") {
  return hash(`${prevHash}:${certHash}`);
}

module.exports = {
  CRYPTO_VERSION,
  generateHash,
  generateSignature,
  verifyIntegrity,
  generateChainLink
};

