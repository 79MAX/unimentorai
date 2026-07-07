import crypto from "crypto";

/**
 * CERTIFICATE HASH V2
 * - deterministic secure signature
 * - anti-fake core system
 * - used in PDF + DB + verification
 */

/**
 * Generate a unique certificate hash
 * based on immutable data
 */
export function generateHash(data) {
  if (!data) {
    throw new Error("HASH_ERROR: data is required");
  }

  const { certificateId, userId, courseId, userName, courseName } = data;

  if (!certificateId || !userId || !courseId) {
    throw new Error("HASH_ERROR: missing required fields");
  }

  // 🔐 Canonical string (VERY IMPORTANT)
  const payload = [
    certificateId,
    userId,
    courseId,
    userName || "",
    courseName || "",
  ].join("|");

  return crypto.createHash("sha256").update(payload).digest("hex");
}

/**
 * Verify hash integrity locally (optional helper)
 */
export function compareHash(expectedHash, data) {
  const generatedHash = generateHash(data);
  return generatedHash === expectedHash;
}
