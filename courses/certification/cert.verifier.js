/* =========================
   🔍 CERTIFICATE VERIFIER
   UniMentorAI - Public Trust Verification Engine
========================= */

import { verifyCertificate as checkCertificate } from "./cert.store.js";

/* =========================
   🔐 PUBLIC VERIFY API
========================= */
export function verifyCertificate(id) {

  /* =========================
     🚨 INPUT VALIDATION LAYER
  ========================= */
  if (!isValidId(id)) {
    return buildError("INVALID_ID", "Certificate ID is required");
  }

  /* =========================
     🔍 LOOKUP CERTIFICATE
  ========================= */
  const result = checkCertificate(id);

  /* =========================
     ❌ NOT FOUND HANDLING
  ========================= */
  if (!result?.valid) {
    return buildError(
      "CERT_NOT_FOUND",
      "Certificate not found or invalid"
    );
  }

  const cert = result.certificate;

  /* =========================
     🧠 TRUST ENGINE
  ========================= */
  const trustScore = calculateTrustScore(cert);

  /* =========================
     🔐 FINAL RESPONSE
  ========================= */
  return {
    valid: true,
    code: "CERT_VALID",

    certificate: cert,

    verification: {
      trustScore,
      issuer: cert?.issuer || "UniMentorAI",
      verifiedAt: new Date().toISOString(),
      status: getTrustStatus(trustScore)
    }
  };
}

/* =========================
   🧠 TRUST SCORE ENGINE
========================= */
function calculateTrustScore(cert) {

  let score = 1.0;

  /* =========================
     🔐 CORE VALIDATION
  ========================= */
  if (!cert?.student?.id) score -= 0.25;
  if (!cert?.course?.id) score -= 0.25;
  if (!cert?.qrCode) score -= 0.2;
  if (!cert?.certificateId) score -= 0.2;

  /* =========================
     📅 TEMPORAL VALIDATION
  ========================= */
  const issuedAt = new Date(cert?.issuedAt);
  const now = new Date();

  if (!issuedAt || issuedAt > now) {
    score -= 0.3;
  }

  /* =========================
     📊 NORMALIZATION
  ========================= */
  return normalizeScore(score);
}

/* =========================
   🧩 HELPERS (CLEAN ARCHITECTURE)
========================= */

/* Validate ID format */
function isValidId(id) {
  return typeof id === "string" && id.trim().length > 0;
}

/* Standard error builder */
function buildError(code, message) {
  return {
    valid: false,
    code,
    message,
    verifiedAt: new Date().toISOString()
  };
}

/* Trust status classifier */
function getTrustStatus(score) {
  if (score >= 0.85) return "TRUSTED";
  if (score >= 0.6) return "REVIEW";
  return "SUSPECT";
}

/* Score normalization */
function normalizeScore(score) {

  if (score < 0) return 0;
  if (score > 1) return 1;

  return Number(score.toFixed(2));
}
