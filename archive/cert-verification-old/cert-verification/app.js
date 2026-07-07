async function verify() {

  const input = document.getElementById("certId");
  const resultBox = document.getElementById("result");
  const loadingBox = document.getElementById("loading");

  const id = input.value.trim();

  /* =========================
     🧹 CLEAR OLD RESULT
  ========================= */
  resultBox.innerHTML = "";

  /* =========================
     🚨 VALIDATION INPUT
  ========================= */
  if (!id) {
    resultBox.innerHTML = `<div class="error">❌ Please enter a certificate ID</div>`;
    return;
  }

  /* =========================
     ⏳ LOADING STATE
  ========================= */
  if (loadingBox) loadingBox.classList.remove("hidden");

  try {

    const res = await fetch(`/certificates/verify/${encodeURIComponent(id)}`);
    const data = await res.json();

    /* =========================
       ⏳ STOP LOADING
    ========================= */
    if (loadingBox) loadingBox.classList.add("hidden");

    /* =========================
       🎓 VALID CERTIFICATE
    ========================= */
    if (data.valid) {

      const cert = data.certificate;

      resultBox.innerHTML = `
        <div class="success">

          🎓 <strong>VALID CERTIFICATE</strong>
          <hr/>

          👤 Student: ${cert.student?.name || "N/A"}<br>
          📚 Course: ${cert.course?.title || "N/A"}<br>
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

    if (loadingBox) loadingBox.classList.add("hidden");

    console.error("[VERIFY_ERROR]", err);

    resultBox.innerHTML = `
      <div class="error">
        ⚠️ Server error. Please try again.
      </div>
    `;
  }
}
