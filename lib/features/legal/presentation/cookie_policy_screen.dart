import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;

class CookiePolicyScreen extends StatefulWidget {
  const CookiePolicyScreen({super.key});

  @override
  State<CookiePolicyScreen> createState() => _CookiePolicyScreenState();
}

class _CookiePolicyScreenState extends State<CookiePolicyScreen> {
  String _content = '';
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadPolicy();
  }

  /// 📄 LOAD COOKIE POLICY
  Future<void> _loadPolicy() async {
    try {
      final data = await rootBundle.loadString(
        'lib/features/legal/data/cookie_policy_en.md',
      );

      setState(() {
        _content = data;
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Unable to load cookie policy';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(
        title: const Text('🍪 Cookie Policy'),
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

          /// 🧠 HEADER CARD
          const Card(
            elevation: 2,
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Cookie Policy',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 6),
                  Text(
                    'This policy explains how UniMentorAI uses cookies to improve learning experience, personalization and security.',
                    style: TextStyle(fontSize: 13),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 16),

          /// 📄 CONTENT SECTION
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
            'Last updated: 2026 • UniMentorAI Legal System',
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