import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:unimentorai/features/legal/presentation/legal_settings_screen.dart';
import 'package:unimentorai/features/legal/presentation/privacy_policy_screen.dart';
import 'package:unimentorai/features/legal/presentation/terms_of_service_screen.dart';
import 'package:unimentorai/features/legal/presentation/refund_policy_screen.dart';
import 'package:unimentorai/features/legal/presentation/cookie_policy_screen.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/legal/settings',

    routes: [

      GoRoute(
        path: '/legal/settings',
        builder: (context, state) => const LegalSettingsScreen(),
      ),

      GoRoute(
        path: '/legal/privacy',
        builder: (context, state) => const PrivacyPolicyScreen(),
      ),

      GoRoute(
        path: '/legal/terms',
        builder: (context, state) => const TermsOfServiceScreen(),
      ),

      GoRoute(
        path: '/legal/refund',
        builder: (context, state) => const RefundPolicyScreen(),
      ),

      GoRoute(
        path: '/legal/cookies',
        builder: (context, state) => const CookiePolicyScreen(),
      ),
    ],

    errorBuilder: (context, state) {
      return Scaffold(
        body: Center(
          child: Text('Route introuvable: ${state.uri}'),
        ),
      );
    },
  );
}