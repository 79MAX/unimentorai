import axios from "axios";

// 🔧 Base API instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

// 🧠 Request interceptor (future auth JWT ready)
API.interceptors.request.use(
  (config) => {
    // Exemple futur: token injection
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🧠 Response interceptor (clean error handling)
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Network Error";

    console.error("API ERROR:", message);

    return Promise.reject({
      message,
      status: error.response?.status
    });
  }
);

export default API;