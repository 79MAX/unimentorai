const BASE_URL = "http://localhost:3000";

export async function getJobs(user, jobs) {

  try {

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${BASE_URL}/jobs/recommend`, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      signal: controller.signal,

      body: JSON.stringify({
        user,
        jobs
      })
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const data = await res.json();

    return {
      success: true,
      data
    };

  } catch (error) {

    return {
      success: false,
      error: error.message || "API_ERROR"
    };
  }
}
