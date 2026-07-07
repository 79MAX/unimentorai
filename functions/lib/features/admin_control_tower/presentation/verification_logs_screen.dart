import 'package:flutter/material.dart';

class VerificationLogsScreen extends StatelessWidget {
  const VerificationLogsScreen({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(title: const Text('Verification Logs')),
      body: const Center(
        child: Text('GLOBAL VERIFICATION HISTORY'),
      ),
    );
}

