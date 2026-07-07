import 'package:flutter/material.dart';

/// Reverse mentoring screen
class ReverseMentoringScreen extends StatelessWidget {
  const ReverseMentoringScreen({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(
        title: const Text('Reverse Mentoring'),
      ),
      body: const Center(
        child: Text('Reverse Mentoring Content'),
      ),
    );
}

