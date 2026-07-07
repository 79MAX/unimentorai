const approved = require("./approved.lang");
const beta = require("./beta.lang");
const experimental = require("./experimental.lang");
const { isLanguageApproved } = require("./language.validator");
const { getLanguagePack } = require("./language.service");

/**
 * UniMentorAI Language Registry (Core Entry)
 * Centralized access point for all language operations
 */

const LANGUAGE_STATUS = {
  APPROVED: "approved",
  BETA: "beta",
  EXPERIMENTAL: "experimental",
  FALLBACK: "fallback"
};

/**
 * Get full language data safely
 */
function getLanguage(code) {
  const pack = getLanguagePack(code);

  if (!pack) {
    return {
      code,
      name: "English (Default)",
      slogan: "Disce. Doce. Proficere.",
      status: LANGUAGE_STATUS.FALLBACK
    };
  }

  let status = LANGUAGE_STATUS.EXPERIMENTAL;

  if (approved[code]) status = LANGUAGE_STATUS.APPROVED;
  else if (beta[code]) status = LANGUAGE_STATUS.BETA;

  return {
    code,
    name: pack.name,
    slogan: pack.slogan,
    status
  };
}

/**
 * Get slogan only (used in certificates)
 */
function getSlogan(code) {
  const lang = getLanguage(code);
  return lang.slogan;
}

/**
 * Get language name only
 */
function getLanguageName(code) {
  const lang = getLanguage(code);
  return lang.name;
}

/**
 * Check if language is safe for production certificate
 */
function isSafeLanguage(code) {
  return isLanguageApproved(code);
}

/**
 * Get certificate-ready language payload
 */
function getCertificateLanguage(code) {
  const lang = getLanguage(code);

  return {
    language: lang.name,
    slogan: lang.slogan,
    status: lang.status,
    safe: lang.status === LANGUAGE_STATUS.APPROVED
  };
}

/**
 * List all supported languages
 */
function listLanguages() {
  return {
    approved: Object.keys(approved),
    beta: Object.keys(beta),
    experimental: Object.keys(experimental)
  };
}

module.exports = {
  getLanguage,
  getSlogan,
  getLanguageName,
  isSafeLanguage,
  getCertificateLanguage,
  listLanguages,
  LANGUAGE_STATUS
};
