import 'package:flutter/material.dart';

class SystemStatusBadge extends StatelessWidget {
  final bool isHealthy;

  const SystemStatusBadge({super.key, required this.isHealthy});

  @override
  Widget build(BuildContext context) => Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: isHealthy ? Colors.green : Colors.red,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        isHealthy ? 'SYSTEM HEALTHY' : 'ISSUE DETECTED',
        style: const TextStyle(color: Colors.white),
      ),
    );
}

