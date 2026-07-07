import helmet from "helmet";

/* =========================
   🛡️ SECURITY HEADERS (PRODUCTION READY)
========================= */
export const helmetConfig = helmet({
  // 🔐 protège les headers sensibles
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },

  // 🌐 empêche les fuites cross-origin sensibles
  crossOriginResourcePolicy: { policy: "cross-origin" },

  // 🧠 protège contre clickjacking
  frameguard: { action: "deny" },

  // 🔒 désactive sniffing MIME
  noSniff: true,

  // 🚫 masque technologie backend
  hidePoweredBy: true
});

