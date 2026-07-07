const crypto = require("crypto");

const SECRET = process.env.CERT_SECRET;
if (!SECRET) throw new Error("CERT_SECRET missing");

/* =========================
   🧠 SAFE CAST (FAST)
========================= */
const s = (v) => (v === undefined || v === null ? "" : String(v));

/* =========================
   🧠 STABLE NORMALIZATION (CRITICAL FOR BLOCKCHAIN)
========================= */
function normalize(cert = {}) {
  return JSON.stringify({
    id: s(cert.id),
    name: s(cert.name),
    course: s(cert.course),
    date: s(cert.date),
    issuedAt: s(cert.issuedAt)
  });
}

/* =========================
   🔐 HASH ENGINE
========================= */
function hash(data) {
  return crypto
    .createHash("sha256")
    .update(data, "utf8")
    .digest("hex");
}

/* =========================
   🔐 SIGNATURE ENGINE (ANTI-FAKE CORE)
========================= */
function sign(data) {
  return crypto
    .createHmac("sha256", SECRET)
    .update(data, "utf8")
    .digest("hex");
}

/* =========================
   🧪 SAFE VERIFY (NO CRASH + TIMING SAFE)
========================= */
function verify(cert = {}) {

  if (typeof cert.signature !== "string") {
    return false;
  }

  try {

    const expected = sign(normalize(cert));

    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(cert.signature, "hex");

    if (a.length !== b.length) return false;

    return crypto.timingSafeEqual(a, b);

  } catch {
    return false;
  }
}

/* =========================
   🔗 CHAIN LINK (BLOCKCHAIN STYLE)
========================= */
function chain(prev = "", current = "") {
  return hash(`${prev}:${current}`);
}

module.exports = {
  normalize,
  hash,
  sign,
  verify,
  chain
};
