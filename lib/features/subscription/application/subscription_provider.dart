import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../auth/application/user_profile_provider.dart';

/// =====================================================
/// PREMIUM STATUS (SAAS BILLING CORE FLAG)
/// =====================================================
///
/// 👉 Source unique pour :
/// - Stripe subscription
/// - Mobile Money subscription
/// - Admin override
/// - Free trial logic future
///
final isPremiumProvider = Provider<bool>((ref) {
final profile = ref.watch(userProfileProvider);

// SAFE FALLBACK (guest / null user)
if (profile == null) return false;

return profile.premium;
});

/// =====================================================
/// PREMIUM STATUS (STRICT VERSION - FUTURE BILLING RULES)
/// =====================================================
///
/// 👉 prêt pour Stripe / backend validation
final isPremiumStrictProvider = Provider<bool>((ref) {
final profile = ref.watch(userProfileProvider);

if (profile == null) return false;

// future upgrade:
// - stripeStatus == active
// - expirationDate check
// - admin override
return profile.premium;
});

