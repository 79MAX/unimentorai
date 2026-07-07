import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./api/auth.routes.js";
import aiRoutes from "./api/ai.routes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
app.use(limiter);

app.use("/auth", authRoutes);
app.use("/ai", aiRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(3000, () => {
  console.log("UniMentorAI CORE V2 RUNNING");
});
