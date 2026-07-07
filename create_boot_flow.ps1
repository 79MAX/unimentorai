$path = "lib\features\app\presentation"

New-Item -ItemType Directory -Force -Path $path | Out-Null

@"
import 'package:flutter/material.dart';
import '../../../core/services/app_orchestrator_service.dart';
import '../../../core/routing/safe_router.dart';
import '../../../core/blockchain/certificate_hash_service.dart';
import '../../../core/services/gamification_service.dart';

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

    orchestrator = AppOrchestratorService(
      onboardingStorage: OnboardingStorage(),
      gamificationService: GamificationService(),
      hashService: CertificateHashService(),
    );

    router = SafeRouter(orchestrator);

    _init();
  }

  Future<void> _init() async {
    final route = await router.resolve("currentUser");

    if (!mounted) return;

    Navigator.pushReplacementNamed(context, route);
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: CircularProgressIndicator()),
    );
  }
}
"@ | Set-Content "$path\boot_screen.dart"

Write-Host "BOOT FLOW CREATED SUCCESSFULLY"
