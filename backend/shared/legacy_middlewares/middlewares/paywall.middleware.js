/* =========================
   ⚙️ PLAN HIERARCHY (Centralisée)
========================= */
const PLANS = Object.freeze({
  free: 0,
  pro: 1,
  enterprise: 2,
  // ajouter ici
});

/* =========================
   💎 PAYWALL MIDDLEWARE
========================= */
export function paywall(requiredPlan = "pro") {

  return (req, res, next) => {

    try {

      /* =========================
         1️⃣ AUTH VALIDATION
      ========================= */
      const user = req.user;

      if (!user || !user.id) {
        console.warn("🚫 PAYWALL: No user authenticated", {
          path: req.originalUrl,
          ip: req.ip
        });
        
        return res.status(401).json({
          success: false,
          code: "NO_AUTH",
          message: "Authentication required"
        });
      }

      /* =========================
         2️⃣ PLAN CHECK
      ========================= */
      const userPlan = (user.plan || "free").toLowerCase();
      const requiredLevel = PLANS[requiredPlan.toLowerCase()] ?? 1;
      const userLevel = PLANS[userPlan] ?? 0;

      /* =========================
         3️⃣ BLOCK IF INSUFFICIENT
      ========================= */
      if

