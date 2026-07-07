/* =========================
   ⚙️ CONFIGURATION
========================= */
const ADMIN_KEY = "YOUR_ADMIN_KEY";
const REFRESH_INTERVAL = 5000;

/* =========================
   🧠 SAFE DOM HELPERS
========================= */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value ?? "0";
}

/* =========================
   🚀 LOAD DASHBOARD (ENTERPRISE SAFE)
========================= */
async function loadDashboard() {

  try {

    const res = await fetch("/admin/dashboard", {
      method: "GET",
      headers: {
        "x-admin-key": ADMIN_KEY
      }
    });

    if (!res.ok) {
      throw new Error("Failed to load dashboard");
    }

    const data = await res.json();

    const m = data?.metrics || {};

    /* =========================
       📊 KPI METRICS
    ========================= */
    setText("revenue", `${m.totalRevenue || 0} USD`);
    setText("certificates", m.totalCertificates || 0);
    setText("users", m.totalUsers || 0);
    setText("success", `${m.successRate || 0}%`);

    /* =========================
       📜 LOGS (SAFE + LIMIT)
    ========================= */
    const logsBox = document.getElementById("logs");

    if (logsBox && Array.isArray(m.logs)) {

      const logsHtml = m.logs
        .slice(-10)
        .reverse()
        .map(log => `
          <div class="log">
            <b>${log.type || "UNKNOWN"}</b>
            | ${log.email || "N/A"}
            | ${log.amount || 0}$
          </div>
        `)
        .join("");

      logsBox.innerHTML = logsHtml;
    }

  } catch (err) {

    console.error("[ADMIN_DASHBOARD_ERROR]", err);

    /* =========================
       🛑 FAIL SAFE UI
    ========================= */
    setText("revenue", "Error");
    setText("certificates", "Error");
    setText("users", "Error");
    setText("success", "Error");
  }
}

/* =========================
   🔄 AUTO REFRESH ENGINE
========================= */
function startDashboard() {

  loadDashboard();

  setInterval(loadDashboard, REFRESH_INTERVAL);
}

/* =========================
   🚀 INIT
========================= */
startDashboard();
