import helmet from "helmet";
import cors from "cors";

export const securityMiddleware = (app) => {
  // 🔐 Helmet (headers sécurisés)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: false, // utile pour React + API
    })
  );

  // 🌍 CORS sécurisé
  app.use(
    cors({
      origin: (origin, callback) => {
        const allowedOrigins = [
          process.env.CLIENT_URL,
          "http://localhost:5173",
        ];

        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error("CORS not allowed"));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    })
  );

  // 📦 JSON limit safe
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
};
