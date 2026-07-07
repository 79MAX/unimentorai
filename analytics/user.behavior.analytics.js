/* =========================
   👤 USER BEHAVIOR ANALYTICS
   UniMentorAI - CUSTOMER INTELLIGENCE ENGINE
========================= */

import { getBillingLogs } from "../logs/billing.logs.js";

export class UserBehaviorAnalytics {

  /* =========================
     🏆 TOP USERS (REVENUE BASED)
  ========================= */
  static topUsers(limit = 5) {

    const logs = getBillingLogs();

    const userMap = new Map();

    for (const log of logs) {

      if (!log.email) continue;

      if (!userMap.has(log.email)) {

        userMap.set(log.email, {
          email: log.email,
          totalRevenue: 0,
          transactions: 0
        });
      }

      const user = userMap.get(log.email);

      user.totalRevenue += Number(log.amount || 0);
      user.transactions += 1;
    }

    /* =========================
       📊 SORT + RANKING
    ========================= */
    return Array.from(userMap.values())
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }));
  }

  /* =========================
     📊 USER SEGMENTATION (NEW AI FEATURE)
  ========================= */
  static segmentUsers() {

    const users = this.topUsers(1000);

    const segments = {
      VIP: [],
      ACTIVE: [],
      LOW: []
    };

    for (const user of users) {

      if (user.totalRevenue > 500) {
        segments.VIP.push(user);
      }

      else if (user.totalRevenue > 100) {
        segments.ACTIVE.push(user);
      }

      else {
        segments.LOW.push(user);
      }
    }

    return segments;
  }

  /* =========================
     📈 USER INSIGHTS (AI READY)
  ========================= */
  static userInsights() {

    const users = this.topUsers(10);

    const avgRevenue = users.reduce(
      (sum, u) => sum + u.totalRevenue,
      0
    ) / (users.length || 1);

    return {
      averageTopUserRevenue: Math.round(avgRevenue),
      topUser: users[0] || null,
      totalActiveUsers: users.length
    };
  }
}
