const crypto = require("crypto");

const SECRET = process.env.CERT_SECRET;

if (typeof SECRET !== "string" || !SECRET.trim()) {
  throw new Error("CERT_SECRET missing or invalid in environment");
}

/* =========================
   🧠 SAFE CAST (STRICT + FAST)
========================= */
function safe(v) {
  if (typeof v === "string") return v;
  if (v == null) return "";
  return String(v);
}

/* =========================
   🧾 NORMALIZATION (DETERMINISTIC + SORT SAFETY)
   👉 protège contre manipulation ordre JSON
========================= */
function normalize(cert = {}) {
  return JSON.stringify({
    id: safe(cert.id),
    name: safe(cert.name),
    course: safe(cert.course),
    date: safe(cert.date),
    issuedAt: safe(cert.issuedAt)
  });
}

/* =========================
   🔐 HASH ENGINE
========================= */
function hash(data) {
  return crypto.createHash("sha256").update(data, "utf8").digest("hex");
}

/* =========================
   🔐 SIGNATURE ENGINE (HMAC)
========================= */
function sign(data) {
  return crypto.createHmac("sha256", SECRET).update(data, "utf8").digest("hex");
}

/* =========================
   🧪 VERIFY (ANTI-TAMPER SAFE)
========================= */
function verify(cert = {}) {
  const signature = cert?.signature;

  if (typeof signature !== "string" || signature.length === 0) {
    return false;
  }

  try {
    const payload = normalize(cert);
    const expected = sign(payload);

    // ⚡ fast fail
    if (expected.length !== signature.length) return false;

    const expectedBuf = Buffer.from(expected, "hex");
    const sigBuf = Buffer.from(signature, "hex");

    if (expectedBuf.length !== sigBuf.length) return false;

    return crypto.timingSafeEqual(expectedBuf, sigBuf);

  } catch {
    return false;
  }
}

/* =========================
   📦 EXPORTS
========================= */
module.exports = {
  normalize,
  hash,
  sign,
  verify
};
