import axios from "axios";

/* =========================
   🚀 UniMentorAI API CLIENT
========================= */

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

/* =========================
   🔐 AUTH TOKEN INJECTION
========================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   🚨 GLOBAL ERROR HANDLING
========================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "API Error";

    console.error("[UNI_API_ERROR]", message);

    // optionnel: auto logout si token expiré
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export default api;
