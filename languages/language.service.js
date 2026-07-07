 /**
  * UniMentorAI - Language Service Layer
  * Central resolver for all language packs
  * Handles fallback, priority, and certificate-safe resolution
  */

const approved = require("./approved.lang");
const beta = require("./beta.lang");
const experimental = require("./experimental.lang");

/**
 * Language priority system
 * Higher number = higher trust level
 */
const LANGUAGE_PRIORITY = {
  approved: 3,
  beta: 2,
  experimental: 1
};

/**
 * Resolve language pack safely
 */
function resolveLanguagePack(code) {
  if (!code) return null;

  return (
    approved[code] ||
    beta[code] ||
    experimental[code] ||
    null
  );
}

/**
 * Get language with metadata (core function)
 */
function getLanguagePack(code) {
  const pack = resolveLanguagePack(code);

  if (!pack) {
    return {
      code: "en",
      name: "English",
      nativeName: "English",
      region: "Global",
      status: "fallback",
      slogan: "Learn. Teach. Advance.",
      certificateLabel: "Certificate of Achievement",
      confidence: 1,
      safe: true
    };
  }

  let status = "experimental";

  if (approved[code]) status = "approved";
  else if (beta[code]) status = "beta";

  return {
    ...pack,
    status,
    priority: LANGUAGE_PRIORITY[status] || 1,
    safe: status === "approved"
  };
}

/**
 * Get ONLY slogan (used in certificates)
 */
function getSlogan(code) {
  const lang = getLanguagePack(code);
  return lang?.slogan || "Learn. Teach. Advance.";
}

/**
 * Get certificate-safe language data
 */
function getCertificateLanguage(code) {
  const lang = getLanguagePack(code);

  const isSafe = lang.status === "approved";

  return {
    code: lang.code,
    language: lang.name,
    nativeName: lang.nativeName,
    slogan: lang.slogan,
    certificateLabel: lang.certificateLabel || null,
    status: lang.status,
    safe: isSafe,
    confidence: lang.confidence || 1,
    fallbackUsed: !approved[code]
  };
}

/**
 * Check if language is safe for official certificate
 */
function isSafeForCertificate(code) {
  return approved.hasOwnProperty(code);
}

/**
 * Get fallback language (always safe)
 */
function getFallbackLanguage() {
  return {
    code: "en",
    name: "English",
    slogan: "Learn. Teach. Advance.",
    status: "fallback"
  };
}

/**
 * List all available languages
 */
function listAllLanguages() {
  return {
    approved: Object.keys(approved),
    beta: Object.keys(beta),
    experimental: Object.keys(experimental)
  };
}

/**
 * Get system stats (useful for admin dashboard)
 */
function getLanguageStats() {
  return {
    approved: Object.keys(approved).length,
    beta: Object.keys(beta).length,
    experimental: Object.keys(experimental).length
  };
}

module.exports = {
  getLanguagePack,
  getSlogan,
  getCertificateLanguage,
  isSafeForCertificate,
  getFallbackLanguage,
  listAllLanguages,
  getLanguageStats
};
