
/**
 * ==========================================
 * 💰 VIDEO REVENUE COLLECTOR
 * UniMentorAI Revenue Intelligence Core
 * ==========================================
 * Aggregates revenue data from:
 * - billing engine
 * - billing tracker
 * - billing events ledger
 * Produces unified financial intelligence
 */

class VideoRevenueCollector {

  constructor({ billingEngine, tracker, events }) {
    this.billingEngine = billingEngine;
    this.tracker = tracker;
    this.events = events;
  }

  /**
   * ==========================================
   * TOTAL PLATFORM REVENUE
   * ==========================================
   */
  getTotalRevenue() {

    const payments =
      this.events.events.filter(
        e => e.type === "PAYMENT"
      );

    return payments.reduce(
      (sum, e) => sum + (e.amount || 0),
      0
    );
  }

  /**
   * ==========================================
   * REVENUE BY USER
   * ==========================================
   */
  getRevenueByUser(userId) {

    const events =
      this.events.getUserEvents(userId);

    return events
      .filter(e => e.type === "PAYMENT")
      .reduce((sum, e) => sum + e.amount, 0);
  }

  /**
   * ==========================================
   * REVENUE BY SESSION
   * ==========================================
   */
  getRevenueBySession(sessionId) {

    const events =
      this.events.getSessionEvents(sessionId);

    return events
      .filter(e => e.type === "PAYMENT")
      .reduce((sum, e) => sum + e.amount, 0);
  }

  /**
   * ==========================================
   * REVENUE BY ROOM TYPE
   * ==========================================
   */
  getRevenueByRoomType(roomType) {

    const payments =
      this.events.events.filter(
        e =>
          e.type === "PAYMENT" &&
          e.metadata?.roomType === roomType
      );

    return payments.reduce(
      (sum, e) => sum + e.amount,
      0
    );
  }

  /**
   * ==========================================
   * DAILY REVENUE
   * ==========================================
   */
  getDailyRevenue(date = new Date()) {

    const start =
      new Date(date.setHours(0, 0, 0, 0)).getTime();

    const end =
      new Date(date.setHours(23, 59, 59, 999)).getTime();

    return this.events.events
      .filter(
        e =>
          e.type === "PAYMENT" &&
          e.timestamp >= start &&
          e.timestamp <= end
      )
      .reduce((sum, e) => sum + e.amount, 0);
  }

  /**
   * ==========================================
   * MONTHLY REVENUE
   * ==========================================
   */
  getMonthlyRevenue(month, year) {

    const start = new Date(year, month, 1).getTime();
    const end = new Date(year, month + 1, 0).getTime();

    return this.events.events
      .filter(
        e =>
          e.type === "PAYMENT" &&
          e.timestamp >= start &&
          e.timestamp <= end
      )
      .reduce((sum, e) => sum + e.amount, 0);
  }

  /**
   * ==========================================
   * TOP EARNING USERS
   * ==========================================
   */
  getTopUsers(limit = 10) {

    const map = new Map();

    this.events.events
      .filter(e => e.type === "PAYMENT")
      .forEach(e => {

        const userId = e.userId;

        map.set(
          userId,
          (map.get(userId) || 0) + e.amount
        );
      });

    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([userId, revenue]) => ({
        userId,
        revenue
      }));
  }

  /**
   * ==========================================
   * TOP REVENUE ROOMS
   * ==========================================
   */
  getTopRooms(limit = 10) {

    const map = new Map();

    this.events.events
      .filter(e => e.type === "PAYMENT")
      .forEach(e => {

        const roomId = e.sessionId;

        map.set(
          roomId,
          (map.get(roomId) || 0) + e.amount
        );
      });

    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([roomId, revenue]) => ({
        roomId,
        revenue
      }));
  }

  /**
   * ==========================================
   * CONVERSION RATE
   * ==========================================
   */
  getConversionRate() {

    const sessions =
      this.tracker.events.filter(
        e => e.type === "SESSION_REVENUE"
      ).length;

    const conversions =
      this.tracker.events.filter(
        e => e.type === "CONVERSION"
      ).length;

    return sessions
      ? conversions / sessions
      : 0;
  }

  /**
   * ==========================================
   * BUSINESS HEALTH SCORE
   * ==========================================
   */
  getBusinessHealth() {

    const revenue = this.getTotalRevenue();
    const conversions = this.getConversionRate();

    let score = 50;

    if (revenue > 1000) score += 20;
    if (revenue > 10000) score += 20;

    if (conversions > 0.5) score += 20;

    return Math.min(score, 100);
  }

  /**
   * ==========================================
   * FULL DASHBOARD SNAPSHOT
   * ==========================================
   */
  getDashboardSnapshot() {

    return {
      totalRevenue: this.getTotalRevenue(),
      dailyRevenue: this.getDailyRevenue(),
      monthlyRevenue: this.getMonthlyRevenue(
        new Date().getMonth(),
        new Date().getFullYear()
      ),

      topUsers: this.getTopUsers(),
      topRooms: this.getTopRooms(),

      conversionRate: this.getConversionRate(),
      businessHealth: this.getBusinessHealth()
    };
  }
}

module.exports =
  VideoRevenueCollector;
