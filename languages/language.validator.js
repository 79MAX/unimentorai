 /**
  * UniMentorAI - Language Validator
  * Central security layer for language approval rules
  * Protects certificate integrity and system consistency
  */

const approved = require("./approved.lang");
const beta = require("./beta.lang");
const experimental = require("./experimental.lang");

/**
 * Check if language exists in system
 */
function languageExists(code) {
  return (
    approved.hasOwnProperty(code) ||
    beta.hasOwnProperty(code) ||
    experimental.hasOwnProperty(code)
  );
}

/**
 * Check if language is approved (CERTIFICATE SAFE)
 */
function isLanguageApproved(code) {
  return approved.hasOwnProperty(code);
}

/**
 * Check if language is beta
 */
function isLanguageBeta(code) {
  return beta.hasOwnProperty(code);
}

/**
 * Check if language is experimental
 */
function isLanguageExperimental(code) {
  return experimental.hasOwnProperty(code);
}

/**
 * Check if language is safe for certificate generation
 * (STRICT RULE: only approved allowed)
 */
function isSafeForCertificate(code) {
  return isLanguageApproved(code);
}

/**
 * Validate language for certificate usage
 * Returns full validation report
 */
function validateLanguageForCertificate(code) {
  const exists = languageExists(code);

  if (!exists) {
    return {
      valid: false,
      reason: "LANGUAGE_NOT_FOUND",
      safe: false,
      status: "unknown"
    };
  }

  if (isLanguageApproved(code)) {
    return {
      valid: true,
      safe: true,
      status: "approved",
      risk: "none"
    };
  }

  if (isLanguageBeta(code)) {
    return {
      valid: true,
      safe: false,
      status: "beta",
      risk: "medium",
      warning: "Language under validation - fallback recommended"
    };
  }

  if (isLanguageExperimental(code)) {
    return {
      valid: true,
      safe: false,
      status: "experimental",
      risk: "high",
      warning: "Do not use for official certificates"
    };
  }

  return {
    valid: false,
    safe: false,
    status: "invalid",
    risk: "unknown"
  };
}

/**
 * Get safest fallback language
 */
function getSafeFallback() {
  return {
    code: "en",
    name: "English",
    status: "fallback",
    safe: true
  };
}

/**
 * Strict certificate gatekeeper
 * Throws error if language is not allowed (optional strict mode)
 */
function enforceCertificateLanguage(code, strict = false) {
  const validation = validateLanguageForCertificate(code);

  if (validation.safe) {
    return true;
  }

  if (strict) {
    throw new Error(
      `Invalid certificate language: ${code} (${validation.status})`
    );
  }

  return false;
}

module.exports = {
  languageExists,
  isLanguageApproved,
  isLanguageBeta,
  isLanguageExperimental,
  isSafeForCertificate,
  validateLanguageForCertificate,
  getSafeFallback,
  enforceCertificateLanguage
};
