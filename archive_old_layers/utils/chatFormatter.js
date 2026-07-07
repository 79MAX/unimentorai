export function formatAIResponse(data) {

  try {

    // =========================
    // 🧠 NULL / UNDEFINED SAFETY
    // =========================
    if (data === null || data === undefined) {
      return "";
    }

    // =========================
    // 📦 STRING RESPONSE
    // =========================
    if (typeof data === "string") {
      return data;
    }

    // =========================
    // 📊 OBJECT / ARRAY RESPONSE
    // =========================
    if (typeof data === "object") {

      return JSON.stringify(data, null, 2);
    }

    // =========================
    // 🔄 FALLBACK (NUMBER, BOOLEAN, ETC.)
    // =========================
    return String(data);

  } catch (error) {

    // =========================
    // ❌ SAFE FALLBACK (NO CRASH)
    // =========================
    return "⚠️ Unable to format AI response";

  }
}
