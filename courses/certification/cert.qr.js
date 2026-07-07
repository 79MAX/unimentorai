/* =========================
   📲 QR CODE GENERATOR
   UniMentorAI - Secure Verification QR System
========================= */

import QRCode from "qrcode";

/* =========================
   🚀 GENERATE QR CODE
========================= */
export async function generateQR(url, options = {}) {

  if (!url || typeof url !== "string") {
    throw new Error("INVALID_QR_URL");
  }

  try {

    /* =========================
       ⚙️ DEFAULT CONFIG (SECURE + HIGH QUALITY)
    ========================= */
    const config = {
      errorCorrectionLevel: "H", // 🔐 high fault tolerance (anti damage/fraud)
      margin: 2,
      width: 300,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      },

      /* =========================
         🧠 PERFORMANCE OPTIMIZATION
      ========================= */
      type: "image/png",

      ...options
    };

    /* =========================
       📲 GENERATE QR
    ========================= */
    return await QRCode.toDataURL(url, config);

  } catch (error) {

    console.error("[QR_GENERATION_ERROR]", error.message);

    throw new Error("QR_GENERATION_FAILED");
  }
}
