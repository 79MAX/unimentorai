import 'package:flutter/material.dart';

class BlockchainStatusScreen extends StatelessWidget {
  const BlockchainStatusScreen({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(title: const Text('Blockchain Status')),
      body: const Center(
        child: Text('CERTIFICATE HASH LEDGER STATUS'),
      ),
    );
}

