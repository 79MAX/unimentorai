import axios from "axios";

/* =========================
   BASE CONFIG
========================= */

const API_BASE_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   REQUEST INTERCEPTOR
   (READY FOR JWT / AUTH)
========================= */

api.interceptors.request.use(
  (config) => {
    // Future: inject token here
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */

api.interceptors.response.use(
  (response) => response,
  (error) => {

    const formattedError = {
      message:
        error?.response?.data?.message ||
        error.message ||
        "API Error",
      status: error?.response?.status || 500,
    };

    return Promise.reject(formattedError);
  }
);

/* =========================
   API METHODS (CLEAN LAYER)
========================= */

export const getHealth = async () => {
  const res = await api.get("/api/health");
  return res.data;
};

export const getAIStatus = async () => {
  const res = await api.get("/api/ai-status");
  return res.data;
};

export const getRootStatus = async () => {
  const res = await api.get("/");
  return res.data;
};

/* =========================
   GENERIC REQUEST (OPTIONAL FLEX)
========================= */

export const apiRequest = async (method, url, data = null) => {
  const res = await api({
    method,
    url,
    data,
  });

  return res.data;
};

export default api;