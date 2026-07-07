const express = require("express");
const router = express.Router();

const service = require("../services/certificate.service");

/* =========================
   ⚡ CACHE LAYER (FAST READ)
========================= */
const cache = new Map();

/* =========================
   🧠 STRICT ID VALIDATION
========================= */
function isValidId(id) {
  return typeof id === "string" && /^[A-Z0-9\-]{6,50}$/.test(id);
}

/* =========================
   📦 SAFE RESPONSE FORMATTER
========================= */
function response(success, message = "", data = null) {
  return {
    success,
    message,
    data,
    timestamp: Date.now()
  };
}

/* =========================
   🔐 VERIFY CERTIFICATE (PUBLIC API)
========================= */
router.get("/verify/:id", (req, res) => {
  const { id } = req.params;

  /* ❌ validation */
  if (!isValidId(id)) {
    return res.status(400).json(
      response(false, "Invalid certificate ID format")
    );
  }

  /* ⚡ cache hit */
  if (cache.has(id)) {
    return res.json(
      response(true, "Certificate verified (cache)", cache.get(id))
    );
  }

  /* 🔍 safe lookup (no direct ledger exposure) */
  const certBlock = service.getCertificateBlock(id);

  if (!certBlock) {
    return res.status(404).json(
      response(false, "Certificate not found")
    );
  }

  /* 🧼 sanitize output (anti data leak) */
  const result = {
    certificate: certBlock.data,
    block: {
      index: certBlock.index,
      hash: certBlock.hash,
      prevHash: certBlock.prevHash,
      timestamp: certBlock.timestamp
    }
  };

  /* ⚡ cache store */
  cache.set(id, result);

  return res.json(
    response(true, "Certificate verified successfully", result)
  );
});

module.exports = router;
