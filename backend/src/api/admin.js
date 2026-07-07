import api from "FIX_REQUIRED_PATH";

export const getDashboard = () =>
  api.get("/api/admin/v1/dashboard");

export const getQuickStats = () =>
  api.get("/api/admin/v1/quick-stats");
