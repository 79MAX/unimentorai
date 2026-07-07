import 'package:flutter/material.dart';

/// Webinar screen
class WebinarScreen extends StatelessWidget {
  const WebinarScreen({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(
        title: const Text('Webinar'),
      ),
      body: const Center(
        child: Text('Webinar Content'),
      ),
    );
}

