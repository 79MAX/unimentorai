import jwt from "jsonwebtoken";

/* =========================
   🔐 AUTH MIDDLEWARE
   UniMentorAI - Security Layer
========================= */

export const authMiddleware = (req, res, next) => {

  /* =========================
     🔍 TOKEN EXTRACTION
  ========================= */
  const authHeader = req.headers.authorization;

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  /* =========================
     🚨 NO TOKEN CASE
  ========================= */
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "NO_TOKEN"
    });
  }

  /* =========================
     🔐 TOKEN VERIFICATION
  ========================= */
  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* =========================
       👤 ATTACH USER CONTEXT
    ========================= */
    req.user = {
      id: decoded.id,
      ...decoded
    };

    next();

  } catch (err) {

    return res.status(401).json({
      success: false,
      error: "INVALID_TOKEN"
    });
  }
};
