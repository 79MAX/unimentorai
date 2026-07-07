import { FraudLevel } from "./fraud_types";

export function computeFraudLevel(score: number): FraudLevel {
  if (score >= 80) return "FRAUD";
  if (score >= 60) return "HIGH_RISK";
  if (score >= 40) return "MEDIUM_RISK";
  if (score >= 20) return "LOW_RISK";
  return "SAFE";
}