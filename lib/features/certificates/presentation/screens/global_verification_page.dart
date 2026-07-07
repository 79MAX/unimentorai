import 'package:flutter/material.dart';
import '../../../../core/verification_api/verification_api_service.dart';

class GlobalVerificationPage extends StatefulWidget {
  const GlobalVerificationPage({super.key});

  @override
  State<GlobalVerificationPage> createState() =>
      _GlobalVerificationPageState();
}

class _GlobalVerificationPageState
    extends State<GlobalVerificationPage> {

  final _certificateController = TextEditingController();
  final _hashController = TextEditingController();

  final VerificationApiService _service =
      VerificationApiService();

  Map<String, dynamic>? result;

  bool loading = false;

  Future<void> verify() async {

    setState(() {
      loading = true;
    });

    final response = await _service.verifyCertificate(
      certificateId: _certificateController.text.trim(),
      providedHash: _hashController.text.trim(),
    );

    setState(() {
      result = response;
      loading = false;
    });
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'valid':
        return Colors.green;

      case 'suspicious':
        return Colors.orange;

      default:
        return Colors.red;
    }
  }

  IconData _statusIcon(String status) {
    switch (status) {
      case 'valid':
        return Icons.verified;

      case 'suspicious':
        return Icons.warning_amber;

      default:
        return Icons.cancel;
    }
  }

  @override
  Widget build(BuildContext context) {

    final status = result?['status'] ?? '';

    return Scaffold(
      backgroundColor: const Color(0xFF0B1120),

      appBar: AppBar(
        backgroundColor: const Color(0xFF111827),
        title: const Text(
          'GLOBAL CERTIFICATE VERIFICATION',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
      ),

      body: Center(
        child: SingleChildScrollView(
          child: Container(
            constraints: const BoxConstraints(maxWidth: 700),

            padding: const EdgeInsets.all(24),

            child: Column(
              children: [

                const Icon(
                  Icons.security,
                  size: 90,
                  color: Colors.blue,
                ),

                const SizedBox(height: 20),

                const Text(
                  'Verify Certificate Authenticity',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 10),

                const Text(
                  'Global blockchain-secured verification system',
                  style: TextStyle(
                    color: Colors.white70,
                  ),
                ),

                const SizedBox(height: 40),

                /// CERTIFICATE ID
                TextField(
                  controller: _certificateController,

                  style: const TextStyle(color: Colors.white),

                  decoration: InputDecoration(
                    filled: true,
                    fillColor: const Color(0xFF111827),

                    labelText: 'Certificate ID',
                    labelStyle:
                        const TextStyle(color: Colors.white70),

                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                /// HASH
                TextField(
                  controller: _hashController,

                  style: const TextStyle(color: Colors.white),

                  decoration: InputDecoration(
                    filled: true,
                    fillColor: const Color(0xFF111827),

                    labelText: 'Blockchain Hash',
                    labelStyle:
                        const TextStyle(color: Colors.white70),

                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                ),

                const SizedBox(height: 30),

                /// BUTTON
                SizedBox(
                  width: double.infinity,
                  height: 55,

                  child: ElevatedButton(
                    onPressed: loading ? null : verify,

                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                    ),

                    child: loading
                        ? const CircularProgressIndicator(
                            color: Colors.white,
                          )
                        : const Text(
                            'VERIFY CERTIFICATE',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                  ),
                ),

                const SizedBox(height: 40),

                /// RESULT
                if (result != null)
                  Container(
                    width: double.infinity,

                    padding: const EdgeInsets.all(24),

                    decoration: BoxDecoration(
                      color: const Color(0xFF111827),
                      borderRadius: BorderRadius.circular(18),

                      border: Border.all(
                        color: _statusColor(status),
                        width: 2,
                      ),
                    ),

                    child: Column(
                      children: [

                        Icon(
                          _statusIcon(status),
                          color: _statusColor(status),
                          size: 70,
                        ),

                        const SizedBox(height: 20),

                        Text(
                          status.toUpperCase(),
                          style: TextStyle(
                            color: _statusColor(status),
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                          ),
                        ),

                        const SizedBox(height: 25),

                        _infoTile(
                          'Certificate ID',
                          result!['certificateId'] ?? '-',
                        ),

                        _infoTile(
                          'User ID',
                          result!['userId'] ?? '-',
                        ),

                        _infoTile(
                          'Course ID',
                          result!['courseId'] ?? '-',
                        ),

                        _infoTile(
                          'Trust Score',
                          "${result!['trustScore'] ?? 0}",
                        ),

                        _infoTile(
                          'Blockchain',
                          result!['isBlockchainValid'] == true
                              ? 'VALID'
                              : 'INVALID',
                        ),

                        const SizedBox(height: 20),

                        if ((result!['flags'] as List).isNotEmpty)
                          Column(
                            crossAxisAlignment:
                                CrossAxisAlignment.start,
                            children: [

                              const Align(
                                alignment: Alignment.centerLeft,
                                child: Text(
                                  'Security Flags',
                                  style: TextStyle(
                                    color: Colors.red,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),

                              const SizedBox(height: 10),

                              ...List.generate(
                                (result!['flags'] as List).length,
                                (index) {

                                  final flag =
                                      result!['flags'][index];

                                  return Container(
                                    margin: const EdgeInsets.only(
                                        bottom: 8),

                                    padding:
                                        const EdgeInsets.all(12),

                                    decoration: BoxDecoration(
                                      color: Colors.red
                                          .withValues(alpha: 0.1),

                                      borderRadius:
                                          BorderRadius.circular(10),
                                    ),

                                    child: Row(
                                      children: [

                                        const Icon(
                                          Icons.warning,
                                          color: Colors.red,
                                        ),

                                        const SizedBox(width: 10),

                                        Expanded(
                                          child: Text(
                                            flag.toString(),
                                            style: const TextStyle(
                                              color: Colors.red,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  );
                                },
                              ),
                            ],
                          ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _infoTile(String title, String value) => Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),

      child: Row(
        mainAxisAlignment:
            MainAxisAlignment.spaceBetween,

        children: [

          Text(
            title,
            style: const TextStyle(
              color: Colors.white70,
            ),
          ),

          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.right,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
}




