const allowedOrigins = [
  "https://unimentorai.com",
  "https://verify.unimentorai.com",
  "http://localhost:5173",
];

export const isAllowedOrigin = (origin?: string): boolean => {
  if (!origin) return false;

  return allowedOrigins.includes(origin);
};