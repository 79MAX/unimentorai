import { processAIEvent } from "./ai.hook.js";

/**
 * ==================================================
 * AI FRAUD SEED V2
 * UniMentorAI AI Training Simulator
 * ==================================================
 *
 * 🎯 PURPOSE:
 * - Simulate real user behavior
 * - Simulate fraud patterns
 * - Test AI scoring engine
 * - Stress test alert system
 */

/**
 * 🚀 RUN AI FRAUD SEED
 */
export async function runAIFraudSeed() {
  console.log("🌱 Starting AI Fraud Simulation...");

  const scenarios = [
    normalUserBehavior(),
    mildSuspiciousBehavior(),
    bruteForceAttack(),
    accountTakeoverAttempt(),
    apiAbusePattern(),
    geoAnomalyAttack(),
    highConfidenceFraud(),
  ];

  for (const event of scenarios) {
    await delay(600);
    await processAIEvent(event);
  }

  console.log("✅ AI Fraud Simulation Completed");
}

/**
 * ==========================
 * 1. NORMAL USER
 * ==========================
 */
function normalUserBehavior() {
  return {
    type: "user:login",
    userId: "user_1000",
    ip: "102.45.12.8",
    failedAttempts: 0,
    requestRate: 2,
    sessionDuration: 300,
    deviceTrust: "HIGH",
    ipReputation: "GOOD",
  };
}

/**
 * ==========================
 * 2. MILD SUSPICIOUS
 * ==========================
 */
function mildSuspiciousBehavior() {
  return {
    type: "user:activity",
    userId: "user_1201",
    ip: "185.44.90.10",
    failedAttempts: 2,
    requestRate: 15,
    sessionDuration: 120,
    suspiciousBehavior: true,
  };
}

/**
 * ==========================
 * 3. BRUTE FORCE ATTACK
 * ==========================
 */
function bruteForceAttack() {
  return {
    type: "security:attack:bruteforce",
    userId: "user_2209",
    ip: "192.168.1.99",
    failedAttempts: 12,
    requestRate: 40,
    bruteforce: true,
    ipReputation: "BAD",
  };
}

/**
 * ==========================
 * 4. ACCOUNT TAKEOVER
 * ==========================
 */
function accountTakeoverAttempt() {
  return {
    type: "security:attack:detected",
    userId: "user_3401",
    ip: "154.72.11.33",
    failedAttempts: 5,
    geoMismatch: true,
    deviceTrust: "LOW",
    suspiciousBehavior: true,
  };
}

/**
 * ==========================
 * 5. API ABUSE
 * ==========================
 */
function apiAbusePattern() {
  return {
    type: "security:api:abuse",
    userId: "api_client_77",
    ip: "10.0.0.25",
    requestRate: 120,
    rateLimitExceeded: true,
  };
}

/**
 * ==========================
 * 6. GEO ANOMALY
 * ==========================
 */
function geoAnomalyAttack() {
  return {
    type: "security:risk:alert",
    userId: "user_8888",
    ip: "91.200.12.44",
    geoMismatch: true,
    deviceTrust: "MEDIUM",
  };
}

/**
 * ==========================
 * 7. HIGH CONFIDENCE FRAUD
 * ==========================
 */
function highConfidenceFraud() {
  return {
    type: "security:attack:detected",
    userId: "user_9999",
    ip: "185.220.101.22",
    failedAttempts: 20,
    requestRate: 200,
    bruteforce: true,
    suspiciousBehavior: true,
    ipReputation: "BAD",
    geoMismatch: true,
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
