import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;

class TermsOfServiceScreen extends StatefulWidget {
  const TermsOfServiceScreen({super.key});

  @override
  State<TermsOfServiceScreen> createState() => _TermsOfServiceScreenState();
}

class _TermsOfServiceScreenState extends State<TermsOfServiceScreen> {
  String _content = '';
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadTerms();
  }

  /// 📜 LOAD TERMS OF SERVICE
  Future<void> _loadTerms() async {
    try {
      final data = await rootBundle.loadString(
        'lib/features/legal/data/terms_of_service_en.md',
      );

      setState(() {
        _content = data;
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Unable to load terms of service';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(
        title: const Text('📜 Terms of Service'),
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
                    'Terms of Service',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 6),
                  Text(
                    'These terms govern your use of UniMentorAI services, courses, payments, and AI features.',
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
            'UniMentorAI • Legal Framework System',
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