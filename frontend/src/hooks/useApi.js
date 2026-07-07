import { useCallback, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3001";

export default function useApi() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, url, data = null) => {

    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        method,
        url: `${API_BASE}${url}`,
        data,
        timeout: 8000,
      });

      return response.data;

    } catch (err) {

      const message =
        err?.response?.data?.message ||
        err.message ||
        "API error";

      setError(message);

      return { error: message };

    } finally {
      setLoading(false);
    }

  }, []);

  /* =========================
     API METHODS (CLEAN WRAPPER)
  ========================= */

  const getHealth = useCallback(() => {
    return request("GET", "/api/health");
  }, [request]);

  const getAIStatus = useCallback(() => {
    return request("GET", "/api/ai-status");
  }, [request]);

  const getRoot = useCallback(() => {
    return request("GET", "/");
  }, [request]);

  return {
    loading,
    error,
    getHealth,
    getAIStatus,
    getRoot,
  };
}