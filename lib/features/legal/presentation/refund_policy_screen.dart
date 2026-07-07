import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;

class RefundPolicyScreen extends StatefulWidget {
  const RefundPolicyScreen({super.key});

  @override
  State<RefundPolicyScreen> createState() => _RefundPolicyScreenState();
}

class _RefundPolicyScreenState extends State<RefundPolicyScreen> {
  String _content = '';
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadRefundPolicy();
  }

  /// 💸 LOAD REFUND POLICY
  Future<void> _loadRefundPolicy() async {
    try {
      final data = await rootBundle.loadString(
        'lib/features/legal/data/refund_policy_en.md',
      );

      setState(() {
        _content = data;
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Unable to load refund policy';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(
        title: const Text('💸 Refund Policy'),
        centerTitle: true,
      ),
      body: _buildBody(),
    );

  Widget _buildBody() {
    if (_loading) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if (_error != null) {
      return Center(
        child: Text(
          _error!,
          style: const TextStyle(color: Colors.red),
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [

          /// 📌 HEADER CARD
          const Card(
            elevation: 2,
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Refund Policy',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 6),
                  Text(
                    'This policy explains eligibility, conditions, and limitations for refunds on UniMentorAI services.',
                    style: TextStyle(fontSize: 13),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 16),

          /// 📄 CONTENT CARD
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: SelectableText(
                _content,
                style: const TextStyle(
                  fontSize: 14,
                  height: 1.6,
                ),
              ),
            ),
          ),

          const SizedBox(height: 20),

          /// ⚠️ FOOTER NOTE
          const Text(
            'UniMentorAI • Billing & Refund System',
            style: TextStyle(
              fontSize: 11,
              color: Colors.grey,
            ),
          ),
        ],
      ),
    );
  }
}