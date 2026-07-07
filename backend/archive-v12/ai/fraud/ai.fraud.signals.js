
/**
 * ========================
 * 🔍 FRAUD SIGNALS ENGINE
 * UniMentorAI SaaS Intelligence Layer
 * ========================
 * Extracts behavioral + transactional signals for fraud detection
 */

class FraudSignals {

  /**
   * ========================
   * 🚀 MAIN SIGNAL EXTRACTION
   * ========================
   */
  extract({ events = [], users = [], transactions = [] }) {

    return {
      transactionSignals: this.transactionSignals(transactions),
      behaviorSignals: this.behaviorSignals(events),
      userSignals: this.userSignals(users),
      velocitySignals: this.velocitySignals(transactions, events)
    };
  }

  /**
   * ========================
   * 💰 TRANSACTION SIGNALS
   * ========================
   */
  transactionSignals(transactions) {

    const total = transactions.length;

    const totalAmount = transactions.reduce(
      (sum, t) => sum + (t.amount || 0), 0
    );

    const avgAmount = total > 0 ? totalAmount / total : 0;

    const highValueTx = transactions.filter(t => t.amount > 1000).length;

    const failedTx = transactions.filter(t => t.status === "failed").length;

    return {
      totalTransactions: total,
      totalAmount,
      avgAmount,
      highValueRatio: total > 0 ? highValueTx / total : 0,
      failureRate: total > 0 ? failedTx / total : 0
    };
  }

  /**
   * ========================
   * 👤 USER BEHAVIOR SIGNALS
   * ========================
   */
  behaviorSignals(events) {

    const uniqueUsers = new Set(events.map(e => e.userId)).size;

    const loginEvents = events.filter(e => e.type === "login");

    const suspiciousLogins = loginEvents.filter(e =>
      e.metadata?.failedAttempts > 3
    ).length;

    return {
      uniqueActiveUsers: uniqueUsers,
      loginEvents: loginEvents.length,
      suspiciousLoginRate: loginEvents.length > 0
        ? suspiciousLogins / loginEvents.length
        : 0
    };
  }

  /**
   * ========================
   * 👤 USER PROFILE SIGNALS
   * ========================
   */
  userSignals(users) {

    const newUsers = users.filter(u => {
      const created = new Date(u.createdAt);
      const diff = Date.now() - created.getTime();
      return diff < 86400000; // 24h
    }).length;

    const incompleteProfiles = users.filter(u =>
      !u.email || !u.phone
    ).length;

    return {
      totalUsers: users.length,
      newUsers,
      incompleteProfilesRate:
        users.length > 0 ? incompleteProfiles / users.length : 0
    };
  }

  /**
   * ========================
   * ⚡ VELOCITY SIGNALS (CRITICAL FOR FRAUD)
   * ========================
   */
  velocitySignals(transactions, events) {

    const now = Date.now();

    const last1MinTx = transactions.filter(t =>
      now - new Date(t.timestamp).getTime() < 60000
    ).length;

    const last5MinEvents = events.filter(e =>
      now - new Date(e.timestamp).getTime() < 300000
    ).length;

    const rapidGrowth = transactions.length > 0 &&
      last1MinTx / transactions.length > 0.3;

    return {
      transactionsPerMinute: last1MinTx,
      eventsPer5Min: last5MinEvents,
      rapidVelocityDetected: rapidGrowth
    };
  }
}

module.exports = new FraudSignals();
