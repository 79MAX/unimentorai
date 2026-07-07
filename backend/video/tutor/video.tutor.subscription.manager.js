/**
 * video.tutor.subscription.manager.js
 * UniMentorAI - Subscription Core System
 */

class VideoTutorSubscriptionManager {
  constructor({
    eventBus,
    telemetry,
    logger,
    pricingCore,
    entitlementEngine
  }) {
    this.eventBus = eventBus;
    this.telemetry = telemetry;
    this.logger = logger;

    this.pricingCore = pricingCore;
    this.entitlementEngine = entitlementEngine;

    this.subscriptions = new Map();
  }

  /**
   * 📦 Create subscription
   */
  createSubscription(userId, plan = "free", geo = {}) {
    const now = Date.now();

    const subscription = {
      userId,
      plan,
      status: plan === "free" ? "active" : "trial",
      createdAt: now,
      renewAt: this._computeRenewDate(plan),
      cancelAt: null,
      geo,
      metadata: {
        version: "1.0.0"
      }
    };

    this.subscriptions.set(userId, subscription);

    this._emit("subscription.created", subscription);

    return subscription;
  }

  /**
   * 📥 Get subscription
   */
  getSubscription(userId) {
    return this.subscriptions.get(userId) || this.createSubscription(userId);
  }

  /**
   * ⬆️ Upgrade plan
   */
  upgrade(userId, newPlan) {
    const sub = this.getSubscription(userId);

    const oldPlan = sub.plan;

    sub.plan = newPlan;
    sub.status = "active";
    sub.renewAt = this._computeRenewDate(newPlan);

    this._emit("subscription.upgraded", {
      userId,
      from: oldPlan,
      to: newPlan
    });

    return sub;
  }

  /**
   * ⬇️ Downgrade plan
   */
  downgrade(userId, newPlan) {
    const sub = this.getSubscription(userId);

    const oldPlan = sub.plan;

    sub.plan = newPlan;

    this._emit("subscription.downgraded", {
      userId,
      from: oldPlan,
      to: newPlan
    });

    return sub;
  }

  /**
   * ❌ Cancel subscription
   */
  cancel(userId) {
    const sub = this.getSubscription(userId);

    sub.status = "cancelled";
    sub.cancelAt = Date.now();

    this._emit("subscription.cancelled", {
      userId
    });

    return sub;
  }

  /**
   * 🔐 Check access rights
   */
  canAccess(userId, feature) {
    const sub = this.getSubscription(userId);

    const entitlements =
      this.entitlementEngine.resolve(sub.plan);

    return entitlements.includes(feature);
  }

  /**
   * 💳 Billing event handler
   */
  handleBillingEvent(event) {
    switch (event.type) {
      case "payment.success":
        return this._activate(event.userId);

      case "payment.failed":
        return this._gracePeriod(event.userId);

      case "refund.created":
        return this._revoke(event.userId);

      default:
        return null;
    }
  }

  /**
   * 🟢 Activate subscription
   */
  _activate(userId) {
    const sub = this.getSubscription(userId);

    sub.status = "active";

    this._emit("subscription.activated", { userId });

    return sub;
  }

  /**
   * 🟡 Grace period
   */
  _gracePeriod(userId) {
    const sub = this.getSubscription(userId);

    sub.status = "grace_period";

    this._emit("subscription.grace_period", { userId });

    return sub;
  }

  /**
   * 🔴 Revoke access
   */
  _revoke(userId) {
    const sub = this.getSubscription(userId);

    sub.status = "revoked";

    this._emit("subscription.revoked", { userId });

    return sub;
  }

  /**
   * 📅 Renew date logic
   */
  _computeRenewDate(plan) {
    const now = Date.now();

    const durationMap = {
      free: 365 * 24 * 3600 * 1000,
      basic: 30 * 24 * 3600 * 1000,
      premium: 30 * 24 * 3600 * 1000,
      enterprise: 30 * 24 * 3600 * 1000
    };

    return now + (durationMap[plan] || durationMap.basic);
  }

  /**
   * 📡 Event emitter wrapper
   */
  _emit(type, payload) {
    this.eventBus.emit(type, {
      ...payload,
      timestamp: Date.now()
    });

    this.telemetry.collect({
      type,
      ...payload
    });

    this.logger.info("subscription_event", {
      type,
      userId: payload.userId
    });
  }

  /**
   * 📊 Subscription snapshot
   */
  getSnapshot(userId) {
    return this.getSubscription(userId);
  }
}

module.exports = VideoTutorSubscriptionManager;
