import Certificate from "./certificate.model.js";
import crypto from "crypto";

/* =========================
   🏆 CERTIFICATE SERVICE v2
   - anti-tamper hardened
   - stable hashing
   - versioned security layer
   - SaaS scalable architecture
========================= */

export class CertificateService {

  // 🔐 versioning sécurité (IMPORTANT FUTUR)
  static HASH_VERSION = "v1";

  /**
   * 🚀 GENERATE UNIQUE CERTIFICATE ID
   */
  static generateId() {

    const prefix = "UMAI";
    const random = crypto.randomBytes(5).toString("hex").toUpperCase();

    return `${prefix}-${random}`;
  }

  /**
   * 🧠 STABLE NORMALIZATION (CRITICAL ANTI-FAKE)
   */
  static normalize(data = {}) {

    return JSON.stringify({
      certificateId: String(data.certificateId || ""),
      userId: String(data.userId || ""),
      courseTitle: String(data.courseTitle || ""),
      level: String(data.level || ""),
      score: String(data.score || ""),
      durationHours: String(data.durationHours || ""),
      issuedAt: String(data.issuedAt || "")
    });
  }

  /**
   * 🔐 GENERATE HASH (PUBLIC FINGERPRINT)
   */
  static generateHash(data = {}) {

    return crypto
      .createHash("sha256")
      .update(this.normalize(data))
      .digest("hex");
  }

  /**
   * 🔐 CREATE INTERNAL SIGNATURE (SERVER AUTHORITY)
   */
  static generateSignature(data = {}) {

    const secret = process.env.CERT_SECRET;

    if (!secret) {
      throw new Error("CERT_SECRET missing in environment");
    }

    return crypto
      .createHmac("sha256", secret)
      .update(this.normalize(data))
      .digest("hex");
  }

  /**
   * 🚀 CREATE CERTIFICATE (MAIN PIPELINE)
   */
  static async createCertificate({
    userId,
    courseTitle,
    level = "BEGINNER",
    score = 0,
    durationHours = 0
  }) {

    if (!userId || !courseTitle) {
      throw new Error("Missing required certificate data");
    }

    const certificateId = this.generateId();

    const issuedAt = new Date().toISOString();

    const payload = {
      certificateId,
      userId,
      courseTitle,
      level,
      score,
      durationHours,
      issuedAt
    };

    // 🔐 double security layer
    const verifyHash = this.generateHash(payload);
    const signature = this.generateSignature(payload);

    const certificate = await Certificate.create({
      ...payload,
      verifyHash,
      signature,
      hashVersion: this.HASH_VERSION,
      status: "VALID"
    });

    return certificate;
  }

  /**
   * 🔍 VERIFY CERTIFICATE (ANTI-TAMPER ENGINE)
   */
  static async verifyCertificate(certificateId) {

    const cert = await Certificate.findOne({ certificateId });

    if (!cert) {
      return {
        valid: false,
        reason: "NOT_FOUND"
      };
    }

    const payload = {
      certificateId: cert.certificateId,
      userId: cert.userId,
      courseTitle: cert.courseTitle,
      level: cert.level,
      score: cert.score,
      durationHours: cert.durationHours,
      issuedAt: cert.issuedAt
    };

    const expectedHash = this.generateHash(payload);

    const a = Buffer.from(cert.verifyHash || "");
    const b = Buffer.from(expectedHash);

    // 🛡️ protection crash + timing attack
    if (a.length !== b.length) {
      return { valid: false, reason: "HASH_MISMATCH" };
    }

    const isValid = crypto.timingSafeEqual(a, b);

    return {
      valid: isValid,
      certificate: cert,
      tampered: !isValid,
      hashVersion: cert.hashVersion || "unknown"
    };
  }
}
