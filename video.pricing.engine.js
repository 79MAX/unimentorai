
/**
 * ==========================================
 * 💰 VIDEO PRICING ENGINE (V2)
 * UniMentorAI SaaS Monetization Core
 * ==========================================
 * Real-time dynamic pricing for video sessions
 * - role-based pricing
 * - demand surge pricing
 * - feature-based monetization
 * - AI-ready hooks
 */

const PricingRules = require("./video.pricing.rules");

class VideoPricingEngine {

  /**
   * ==========================================
   * MAIN PRICE CALCULATION
   * ==========================================
   */
  calculate({ room, user, sessionContext }) {

    const basePrice =
      PricingRules.basePrice(room.type);

    let price = basePrice;

    // ==========================================
    // 1. ROLE MULTIPLIER
    // ==========================================
    price *= PricingRules.roleMultiplier(user.role);

    // ==========================================
    // 2. DURATION FACTOR
    // ==========================================
    price *= PricingRules.durationMultiplier(
      sessionContext.durationMinutes
    );

    // ==========================================
    // 3. ROOM TYPE PREMIUM
    // ==========================================
    price *= PricingRules.roomTypeMultiplier(room.type);

    // ==========================================
    // 4. DEMAND SURGE PRICING
    // ==========================================
    const demandMultiplier =
      this.calculateDemandMultiplier(room);

    price *= demandMultiplier;

    // ==========================================
    // 5. FEATURE MONETIZATION
    // ==========================================
    price += this.calculateFeatureAddons(room);

    // ==========================================
    // 6. USER VALUE SEGMENTATION
    // ==========================================
    price *= this.userSegmentMultiplier(user);

    // ==========================================
    // FINAL NORMALIZATION
    // ==========================================
    const finalPrice = Math.max(1, Math.round(price));

    return {
      basePrice,
      finalPrice,
      currency: "USD",
      breakdown: {
        role: user.role,
        roomType: room.type,
        demandMultiplier,
        features: room.features || {},
      }
    };
  }

  /**
   * ==========================================
   * DEMAND SURGE PRICING ENGINE
   * ==========================================
   */
  calculateDemandMultiplier(room) {

    const active = room.activeUsers || 0;
    const capacity = room.maxCapacity || 1;

    const ratio = active / capacity;

    if (ratio >= 0.95) return 2.0; // extreme demand
    if (ratio >= 0.8) return 1.6;
    if (ratio >= 0.6) return 1.3;
    if (ratio >= 0.4) return 1.1;

    return 1.0;
  }

  /**
   * ==========================================
   * FEATURE MONETIZATION ENGINE
   * ==========================================
   */
  calculateFeatureAddons(room) {

    let extra = 0;

    if (room.features?.aiTutor) extra += 8;
    if (room.features?.recording) extra += 5;
    if (room.features?.highQualityStream) extra += 3;
    if (room.features?.prioritySupport) extra += 4;

    return extra;
  }

  /**
   * ==========================================
   * USER SEGMENTATION ENGINE
   * ==========================================
   */
  userSegmentMultiplier(user) {

    const segments = {
      free: 1.0,
      basic: 1.0,
      premium: 0.9,
      pro: 0.85,
      enterprise: 0.8
    };

    return segments[user.plan] || 1.0;
  }

  /**
   * ==========================================
   * PRICE FLOOR / CEILING CONTROL
   * ==========================================
   */
  normalizePrice(price) {

    const MIN = 1;
    const MAX = 500;

    if (price < MIN) return MIN;
    if (price > MAX) return MAX;

    return price;
  }

  /**
   * ==========================================
   * AI PRICING HOOK (FUTURE READY)
   * ==========================================
   */
  applyAIAdjustment(price, signals = {}) {

    let adjusted = price;

    // engagement boost
    if (signals.engagement > 0.8) {
      adjusted *= 1.1;
    }

    // low demand discount
    if (signals.demand < 0.3) {
      adjusted *= 0.85;
    }

    // viral room boost
    if (signals.viralScore > 0.7) {
      adjusted *= 1.25;
    }

    return Math.round(adjusted);
  }
}

module.exports = new VideoPricingEngine();
