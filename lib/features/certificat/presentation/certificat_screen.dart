import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:printing/printing.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'dart:ui' as ui;
import 'package:flutter/services.dart' show rootBundle;
import 'package:url_launcher/url_launcher.dart';

class CertificatScreen extends StatelessWidget {
  final String userName;
  final String courseName;
  final String certId;
  final String? verificationUrl;

  const CertificatScreen({
    required this.userName,
    required this.courseName,
    required this.certId,
    this.verificationUrl,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final qrData = verificationUrl ?? 'https://unimentorai.com/verify-certificate?certificate_id=$certId';

    return Scaffold(
      appBar: AppBar(title: const Text('Certificat')),
      body: Center(
        child: Card(
          elevation: 8,
          margin: const EdgeInsets.all(24),
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('Certificat de réussite', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                const Text('Décerné à', style: TextStyle(fontSize: 16)),
                Text(userName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
                const SizedBox(height: 8),
                const Text('Pour avoir complété le cours', style: TextStyle(fontSize: 16)),
                Text(courseName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                const SizedBox(height: 24),
                QrImageView(
                  data: qrData,
                  size: 120.0,
                ),
                const SizedBox(height: 8),
                const Text('Scannez ce QR code pour vérifier l\'authenticité', style: TextStyle(fontSize: 12)),
                const SizedBox(height: 16),
                ElevatedButton.icon(
                  icon: const Icon(Icons.picture_as_pdf),
                  label: const Text('Télécharger en PDF'),
                  onPressed: () => _generatePdf(context, userName, courseName, qrData),
                ),
                const SizedBox(height: 8),
                OutlinedButton.icon(
                  icon: const Icon(Icons.verified),
                  label: const Text('Vérifier le certificat'),
                  onPressed: () async {
                    final uri = Uri.tryParse(qrData);
                    if (uri != null) {
                      await launchUrl(uri, mode: LaunchMode.externalApplication);
                    }
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _generatePdf(BuildContext context, String userName, String courseName, String qrData) async {
    final pdf = await createCertificatePdf(userName, courseName, qrData);
    await Printing.layoutPdf(onLayout: (format) => pdf.save());
  }
}

Future<pw.Document> createCertificatePdf(String userName, String courseName, String qrData) async {
  final pdf = pw.Document();

  // Ajout du logo
  final logo = pw.MemoryImage(
    (await rootBundle.load('assets/logo.png')).buffer.asUint8List(),
  );

  // Générer l'image du QR code
  final qrValidationResult = QrValidator.validate(
    data: qrData,
  );
  final qrCode = qrValidationResult.qrCode;
  final painter = QrPainter.withQr(
    qr: qrCode!,
    color: const Color(0xFF000000),
    emptyColor: const Color(0xFFFFFFFF),
    gapless: true,
  );
  final image = await painter.toImage(200);
  final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
  final qrImageBytes = byteData!.buffer.asUint8List();

  pdf.addPage(
    pw.Page(
      build: (pw.Context context) => pw.Center(
          child: pw.Container(
            padding: const pw.EdgeInsets.all(32),
            decoration: pw.BoxDecoration(
              border: pw.Border.all(color: PdfColors.blue, width: 2),
              borderRadius: pw.BorderRadius.circular(12),
            ),
            child: pw.Column(
              mainAxisSize: pw.MainAxisSize.min,
              children: [
                pw.Image(logo, width: 80),
                pw.SizedBox(height: 16),
                pw.Text('Certificat de réussite', style: const pw.TextStyle(fontSize: 24, fontWeight: pw.FontWeight.bold)),
                pw.SizedBox(height: 16),
                pw.Text('Décerné à', style: const pw.TextStyle(fontSize: 16)),
                pw.Text(userName, style: const pw.TextStyle(fontSize: 20, fontWeight: pw.FontWeight.bold)),
                pw.SizedBox(height: 8),
                pw.Text('Pour avoir complété le cours', style: const pw.TextStyle(fontSize: 16)),
                pw.Text(courseName, style: const pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold)),
                pw.SizedBox(height: 24),
                pw.Image(pw.MemoryImage(qrImageBytes), width: 100, height: 100),
                pw.SizedBox(height: 8),
                pw.Text('Scannez ce QR code pour vérifier l\'authenticité', style: const pw.TextStyle(fontSize: 10)),
                pw.SizedBox(height: 24),
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.end,
                  children: [
                    pw.Text('Signature : ', style: const pw.TextStyle(fontSize: 12)),
                    pw.SizedBox(width: 8),
                    pw.Image(logo, width: 40), // Utilise le logo comme signature exemple
                  ],
                ),
              ],
            ),
          ),
        ),
    ),
  );

  return pdf;
} 
 
 




