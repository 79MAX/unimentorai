import QRCode from "qrcode";

/**
 * CERTIFICATE QR V2
 * - secure verification payload
 * - SaaS-ready QR system
 * - used in PDF + mobile scan
 */

/**
 * Generate QR Code for certificate verification
 */
export async function generateQR({ certificateId, userId, courseId, hash }) {
  if (!certificateId || !userId || !hash) {
    throw new Error("QR_ERROR: missing required fields");
  }

  // 🔐 Secure verification URL (frontend or API endpoint)
  const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify/${hash}`;

  // 🔐 Payload inside QR (can be URL or JSON fallback)
  const payload = {
    certificateId,
    userId,
    courseId,
    hash,
    verify: verificationUrl,
  };

  // Convert to string (QR needs string)
  const qrString = JSON.stringify(payload);

  // Generate QR image (base64)
  const qrCode = await QRCode.toDataURL(qrString, {
    errorCorrectionLevel: "H",
    margin: 1,
    scale: 6,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  return qrCode;
}

/**
 * Optional: generate simple verification URL only QR
 */
export async function generateQRUrlOnly(hash) {
  const url = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify/${hash}`;

  return QRCode.toDataURL(url);
}
