import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;

class PrivacyPolicyScreen extends StatefulWidget {
  const PrivacyPolicyScreen({super.key});

  @override
  State<PrivacyPolicyScreen> createState() => _PrivacyPolicyScreenState();
}

class _PrivacyPolicyScreenState extends State<PrivacyPolicyScreen> {

  String _content = '';
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadPolicy();
  }

  /// 🔐 LOAD PRIVACY POLICY
  Future<void> _loadPolicy() async {
    try {
      final data = await rootBundle.loadString(
        'lib/features/legal/data/privacy_policy_en.md',
      );

      setState(() {
        _content = data;
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Unable to load privacy policy';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(
        title: const Text('🔐 Privacy Policy'),
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
                    'Privacy Policy',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 6),
                  Text(
                    'This policy explains how UniMentorAI collects, uses, and protects your personal data.',
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

          /// ⚠️ FOOTER
          const Text(
            'UniMentorAI • Privacy & Data Protection System',
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