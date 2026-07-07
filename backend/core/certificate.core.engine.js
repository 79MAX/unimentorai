const crypto = require("crypto");

/* =========================
   🔐 CONFIG
========================= */
const SECRET = process.env.CERT_SECRET;

if (!SECRET) {
  throw new Error("CERT_SECRET is not defined in environment");
}

const VERSION = "v3";

/* =========================
   🧠 SAFE CAST
========================= */
const s = (v) => (v == null ? "" : String(v));

/* =========================
   🧠 NORMALIZATION (STABLE + COMPACT)
   - remove formatting risk
   - deterministic output
========================= */
function normalize(cert = {}) {

  return JSON.stringify({
    v: VERSION,
    id: s(cert.id),
    name: s(cert.name),
    course: s(cert.course),
    date: s(cert.date),
    issuedAt: s(cert.issuedAt)
  });
}

/* =========================
   🔐 CRYPTO PRIMITIVES
========================= */
function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function hmac(data) {
  return crypto.createHmac("sha256", SECRET).update(data).digest("hex");
}

/* =========================
   🔐 PUBLIC HASH (QR / LEDGER)
========================= */
function hash(cert) {
  return sha256(normalize(cert));
}

/* =========================
   🔐 SIGNATURE (ANTI-FAKE CORE)
========================= */
function sign(cert) {
  return hmac(normalize(cert));
}

/* =========================
   🧪 VERIFY (SAFE + CONSTANT TIME)
========================= */
function verify(cert = {}) {

  const sig = cert.signature;

  if (typeof sig !== "string" || sig.length === 0) {
    return false;
  }

  try {

    const expected = sign(cert);

    const a = Buffer.from(expected);
    const b = Buffer.from(sig);

    if (a.length !== b.length) return false;

    return crypto.timingSafeEqual(a, b);

  } catch {
    return false;
  }
}

/* =========================
   🔗 CHAIN (BLOCKCHAIN STYLE LINKING)
========================= */
function chain(prevHash = "", certHash = "") {
  return sha256(`${prevHash}:${certHash}`);
}

module.exports = {
  VERSION,
  normalize,
  hash,
  sign,
  verify,
  chain
};

