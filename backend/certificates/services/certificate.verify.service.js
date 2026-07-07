import crypto from "crypto";

/**
 * CERTIFICATE VERIFY SERVICE V2 (SECURE CORE)
 * - validates certificate integrity
 * - hash-based verification (anti-fake system)
 */

export async function verifyCertificate({ certificateId, userName, courseName, hash }) {
  if (!certificateId || !userName || !courseName || !hash) {
    return {
      valid: false,
      reason: "MISSING_DATA",
    };
  }

  try {
    // 1. Rebuild expected hash
    const expectedHash = crypto
      .createHash("sha256")
      .update(`${certificateId}-${userName}-${courseName}`)
      .digest("hex");

    // 2. Compare hashes (core security check)
    const isValid = expectedHash === hash;

    return {
      valid: isValid,
      certificateId,
      checkedAt: new Date().toISOString(),
      reason: isValid ? "VALID_CERTIFICATE" : "INVALID_HASH",
    };
  } catch (error) {
    console.error("[CERTIFICATE_VERIFY_ERROR]", error.message);

    return {
      valid: false,
      reason: "SYSTEM_ERROR",
    };
  }
}
