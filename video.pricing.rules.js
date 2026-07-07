
/**
 * ==========================================
 * 💰 VIDEO PRICING RULES ENGINE
 * UniMentorAI SaaS Core Policy Layer
 * ==========================================
 * Central pricing rules for all video monetization logic
 * - base pricing
 * - role weights
 * - room classification
 * - duration scaling
 * - enterprise ready
 */

class VideoPricingRules {

  /**
   * ==========================================
   * BASE PRICE BY ROOM TYPE
   * ==========================================
   */
  basePrice(roomType) {

    const map = {
      public: 1,
      free_class: 0,
      standard_class: 5,
      coaching: 15,
      premium_session: 30,
      enterprise_session: 60
    };

    return map[roomType] ?? 5;
  }

  /**
   * ==========================================
   * ROLE MULTIPLIERS (VALUE-BASED PRICING)
   * ==========================================
   */
  roleMultiplier(role) {

    const map = {
      guest: 1.2,
      student: 1.0,
      subscriber: 0.95,
      premium_user: 0.9,
      mentor: 1.4,
      instructor: 1.6,
      host: 2.0,
      enterprise_admin: 2.5
    };

    return map[role] ?? 1;
  }

  /**
   * ==========================================
   * DURATION SCALING RULES
   * ==========================================
   */
  durationMultiplier(minutes) {

    if (minutes <= 15) return 0.8;
    if (minutes <= 30) return 1.0;
    if (minutes <= 60) return 1.25;
    if (minutes <= 120) return 1.6;
    if (minutes <= 240) return 2.0;

    return 2.5; // long enterprise sessions
  }

  /**
   * ==========================================
   * ROOM TYPE VALUE STRATEGY
   * ==========================================
   */
  roomTypeMultiplier(roomType) {

    const map = {
      public: 1,
      free_class: 0.5,
      standard_class: 1.2,
      coaching: 1.8,
      premium_session: 2.5,
      enterprise_session: 3.5
    };

    return map[roomType] ?? 1;
  }

  /**
   * ==========================================
   * FEATURE VALUE ADDITION (NOT MULTIPLIER)
   * ==========================================
   */
  featureValues(features = {}) {

    let value = 0;

    if (features.aiTutor) value += 10;
    if (features.recording) value += 6;
    if (features.hdQuality) value += 3;
    if (features.priorityQueue) value += 4;
    if (features.multiHost) value += 5;
    if (features.translation) value += 7;

    return value;
  }

  /**
   * ==========================================
   * DISCOUNT RULES (GROWTH LEVERS)
   * ==========================================
   */
  discountRules(context = {}) {

    let discount = 1;

    // onboarding boost
    if (context.isNewUser) {
      discount *= 0.9;
    }

    // loyalty discount
    if (context.daysActive > 30) {
      discount *= 0.95;
    }

    // bulk session purchase
    if (context.sessionCount > 5) {
      discount *= 0.85;
    }

    return discount;
  }

  /**
   * ==========================================
   * PREMIUM SURGE CONTROL FLAGS
   * ==========================================
   */
  surgeControl(roomContext = {}) {

    const ratio =
      (roomContext.activeUsers || 0) /
      (roomContext.capacity || 1);

    if (ratio > 0.9) return 2.0;
    if (ratio > 0.75) return 1.5;
    if (ratio > 0.5) return 1.2;

    return 1.0;
  }

  /**
   * ==========================================
   * PRICE FLOOR / CEILING SAFETY
   * ==========================================
   */
  boundaries() {

    return {
      min: 0,
      max: 1000
    };
  }

  /**
   * ==========================================
   * BUSINESS SEGMENT CLASSIFICATION
   * ==========================================
   */
  segmentMultiplier(segment) {

    const map = {
      free: 1,
      starter: 1,
      growth: 0.95,
      pro: 0.9,
      enterprise: 0.8,
      government: 0.75
    };

    return map[segment] ?? 1;
  }
}

module.exports = new VideoPricingRules();
