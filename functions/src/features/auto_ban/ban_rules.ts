export class BanRules {

  static SOFT_BAN_THRESHOLD = 70;
  static HARD_BAN_THRESHOLD = 85;
  static PERMANENT_THRESHOLD = 95;

  static SOFT_BAN_DURATION = 1000 * 60 * 60 * 24; // 24h
  static HARD_BAN_DURATION = 1000 * 60 * 60 * 24 * 7; // 7 days
}