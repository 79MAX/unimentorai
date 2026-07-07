import { onRequest } from "firebase-functions/v2/https";
import { FraudEngineV2 } from "../../features/fraud/fraud_engine";

export const globalVerificationAPI = onRequest(async (req, res) => {

  try {
    const {
      userId,
      certificateId,
      qrHash,
      ip,
      deviceId,
      timestamp
    } = req.body;

    // 1. Validate input
    if (!certificateId || !qrHash) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // 2. Run fraud engine
    const result = await FraudEngineV2.analyze({
      userId,
      certificateId,
      qrHash,
      ip,
      deviceId,
      timestamp: timestamp || Date.now()
    });

    // 3. Build global response (public API format)
    return res.status(200).json({
      success: true,
      verification: {
        certificateId,
        status: result.isFraud ? "INVALID" : "VALID",
        trustScore: 100 - result.score,
        riskLevel: result.level,
        reasons: result.reasons,
        verifiedAt: new Date().toISOString()
      }
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Verification system error",
      error: error.message
    });
  }
});