import 'package:flutter/material.dart';

import '../../../core/services/app_orchestrator_service.dart';
import '../../../core/routing/safe_router.dart';

import '../../../core/onboarding/onboarding_storage.dart';
import '../../../core/services/gamification_service.dart';
import '../../../core/blockchain/certificate_hash_service.dart';

class BootScreen extends StatefulWidget {
  const BootScreen({super.key});

  @override
  State<BootScreen> createState() => _BootScreenState();
}

class _BootScreenState extends State<BootScreen> {
  late AppOrchestratorService orchestrator;
  late SafeRouter router;

  @override
  void initState() {
    super.initState();
    _initBoot();
  }

  Future<void> _initBoot() async {
    orchestrator = AppOrchestratorService(
      onboardingStorage: OnboardingStorage(),
      gamificationService: GamificationService(),
      hashService: CertificateHashService(),
    );

    router = SafeRouter();

    final route = await router.resolve(orchestrator);

    if (!mounted) return;

    Navigator.pushReplacementNamed(context, route);
  }

  @override
  Widget build(BuildContext context) => const Scaffold(
      body: Center(
        child: CircularProgressIndicator(),
      ),
    );
}