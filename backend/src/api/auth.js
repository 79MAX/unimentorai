import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

/* LOGIN SIMPLE (TEMP) */
router.post("/login", (req, res) => {
  const { email } = req.body;

  const token = jwt.sign(
    { id: "1", email, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    token,
    user: { email, role: "admin" },
  });
});

router.get("/me", (req, res) => {
  res.json({
    success: true,
    user: req.user || null,
  });
});

export default router;
