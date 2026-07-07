import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'services/qr_scanner_service.dart';

class QRScannerScreen extends StatefulWidget {
  const QRScannerScreen({super.key});

  @override
  State<QRScannerScreen> createState() => _QRScannerScreenState();
}

class _QRScannerScreenState extends State<QRScannerScreen> {
  final QRScannerService _service = QRScannerService();
  bool isProcessing = false;

  Future<void> onDetect(String code) async {
    if (isProcessing) return;

    setState(() => isProcessing = true);

    final result = await _service.verifyCertificateById(code);

    if (!mounted) return;

    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(result['valid'] ? 'VALID CERTIFICATE' : 'INVALID CERTIFICATE'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text("Trust Score: ${result['trustScore'] ?? 0}"),
            Text("Fraud: ${result['fraud']}"),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          )
        ],
      ),
    );

    setState(() => isProcessing = false);
  }

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(
        title: const Text('Certificate Scanner'),
        backgroundColor: Colors.black,
      ),
      body: Stack(
        children: [
          MobileScanner(
            onDetect: (capture) {
              final barcode = capture.barcodes.first;
              final code = barcode.rawValue;

              if (code != null) {
                onDetect(code);
              }
            },
          ),

          if (isProcessing)
            const Center(
              child: CircularProgressIndicator(),
            ),
        ],
      ),
    );
}




