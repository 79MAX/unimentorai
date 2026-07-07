import 'package:flutter/material.dart';

class FraudMonitorScreen extends StatelessWidget {
  const FraudMonitorScreen({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
      backgroundColor: const Color(0xFF0B1220),
      appBar: AppBar(title: const Text('Fraud Monitor')),
      body: const Center(
        child: Text(
          'REAL-TIME FRAUD DETECTION STREAM',
          style: TextStyle(color: Colors.white),
        ),
      ),
    );
}




