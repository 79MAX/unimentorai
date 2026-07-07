import 'package:flutter/material.dart';

class LiveActivityFeed extends StatelessWidget {
  const LiveActivityFeed({super.key});

  @override
  Widget build(BuildContext context) => ListView(
      children: const [
        ListTile(title: Text('QR Scan Verified')),
        ListTile(title: Text('Fraud Alert Triggered')),
        ListTile(title: Text('Certificate Issued')),
      ],
    );
}

