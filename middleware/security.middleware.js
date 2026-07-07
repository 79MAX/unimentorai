import helmet from "helmet";

/**
 * ==========================
 * SECURITY CONFIG ENTERPRISE
 * ==========================
 */
export const securityMiddleware = [
  /**
   * ==========================
   * HELMET CORE HARDENING
   * ==========================
   */
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", process.env.CLIENT_URL || "*"],
      },
    },

    crossOriginEmbedderPolicy: false,
  }),

  /**
   * ==========================
   * CUSTOM SECURITY HEADERS
   * ==========================
   */
  (req, res, next) => {
    // Hide backend tech stack
    res.removeHeader("X-Powered-By");

    // Prevent clickjacking
    res.setHeader("X-Frame-Options", "DENY");

    // Prevent MIME sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");

    // XSS protection legacy support
    res.setHeader("X-XSS-Protection", "1; mode=block");

    // Strict transport (production ready)
    if (process.env.NODE_ENV === "production") {
      res.setHeader(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains"
      );
    }

    next();
  },

  /**
   * ==========================
   * BASIC INPUT SANITIZER (LIGHTWEIGHT)
   * ==========================
   */
  (req, res, next) => {
    const sanitize = (obj) => {
      if (!obj || typeof obj !== "object") return;

      for (const key in obj) {
        const value = obj[key];

        if (typeof value === "string") {
          // basic injection protection
          obj[key] = value
            .replace(/</g, "")
            .replace(/>/g, "")
            .replace(/\$/g, "")
            .trim();
        }

        if (typeof value === "object") {
          sanitize(value);
        }
      }
    };

    sanitize(req.body);
    sanitize(req.query);

    next();
  },

  /**
   * ==========================
   * REQUEST FINGERPRINTING (AI READY)
   * ==========================
   */
  (req, res, next) => {
    req.securityContext = {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      origin: req.headers.origin,
      time: Date.now(),
    };

    next();
  },
];

/**
 * ==========================
 * EXPORT DEFAULT
 * ==========================
 */
export default securityMiddleware;
