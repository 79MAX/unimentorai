const video = document.getElementById("video");
const resultBox = document.getElementById("result");

/* =========================
   ⚙️ SCANNER STATE CONTROL (ANTI-SPAM)
========================= */
let scanning = false;

/* =========================
   📷 START CAMERA (SAFE + MOBILE READY)
========================= */
async function startCamera() {

  try {

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });

    video.srcObject = stream;

    video.setAttribute("playsinline", true);

    await video.play();

    scanQR();

  } catch (err) {

    console.error("[CAMERA_ERROR]", err);

    resultBox.innerHTML = "❌ Camera access denied";
  }
}

startCamera();

/* =========================
   🔍 QR SCANNING ENGINE (OPTIMIZED LOOP)
========================= */
function scanQR() {

  if (scanning) return;
  scanning = true;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  setInterval(() => {

    if (video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code && code.data) {

      const certId = code.data.trim();

      verifyCertificate(certId);
    }

  }, 800);
}

/* =========================
   🔐 VERIFY CERTIFICATE (ENTERPRISE SAFE)
========================= */
async function verifyCertificate(id) {

  try {

    if (!id) return;

    const res = await fetch(`/certificates/verify/${encodeURIComponent(id)}`);
    const data = await res.json();

    if (data.valid) {

      const cert = data.certificate;

      resultBox.innerHTML = `
        <div class="success">
          🎓 <strong>VALID CERTIFICATE</strong>
          <hr/>

          👤 ${cert.student?.name || "N/A"}<br>
          📚 ${cert.course?.title || "N/A"}<br>
          📊 Level: ${cert.course?.level || "N/A"}<br>
          📅 Issued: ${new Date(cert.issuedAt).toLocaleDateString()}
        </div>
      `;

    } else {

      resultBox.innerHTML = `
        <div class="error">
          ❌ INVALID CERTIFICATE
        </div>
      `;
    }

  } catch (err) {

    console.error("[VERIFY_ERROR]", err);

    resultBox.innerHTML = "⚠️ Verification error";
  }
}
