import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { secureVerificationRequest } from "../../security/api_security";
import { FraudEngineV2 } from "../fraud/fraud_engine_v2";
import { BlockchainCertificateEngine } from "../certificates/blockchain/blockchain_certificate_engine";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// ─────────────────────────────────────────────
// 🌐 SAFE UTILITIES
// ─────────────────────────────────────────────

const getClientIp = (req: functions.https.Request): string => {
  const forwarded = req.headers["x-forwarded-for"];
  return (
    (Array.isArray(forwarded) ? forwarded[0] : forwarded?.toString()) ||
    req.socket?.remoteAddress ||
    "unknown"
  );
};

// ─────────────────────────────────────────────
// 🔐 MAIN FUNCTION
// ─────────────────────────────────────────────

export const globalVerificationAPI = functions.https.onRequest(
  async (req, res) => {

    const startTime = Date.now();

    // 🌍 SECURITY HEADERS (HARDENED)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");

    // ⚡ PRE-FLIGHT
    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    // 🔐 GATEKEEPER (ZERO TRUST ENTRY POINT)
    if (!secureVerificationRequest(req, res)) return;

    try {

      const {
        certificateId,
        qrHash,
        userId,
        deviceId,
        userAgent,
      } = req.body ?? {};

      // ⚡ EARLY VALIDATION (FAST FAIL)
      if (!certificateId || !qrHash) {
        return res.status(400).json({
          success: false,
          status: "INVALID_REQUEST",
          message: "certificateId and qrHash are required",
        });
      }

      const ip = getClientIp(req);

      // ⛓ BLOCKCHAIN CHECK (FIRST SECURITY LAYER)
      const blockchainResult =
        await BlockchainCertificateEngine.verifyCertificate(
          certificateId,
          qrHash
        );

      if (!blockchainResult.valid) {

        await db.collection("verification_logs").add({
          certificateId,
          status: "INVALID",
          source: "BLOCKCHAIN",
          ip,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return res.status(200).json({
          success: true,
          status: "INVALID",
          source: "BLOCKCHAIN",
          trustScore: 0,
          blockchainValid: false,
          message: "Certificate hash mismatch",
          latencyMs: Date.now() - startTime,
        });
      }

      // 🧠 FRAUD AI ENGINE (SECOND LAYER)
      const fraudResult = await FraudEngineV2.analyze({
        certificateId,
        qrHash,
        userId,
        deviceId,
        userAgent,
        ip,
        timestamp: Date.now(),
      });

      const trustScore = fraudResult.score;

      // 🚨 DECISION ENGINE (CLEAN RULE MODEL)
      const finalStatus =
        fraudResult.isFraud || trustScore >= 80
          ? "FRAUD"
          : trustScore >= 50
            ? "SUSPICIOUS"
            : "VALID";

      // 📊 AUDIT LOG (STRUCTURED + SCALABLE)
      await db.collection("verification_logs").add({
        certificateId,
        qrHash,
        userId: userId ?? null,
        deviceId: deviceId ?? null,
        userAgent: userAgent ?? null,
        ip,
        status: finalStatus,
        trustScore,
        fraudLevel: fraudResult.level,
        reasons: fraudResult.reasons ?? [],
        blockchainValid: true,
        latencyMs: Date.now() - startTime,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // ✅ RESPONSE CONTRACT (CLEAN API SURFACE)
      return res.status(200).json({
        success: true,
        status: finalStatus,
        trustScore,
        fraudLevel: fraudResult.level,
        blockchainValid: true,
        reasons: fraudResult.reasons ?? [],
        latencyMs: Date.now() - startTime,
      });

    } catch (error: any) {

      console.error("GLOBAL_VERIFICATION_ERROR:", error);

      // 🧯 SAFE FAILURE MODE
      return res.status(500).json({
        success: false,
        status: "ERROR",
        message: "Internal verification failure",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
        latencyMs: Date.now() - startTime,
      });
    }
  }
);