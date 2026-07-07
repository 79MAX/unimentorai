export type BanLevel = "NONE" | "SOFT" | "HARD" | "PERMANENT";

export interface BanDecision {
  isBanned: boolean;
  level: BanLevel;
  reason: string[];
  expiresAt?: number;
}