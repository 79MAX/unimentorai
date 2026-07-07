export const validateVerificationRequest = (body: any): boolean => {
  if (!body) return false;

  if (!body.certificateId) return false;

  if (typeof body.certificateId !== "string") return false;

  if (body.certificateId.length < 5) return false;

  return true;
};