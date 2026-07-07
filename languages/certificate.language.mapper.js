 /**
  * UniMentorAI - Certificate Language Mapper
  * Converts language system into certificate-ready payload
  * Ensures safe, consistent and production-ready output
  */

const {
  getLanguagePack,
  getCertificateLanguage,
  isSafeForCertificate
} = require("./language.service");

const {
  validateLanguageForCertificate
} = require("./language.validator");

/**
 * Default fallback certificate language
 */
const FALLBACK_LANGUAGE = {
  code: "en",
  language: "English",
  nativeName: "English",
  slogan: "Learn. Teach. Advance.",
  certificateLabel: "Certificate of Achievement",
  status: "fallback",
  safe: true
};

/**
 * Build certificate language payload
 */
function mapCertificateLanguage(code, options = {}) {
  const {
    forceFallback = false,
    includeWarnings = true
  } = options;

  // Force fallback mode (used in strict production if needed)
  if (forceFallback) {
    return FALLBACK_LANGUAGE;
  }

  // Validate language
  const validation = validateLanguageForCertificate(code);

  // If completely invalid → fallback
  if (!validation.valid) {
    return {
      ...FALLBACK_LANGUAGE,
      reason: validation.reason || "INVALID_LANGUAGE"
    };
  }

  const lang = getLanguagePack(code);

  // Base mapped object
  const mapped = {
    code: lang.code,
    language: lang.name,
    nativeName: lang.nativeName,
    slogan: lang.slogan,
    certificateLabel: lang.certificateLabel || FALLBACK_LANGUAGE.certificateLabel,
    status: validation.status,
    safe: validation.safe
  };

  // Add warnings if requested (useful for admin/debug mode)
  if (includeWarnings && validation.warning) {
    mapped.warning = validation.warning;
  }

  // Beta and experimental handling
  if (validation.status === "beta") {
    mapped.mode = "limited-trust";
    mapped.recommendation = "Use allowed, but fallback recommended";
  }

  if (validation.status === "experimental") {
    mapped.mode = "unsafe";
    mapped.recommendation = "Do not use in official certificates";
  }

  // Approved language clean mode
  if (validation.status === "approved") {
    mapped.mode = "official";
    mapped.recommendation = "Fully certified language";
  }

  return mapped;
}

/**
 * Quick certificate-safe mapper (strict mode)
 */
function getSafeCertificateLanguage(code) {
  const mapped = mapCertificateLanguage(code);

  if (!mapped.safe) {
    return FALLBACK_LANGUAGE;
  }

  return mapped;
}

/**
 * Minimal payload for PDF rendering (optimized)
 */
function getCertificatePDFLanguage(code) {
  const lang = mapCertificateLanguage(code);

  return {
    title: lang.certificateLabel,
    slogan: lang.slogan,
    language: lang.language,
    code: lang.code,
    safe: lang.safe
  };
}

/**
 * Debug full mapping (admin use only)
 */
function debugCertificateLanguage(code) {
  return {
    input: code,
    validation: validateLanguageForCertificate(code),
    mapped: mapCertificateLanguage(code),
    fallback: FALLBACK_LANGUAGE
  };
}

module.exports = {
  mapCertificateLanguage,
  getSafeCertificateLanguage,
  getCertificatePDFLanguage,
  debugCertificateLanguage
};
