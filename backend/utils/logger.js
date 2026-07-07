const isProd = process.env.NODE_ENV === "production";

/* =========================
   🧠 UNIFIED LOGGER (PROD SAFE)
========================= */

const format = (level, msg, data) => {
  return {
    level,
    message: msg,
    data: data || null,
    timestamp: new Date().toISOString()
  };
};

export const logger = {
  info: (msg, data) => {
    if (!isProd) {
      console.log("ℹ️ INFO:", format("info", msg, data));
    }
  },

  warn: (msg, data) => {
    console.warn("⚠️ WARN:", format("warn", msg, data));
  },

  error: (msg, err) => {
    const log = format("error", msg, {
      message: err?.message,
      stack: err?.stack || null
    });

    console.error("❌ ERROR:", log);
  },

  success: (msg, data) => {
    if (!isProd) {
      console.log("✅ SUCCESS:", format("success", msg, data));
    }
  }
};
