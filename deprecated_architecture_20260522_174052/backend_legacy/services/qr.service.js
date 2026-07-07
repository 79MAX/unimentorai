const QRCode = require("qrcode");

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

async function generateQR(url) {

  if (!url || !isValidUrl(url)) {
    throw new Error("Invalid URL for QR generation");
  }

  try {

    const options = {
      type: "dataurl",
      errorCorrectionLevel: "H", // 🔐 plus résistant (important pour certificats)
      margin: 1,
      width: 200,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      }
    };

    const qr = await QRCode.toDataURL(url, options);

    return qr;

  } catch (err) {

    console.error("[QR ERROR]", {
      url,
      message: err.message
    });

    throw new Error("QR generation failed");

  }
}

module.exports = generateQR;
