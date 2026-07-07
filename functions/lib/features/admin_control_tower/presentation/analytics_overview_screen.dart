import 'package:flutter/material.dart';

class AnalyticsOverviewScreen extends StatelessWidget {
  const AnalyticsOverviewScreen({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(title: const Text('Analytics')),
      body: const Center(
        child: Text('SYSTEM ANALYTICS DASHBOARD'),
      ),
    );
}

