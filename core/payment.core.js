export class PaymentCore {

  /* =========================
     💰 PLANS SYSTEM (SCALABLE SAAS)
  ========================= */
  static getPlans() {

    return {
      FREE: {
        id: "FREE",
        price: 0,
        currency: "USD",
        features: [
          "Basic AI access",
          "Limited job matching"
        ]
      },

      PRO: {
        id: "PRO",
        price: 9.99,
        currency: "USD",
        billingCycle: "monthly",
        features: [
          "Unlimited AI coach",
          "Advanced job matching",
          "Mentoring system",
          "Certificates",
          "Priority support"
        ]
      }
    };
  }

  /* =========================
     🌍 SMART PROVIDER ROUTING (AFRICA + GLOBAL)
  ========================= */
  static getProviders(country = "BJ") {

    const africaProviders = [
      "KKIAPAY",
      "FLUTTERWAVE",
      "PAYSTACK",
      "MTN_MONEY",
      "MOOV_MONEY"
    ];

    const globalProviders = [
      "STRIPE",
      "PAYPAL"
    ];

    const africaCountries = [
      "BJ", "CI", "SN", "GH", "NG", "CM", "TG", "ML", "BF"
    ];

    return africaCountries.includes(country)
      ? africaProviders
      : globalProviders;
  }

  /* =========================
     💳 PAYMENT INITIALIZATION ENGINE
  ========================= */
  static initPayment({ user, plan, country = "BJ" }) {

    const plans = this.getPlans();
    const selectedPlan = plans[plan];

    if (!selectedPlan) {
      throw new Error("Invalid plan selected");
    }

    return {
      userId: user.id,
      email: user.email,
      plan: selectedPlan.id,
      amount: selectedPlan.price,
      currency: selectedPlan.currency,
      billingCycle: selectedPlan.billingCycle || "one-time",

      providers: this.getProviders(country),

      status: "PENDING",

      metadata: {
        country,
        createdAt: new Date().toISOString()
      }
    };
  }

  /* =========================
     🔐 PAYMENT CONFIRMATION ENGINE
  ========================= */
  static confirmPayment({ paymentId, provider, user, plan }) {

    return {
      paymentId,
      provider,
      userId: user.id,
      plan,

      status: "SUCCESS",

      access: {
        planActivated: plan,
        isPro: plan === "PRO"
      },

      activatedAt: new Date().toISOString()
    };
  }

  /* =========================
     📊 REVENUE TRACKING ENGINE (SAAS ANALYTICS)
  ========================= */
  static trackRevenue(payments = []) {

    const totalRevenue = payments.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    );

    const proUsers = payments.filter(p => p.plan === "PRO").length;

    return {
      totalRevenue,
      currency: "USD",
      totalTransactions: payments.length,
      proUsers,
      averageRevenue: payments.length
        ? totalRevenue / payments.length
        : 0
    };
  }
}
