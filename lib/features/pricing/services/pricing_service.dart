enum PricingPlan {
  basic,
  standard,
  premium,
}

class PricingService {
  PricingService._();

  static final PricingService instance = PricingService._();

  static const Map<PricingPlan, double> _plans = {
    PricingPlan.basic: 5.0,
    PricingPlan.standard: 15.0,
    PricingPlan.premium: 50.0,
  };

  double getPrice(PricingPlan plan) => _plans[plan] ?? 0.0;

  List<PricingPlan> get availablePlans => _plans.keys.toList();

  bool isValidPlan(String plan) => PricingPlan.values.any(
      (p) => p.name == plan,
    );

  PricingPlan? parsePlan(String plan) {
    try {
      return PricingPlan.values.firstWhere(
        (p) => p.name == plan,
      );
    } catch (_) {
      return null;
    }
  }
}
