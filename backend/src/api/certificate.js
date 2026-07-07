import api from "FIX_REQUIRED_PATH";

export const verifyCertificate = (id) =>
  api.get(`/api/certificates/verify/${id}`);
