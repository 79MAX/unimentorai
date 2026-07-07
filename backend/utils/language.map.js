
// =========================
// 🌍 SUPPORTED LANGUAGES REGISTRY
// UniMentorAI - Multilingual Core
// =========================

export const SUPPORTED_LANGUAGES = {
  // =========================
  // 🌐 GLOBAL LANGUAGES
  // =========================
  en: {
    name: "English",
    region: "global",
    rtl: false,
    priority: 1
  },

  fr: {
    name: "French",
    region: "global",
    rtl: false,
    priority: 1
  },

  es: {
    name: "Spanish",
    region: "global",
    rtl: false,
    priority: 2
  },

  pt: {
    name: "Portuguese",
    region: "global",
    rtl: false,
    priority: 2
  },

  ar: {
    name: "Arabic",
    region: "middle-east",
    rtl: true,
    priority: 2
  },

  // =========================
  // 🌍 AFRICAN LANGUAGES (CORE UNI MENTOR STRATEGY)
  // =========================
  sw: {
    name: "Swahili",
    region: "east-africa",
    rtl: false,
    priority: 3
  },

  yo: {
    name: "Yoruba",
    region: "west-africa",
    rtl: false,
    priority: 3
  },

  ig: {
    name: "Igbo",
    region: "west-africa",
    rtl: false,
    priority: 3
  },

  ha: {
    name: "Hausa",
    region: "west-africa",
    rtl: false,
    priority: 3
  },

  wo: {
    name: "Wolof",
    region: "west-africa",
    rtl: false,
    priority: 3
  },

  fon: {
    name: "Fon",
    region: "benin",
    rtl: false,
    priority: 3
  },

  am: {
    name: "Amharic",
    region: "east-africa",
    rtl: false,
    priority: 3
  }
};

// =========================
// 🧠 DEFAULT LANGUAGE (FALLBACK SAFE)
// =========================
export const DEFAULT_LANGUAGE = "en";

// =========================
// ⚡ LANGUAGE PRIORITY SORTER (OPTIONAL AI USE)
// =========================
export const getLanguagePriority = (langCode) => {
  return SUPPORTED_LANGUAGES[langCode]?.priority || 99;
};

// =========================
// 🌍 CHECK IF LANGUAGE IS SUPPORTED
// =========================
export const isLanguageSupported = (langCode) => {
  return Boolean(SUPPORTED_LANGUAGES[langCode]);
};
