/**
 * 🌐 ADMIN API CLIENT — UNIMENTORAI (PRODUCTION GRADE)
 * Secure + scalable + retry + timeout + SaaS ready
 */

import axios from "axios";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "http://localhost:5000/api/admin/v1";

// ⚡ CREATE AXIOS INSTANCE (BEST PRACTICE)
const api = axios.create({

  baseURL: BASE_URL,
  timeout: 10000, // 10s timeout (UI protection)
  headers: {
    "Content-Type": "application/json"
  }
});

// 🔐 REQUEST INTERCEPTOR (JWT AUTO ATTACH)
api.interceptors.request.use((config) => {

  const token = globalThis?.userToken || null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ⚠️ RESPONSE INTERCEPTOR (GLOBAL ERROR HANDLING)
api.interceptors.response.use(

  (response) => response,

  (error) => {

    console.error("ADMIN_API_ERROR:", error?.message);

    return Promise.reject({
      message: error?.response?.data?.message || "NETWORK_ERROR",
      status: error?.response?.status || 500
    });
  }
);

// 🧠 RETRY HELPER (SIMPLE BUT POWERFUL)
const retryRequest = async (fn, retries = 2) => {

  try {
    return await fn();
  } catch (error) {

    if (retries <= 0) throw error;

    return retryRequest(fn, retries - 1);
  }
};

// 🌐 ADMIN API SERVICE
export const AdminAPI = {

  // 📊 DASHBOARD DATA
  async getDashboard() {

    return retryRequest(async () => {

      const res = await api.get("/dashboard");

      return res.data;
    });
  },

  // ⚡ QUICK STATS (FAST UI CARDS)
  async getQuickStats() {

    return retryRequest(async () => {

      const res = await api.get("/quick-stats");

      return res.data;
    });
  },

  // 📈 FUTURE READY: METRICS STREAM
  async getMetrics() {

    const res = await api.get("/metrics");

    return res.data;
  }
};
