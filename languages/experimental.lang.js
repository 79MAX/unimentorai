 /**
  * UniMentorAI - Experimental Languages Registry
  * Non-validated languages (sandbox / research / AI-assisted drafts)
  * NEVER used directly in official certificates without fallback
  */

module.exports = {

  // 🇹🇿 Zulu (draft linguistic mapping)
  zu: {
    code: "zu",
    name: "Zulu",
    nativeName: "isiZulu",
    region: "Southern Africa",
    status: "experimental",
    confidence: 0.62,
    slogan: "Funda. Fundisa. Phumelela. (draft)",
    certificateLabel: null,
    warning: "Unverified linguistic structure"
  },

  // 🇪🇹 Tigrigna (AI-generated approximation)
  ti: {
    code: "ti",
    name: "Tigrigna",
    nativeName: "ትግርኛ",
    region: "Horn of Africa",
    status: "experimental",
    confidence: 0.58,
    slogan: "ለመማር. ለማስተማር. ለማደግ. (AI draft)",
    certificateLabel: null,
    warning: "Requires native validation"
  },

  // 🇿🇼 Shona (partial structure)
  sn: {
    code: "sn",
    name: "Shona",
    nativeName: "chiShona",
    region: "Southern Africa",
    status: "experimental",
    confidence: 0.60,
    slogan: "Dzidza. Dzidzisa. Fambira mberi. (draft)",
    certificateLabel: null,
    warning: "Unverified translation"
  },

  // 🇿🇦 Afrikaans (AI draft safe mapping)
  af: {
    code: "af",
    name: "Afrikaans",
    nativeName: "Afrikaans",
    region: "South Africa",
    status: "experimental",
    confidence: 0.75,
    slogan: "Leer. Onderrig. Vorder. (draft)",
    certificateLabel: null,
    warning: "Pending linguistic approval"
  }
};
