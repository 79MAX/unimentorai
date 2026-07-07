/* =========================
   🧾 CERTIFICATE TEMPLATE
   UniMentorAI - Global Verification Standard
========================= */

export function buildTemplate({
  certificateId,
  user,
  course,
  qrCode,
  verificationUrl,
  language = "en"
}) {

  const issuedAt = new Date();

  return {
    /* =========================
       🔐 CORE IDENTIFIERS
    ========================= */
    certificateId,
    verificationUrl,

    /* =========================
       👤 STUDENT INFO (SANITIZED)
    ========================= */
    student: {
      id: user?.id || null,
      name: user?.name?.trim() || "Unknown Student"
    },

    /* =========================
       📚 COURSE INFO
    ========================= */
    course: {
      id: course?.id || null,
      title: course?.title || "Unknown Course",
      level: course?.level || "beginner"
    },

    /* =========================
       📅 ISSUANCE DATA
    ========================= */
    issuedAt: issuedAt.toISOString(),
    issuedTimestamp: issuedAt.getTime(),

    /* =========================
       📲 VERIFICATION ELEMENTS
    ========================= */
    qrCode,

    issuer: {
      name: "UniMentorAI",
      website: "https://unimentorai.com",
      verified: true
    },

    /* =========================
       🌍 MULTI-LANGUAGE SLOGAN SYSTEM
       (DYNAMIC READY)
    ========================= */
    slogan: this._getSlogan(language),

    /* =========================
       🔐 SECURITY STATUS
    ========================= */
    status: "VERIFIED",
    securityLevel: "HIGH",

    /* =========================
       🧠 AI / SYSTEM METADATA
    ========================= */
    meta: {
      version: "1.0",
      language,
      system: "UniMentorAI_CERT_ENGINE"
    }
  };
}

/* =========================
   🌍 DYNAMIC SLOGAN ENGINE
========================= */
buildTemplate._getSlogan = function (language) {

  const slogans = {
    en: "Disce. Doce. Proficere.",
    fr: "Apprends. Enseigne. Progresse.",
    sw: "Jifunze. Fundisha. Endelea.",
    ar: "تعلم. علّم. تقدّم.",
    ha: "Koyi. Koyar. Ci gaba."
  };

  return {
    global: "Disce. Doce. Proficere.",
    localized: slogans[language] || slogans.en
  };
};
