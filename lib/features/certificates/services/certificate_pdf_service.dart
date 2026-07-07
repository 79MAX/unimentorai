import 'dart:typed_data';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';

class CertificatePdfService {

  /// 📄 GENERATE CERTIFICATE PDF
  Future<Uint8List> generateCertificate({
    required String userName,
    required String courseTitle,
    required String certificateId,
    required String certificateHash,
    required DateTime date,
  }) async {

    final pdf = pw.Document();

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        build: (context) => pw.Container(
            padding: const pw.EdgeInsets.all(24),
            decoration: pw.BoxDecoration(
              border: pw.Border.all(color: PdfColors.blue, width: 2),
            ),
            child: pw.Column(
              mainAxisAlignment: pw.MainAxisAlignment.center,
              children: [

                pw.Text(
                  'CERTIFICATE OF COMPLETION',
                  style: const pw.TextStyle(
                    fontSize: 24,
                    fontWeight: pw.FontWeight.bold,
                  ),
                ),

                pw.SizedBox(height: 20),

                pw.Text(
                  'This is to certify that',
                  style: const pw.TextStyle(fontSize: 14),
                ),

                pw.SizedBox(height: 10),

                pw.Text(
                  userName,
                  style: const pw.TextStyle(
                    fontSize: 22,
                    fontWeight: pw.FontWeight.bold,
                  ),
                ),

                pw.SizedBox(height: 10),

                pw.Text(
                  'has successfully completed the course',
                ),

                pw.SizedBox(height: 10),

                pw.Text(
                  courseTitle,
                  style: const pw.TextStyle(
                    fontSize: 18,
                    fontWeight: pw.FontWeight.bold,
                  ),
                ),

                pw.SizedBox(height: 20),

                pw.Text('Certificate ID: $certificateId'),
                pw.Text('Issued: ${date.toIso8601String()}'),

                pw.SizedBox(height: 20),

                pw.Text(
                  'Verified by UniMentorAI',
                  style: const pw.TextStyle(fontSize: 12),
                ),
              ],
            ),
          ),
      ),
    );

    return pdf.save();
  }

  /// 📤 PRINT OR DOWNLOAD
  Future<void> printCertificate(Uint8List pdfBytes) async {
    await Printing.layoutPdf(
      onLayout: (format) => pdfBytes,
    );
  }
}




