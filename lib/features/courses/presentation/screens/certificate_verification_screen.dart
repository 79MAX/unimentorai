import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class CertificateVerificationScreen extends StatefulWidget {
  const CertificateVerificationScreen({super.key});

  @override
  State<CertificateVerificationScreen> createState() =>
      _CertificateVerificationScreenState();
}

class _CertificateVerificationScreenState
    extends State<CertificateVerificationScreen> {

  final TextEditingController controller =
      TextEditingController();

  Map<String, dynamic>? result;
  bool isLoading = false;

  /// 🌍 VERIFY CERTIFICATE
  Future<void> verifyCertificate() async {

    setState(() {
      isLoading = true;
      result = null;
    });

    try {
      final id = controller.text.trim();

      final doc = await FirebaseFirestore.instance
          .collection('certificates')
          .doc(id)
          .get();

      if (!doc.exists) {
        setState(() {
          result = {
            'status': 'invalid',
            'message': 'Certificate not found'
          };
        });
        return;
      }

      setState(() {
        result = doc.data();
      });

    } catch (e) {
      setState(() {
        result = {
          'status': 'error',
          'message': e.toString()
        };
      });
    }

    setState(() => isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    final isValid = result?['status'] == 'valid';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Verify Certificate'),
        centerTitle: true,
      ),

      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [

            /// 🔎 INPUT
            TextField(
              controller: controller,
              decoration: const InputDecoration(
                labelText: 'Enter Certificate ID',
                border: OutlineInputBorder(),
              ),
            ),

            const SizedBox(height: 12),

            /// 🚀 VERIFY BUTTON
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed:
                    isLoading ? null : verifyCertificate,
                child: isLoading
                    ? const CircularProgressIndicator()
                    : const Text('Verify'),
              ),
            ),

            const SizedBox(height: 20),

            /// 📊 RESULT CARD
            if (result != null)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isValid
                      ? Colors.green.withValues(alpha: 0.1)
                      : Colors.red.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isValid
                        ? Colors.green
                        : Colors.red,
                  ),
                ),

                child: Column(
                  crossAxisAlignment:
                      CrossAxisAlignment.start,
                  children: [

                    Text(
                      isValid
                          ? 'VALID CERTIFICATE ✅'
                          : 'INVALID CERTIFICATE ❌',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: isValid
                            ? Colors.green
                            : Colors.red,
                      ),
                    ),

                    const SizedBox(height: 10),

                    Text(
                      "Course: ${result?['courseName'] ?? '-'}",
                    ),

                    Text(
                      "User: ${result?['userId'] ?? '-'}",
                    ),

                    Text(
                      "Hash: ${result?['hash'] ?? '-'}",
                    ),

                    Text(
                      "Status: ${result?['status'] ?? '-'}",
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}




