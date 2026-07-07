import cors from "cors";

/* =========================
   🌍 CORS CONFIG (PRODUCTION READY)
========================= */
export const corsConfig = cors({
  origin: function (origin, callback) {

    // 🟢 allow server-to-server / mobile apps / postman
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
      "http://localhost:5173"
    ];

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS_NOT_ALLOWED"), false);
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],

  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ]
});

