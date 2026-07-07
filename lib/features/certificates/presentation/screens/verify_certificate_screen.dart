import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class VerifyCertificateScreen extends StatefulWidget {
  final String certificateId;

  const VerifyCertificateScreen({
    super.key,
    required this.certificateId,
  });

  @override
  State<VerifyCertificateScreen> createState() =>
      _VerifyCertificateScreenState();
}

class _VerifyCertificateScreenState
    extends State<VerifyCertificateScreen> {

  bool isLoading = true;
  bool isValid = false;

  Map<String, dynamic>? data;

  @override
  void initState() {
    super.initState();
    verify();
  }

  Future<void> verify() async {
    try {
      final doc = await FirebaseFirestore.instance
          .collection('certificates')
          .doc(widget.certificateId)
          .get();

      if (doc.exists) {
        setState(() {
          data = doc.data();
          isValid = true;
        });
      } else {
        setState(() {
          isValid = false;
        });
      }
    } catch (e) {
      setState(() {
        isValid = false;
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(
        title: const Text('Certificate Verification'),
        centerTitle: true,
      ),

      body: Center(
        child: isLoading
            ? const CircularProgressIndicator()

            : isValid

                // ✅ VALID CERTIFICATE
                ? Container(
                    margin: const EdgeInsets.all(20),
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.green.shade50,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.green),
                    ),

                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [

                        const Icon(
                          Icons.verified,
                          color: Colors.green,
                          size: 80,
                        ),

                        const SizedBox(height: 10),

                        const Text(
                          'CERTIFICAT VALIDE',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.green,
                          ),
                        ),

                        const SizedBox(height: 20),

                        Text(
                          "Étudiant: ${data?['studentName'] ?? ''}",
                        ),

                        Text(
                          "Cours: ${data?['courseName'] ?? ''}",
                        ),

                        Text(
                          'ID: ${widget.certificateId}',
                        ),
                      ],
                    ),
                  )

                // ❌ INVALID CERTIFICATE
                : Container(
                    margin: const EdgeInsets.all(20),
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.red.shade50,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.red),
                    ),

                    child: const Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [

                        Icon(
                          Icons.cancel,
                          color: Colors.red,
                          size: 80,
                        ),

                        SizedBox(height: 10),

                        Text(
                          'CERTIFICAT INVALIDE',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.red,
                          ),
                        ),
                      ],
                    ),
                  ),
      ),
    );
}




