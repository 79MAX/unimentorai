import 'package:flutter/material.dart';

class MentoringDashboardScreen extends StatelessWidget {
  const MentoringDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(title: const Text('Mentoring Dashboard')),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Mentoring Sessions History'),
            // TODO: List sessions, show analytics, pairing UI
          ],
        ),
      ),
    );
} 




