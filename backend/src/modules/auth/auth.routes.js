import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const router = express.Router();

/* =========================
   🧠 IN-MEMORY STORE (DEV ONLY)
   👉 replace later with DB (Mongo/Postgres)
========================= */
const USERS = new Map();

/* =========================
   🔐 CONFIG
========================= */
const SECRET = process.env.JWT_SECRET || "UNIMENTORAI_SECRET";
const TOKEN_EXPIRY = "7d";

/* =========================
   🔒 SECURITY UTIL
========================= */
function hashPassword(password) {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
}

function generateToken(user) {
  return jwt.sign(
    {
      email: user.email
    },
    SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

/* =========================
   👤 REGISTER
========================= */
router.post("/register", (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "MISSING_FIELDS"
    });
  }

  const normalizedEmail = email.toLowerCase();

  if (USERS.has(normalizedEmail)) {
    return res.status(409).json({
      success: false,
      error: "USER_ALREADY_EXISTS"
    });
  }

  const user = {
    email: normalizedEmail,
    password: hashPassword(password),
    createdAt: Date.now()
  };

  USERS.set(normalizedEmail, user);

  return res.status(201).json({
    success: true,
    message: "USER_CREATED"
  });
});

/* =========================
   🔐 LOGIN
========================= */
router.post("/login", (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "MISSING_FIELDS"
    });
  }

  const normalizedEmail = email.toLowerCase();
  const user = USERS.get(normalizedEmail);

  if (!user) {
    return res.status(401).json({
      success: false,
      error: "INVALID_CREDENTIALS"
    });
  }

  const hashedPassword = hashPassword(password);

  if (user.password !== hashedPassword) {
    return res.status(401).json({
      success: false,
      error: "INVALID_CREDENTIALS"
    });
  }

  const token = generateToken(user);

  return res.json({
    success: true,
    token,
    user: {
      email: user.email
    }
  });
});

export default router;

