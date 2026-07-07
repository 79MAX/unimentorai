import { triggerSecurityAlert } from "./alert.hook.js";
import {
  ALERT_TYPES,
  ALERT_LEVELS,
} from "./alert.types.js";

/**
 * ==================================================
 * ALERT SEED SIMULATOR V2
 * UniMentorAI Security Test Generator
 * ==================================================
 *
 * 🎯 PURPOSE:
 * - Simulate real-world attacks
 * - Test alert engine
 * - Feed dashboards & streams
 */

/**
 * 🚀 RUN SEED
 */
export async function runAlertSeed() {
  console.log("🌱 Starting Security Alert Seed...");

  const scenarios = [
    generateBruteForceAttack(),
    generateAccountTakeover(),
    generateApiAbuse(),
    generateRiskSpike(),
    generateSystemAnomaly(),
  ];

  for (const event of scenarios) {
    await delay(500);
    await triggerSecurityAlert(event);
  }

  console.log("✅ Security Alert Seed Completed");
}

/**
 * ==========================
 * SCENARIO 1: BRUTE FORCE
 * ==========================
 */
function generateBruteForceAttack() {
  return {
    type: ALERT_TYPES.BRUTE_FORCE,
    level: ALERT_LEVELS.HIGH,
    message: "Multiple failed login attempts detected",
    userId: "user_1001",
    ip: "192.168.1.45",
    score: 82,
    failedAttempts: 12,
    bruteforce: true,
  };
}

/**
 * ==========================
 * SCENARIO 2: ACCOUNT TAKEOVER
 * ==========================
 */
function generateAccountTakeover() {
  return {
    type: ALERT_TYPES.SESSION_HIJACK,
    level: ALERT_LEVELS.CRITICAL,
    message: "Suspicious session activity detected",
    userId: "user_2045",
    ip: "185.220.101.22",
    score: 95,
    suspiciousBehavior: true,
  };
}

/**
 * ==========================
 * SCENARIO 3: API ABUSE
 * ==========================
 */
function generateApiAbuse() {
  return {
    type: ALERT_TYPES.API_ABUSE,
    level: ALERT_LEVELS.MEDIUM,
    message: "Abnormal API request rate detected",
    userId: "api_client_77",
    ip: "10.0.0.12",
    score: 65,
    rateLimitExceeded: true,
  };
}

/**
 * ==========================
 * SCENARIO 4: RISK SPIKE
 * ==========================
 */
function generateRiskSpike() {
  return {
    type: ALERT_TYPES.RISK_ALERT,
    level: ALERT_LEVELS.HIGH,
    message: "Sudden risk score spike detected",
    userId: "user_889",
    ip: "154.12.33.9",
    score: 88,
  };
}

/**
 * ==========================
 * SCENARIO 5: SYSTEM ANOMALY
 * ==========================
 */
function generateSystemAnomaly() {
  return {
    type: ALERT_TYPES.SYSTEM_ANOMALY,
    level: ALERT_LEVELS.MEDIUM,
    message: "Unusual system behavior detected",
    userId: null,
    ip: null,
    score: 55,
    suspiciousBehavior: true,
  };
}

/**
 * ==========================
 * UTILS
 * ==========================
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
