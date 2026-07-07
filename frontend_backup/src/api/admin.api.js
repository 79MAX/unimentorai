/**
 * 🌐 ADMIN API CLIENT — UNIMENTORAI (PRODUCTION CORE)
 * Backend communication layer (Stripe / Meta admin style)
 */

import axios from "axios";

/* =========================
   ⚙️ BASE CONFIG
========================= */
const BASE_URL = "http://localhost:5000/api/admin/v1";

/* =========================
   🚀 AXIOS INSTANCE (PRO LEVEL)
========================= */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

/* =========================
   🧠 REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {

    // 🔐 Attach token if exists
    const token = localStorage.getItem("admin_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   ⚠️ RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {

    const normalizedError = {
      message: error?.response?.data?.message || "API_ERROR",
      status: error?.response?.status || 500
    };

    return Promise.reject(normalizedError);
  }
);

/* =========================
   📊 ADMIN API
========================= */
export const AdminAPI = {

  /* =========================
     📊 DASHBOARD DATA
  ========================= */
  async getDashboard() {

    const res = await api.get("/dashboard");

    return res.data;
  },

  /* =========================
     ⚡ QUICK STATS (CARDS UI)
  ========================= */
  async getQuickStats() {

    const res = await api.get("/quick-stats");

    return res.data;
  },

  /* =========================
     📡 HEALTH CHECK
  ========================= */
  async getSystemHealth() {

    const res = await api.get("/system-health");

    return res.data;
  }
};
