import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   INTERCEPTOR (JWT AUTO)
========================= */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* =========================
   GLOBAL RESPONSE CLEANUP
========================= */
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    return Promise.reject(
      err.response?.data || { message: "NETWORK_ERROR" }
    );
  }
);

export default api;
