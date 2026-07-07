import 'package:flutter/material.dart';

class FraudRiskChart extends StatelessWidget {
  const FraudRiskChart({super.key});

  @override
  Widget build(BuildContext context) => Container(
      height: 200,
      decoration: BoxDecoration(
        color: const Color(0xFF111827),
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Center(
        child: Text(
          'FRAUD RISK CHART (AI SCORE)',
          style: TextStyle(color: Colors.white70),
        ),
      ),
    );
}

