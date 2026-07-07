const BASE_URL = "http://localhost:3000";

/* =========================
   🔐 TOKEN HANDLER
========================= */
function getToken() {
  return localStorage.getItem("token");
}

/* =========================
   ⏱️ FETCH WITH TIMEOUT
========================= */
function fetchWithTimeout(url, options, timeout = 10000) {

  return Promise.race([

    fetch(url, options),

    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout)
    )
  ]);
}

/* =========================
   💼 JOBS API (SECURE + PRO)
========================= */
export async function getJobs(user, jobs) {

  const token = getToken();

  try {

    const res = await fetchWithTimeout(`${BASE_URL}/jobs/recommend`, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      },

      body: JSON.stringify({
        user,
        jobs
      })

    });

    /* =========================
       🚨 HTTP ERROR HANDLING
    ========================= */
    if (!res.ok) {

      const errorText = await res.text();

      throw new Error(
        `HTTP ${res.status}: ${errorText || "Request failed"}`
      );
    }

    return await res.json();

  } catch (error) {

    /* =========================
       🧯 SAFE ERROR RESPONSE
    ========================= */
    return {
      success: false,
      error: error.message || "API_ERROR",
      timestamp: Date.now()
    };
  }
}
