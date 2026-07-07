/**
 * video.tutor.subscription.manager.js
 */

class VideoTutorSubscriptionManager {
  constructor({
    eventBus,
    telemetry,
    logger,
    planRegistry,
    entitlementResolver
  }) {
    this.eventBus = eventBus;
    this.telemetry = telemetry;
    this.logger = logger;

    this.planRegistry = planRegistry;
    this.entitlementResolver = entitlementResolver;
  }

  /**
   * Subscription lookup
   */
  async getSubscription(userId) {
    return {
      userId,
      plan: "premium",
      status: "active",
      startedAt: Date.now(),
      renewAt: Date.now() + 30 * 24 * 3600 * 1000
    };
  }

  /**
   * Entitlement resolution
   */
  async getEntitlements(userId) {
    const subscription = await this.getSubscription(userId);

    return this.entitlementResolver.resolve(
      subscription.plan
    );
  }

  /**
   * Upgrade subscription
   */
  async upgrade(userId, targetPlan) {
    const current = await this.getSubscription(userId);

    const result = {
      userId,
      from: current.plan,
      to: targetPlan,
      upgradedAt: Date.now()
    };

    this.eventBus.emit(
      "subscription.upgraded",
      result
    );

    return result;
  }

  /**
   * Downgrade subscription
   */
  async downgrade(userId, targetPlan) {
    const current = await this.getSubscription(userId);

    const result = {
      userId,
      from: current.plan,
      to: targetPlan,
      downgradedAt: Date.now()
    };

    this.eventBus.emit(
      "subscription.downgraded",
      result
    );

    return result;
  }

  /**
   * Cancel subscription
   */
  async cancel(userId) {
    const result = {
      userId,
      status: "cancelled",
      cancelledAt: Date.now()
    };

    this.eventBus.emit(
      "subscription.cancelled",
      result
    );

    return result;
  }

  /**
   * Handle billing events
   */
  async handleBillingEvent(event) {
    switch (event.type) {

      case "payment.success":
        return this._onPaymentSuccess(event);

      case "payment.failed":
        return this._onPaymentFailure(event);

      case "subscription.renewed":
        return this._onRenewal(event);

      case "refund.created":
        return this._onRefund(event);

      default:
        return null;
    }
  }

  async _onPaymentSuccess(event) {
    this.telemetry.collect({
      type: "billing.success",
      userId: event.userId
    });

    this.eventBus.emit(
      "subscription.activated",
      event
    );
  }

  async _onPaymentFailure(event) {
    this.eventBus.emit(
      "subscription.grace_period",
      event
    );
  }

  async _onRenewal(event) {
    this.eventBus.emit(
      "subscription.renewed",
      event
    );
  }

  async _onRefund(event) {
    this.eventBus.emit(
      "subscription.refunded",
      event
    );
  }

  /**
   * Access validation
   */
  async canAccess(userId, feature) {
    const entitlements =
      await this.getEntitlements(userId);

    return entitlements.includes(feature);
  }
}

module.exports =
  VideoTutorSubscriptionManager;
