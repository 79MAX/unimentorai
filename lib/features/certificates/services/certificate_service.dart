import 'dart:typed_data';

import 'package:intl/intl.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;

class CertificateService {

  /// 🎓 GENERATE CERTIFICATE PDF
  Future<Uint8List> generateCertificate({
    required String studentName,
    required String courseName,
  }) async {

    final pdf = pw.Document();

    final currentDate =
        DateFormat('dd MMMM yyyy').format(DateTime.now());

    pdf.addPage(

      pw.Page(
        pageFormat: PdfPageFormat.a4,

        build: (context) => pw.Container(
            padding: const pw.EdgeInsets.all(40),

            child: pw.Column(
              mainAxisAlignment: pw.MainAxisAlignment.center,

              children: [

                pw.Text(
                  'CERTIFICAT',
                  style: const pw.TextStyle(
                    fontSize: 34,
                    fontWeight: pw.FontWeight.bold,
                  ),
                ),

                pw.SizedBox(height: 20),

                pw.Text(
                  'UniMentorAI',
                  style: const pw.TextStyle(
                    fontSize: 22,
                    color: PdfColors.blue,
                  ),
                ),

                pw.SizedBox(height: 50),

                pw.Text(
                  'Ce certificat est décerné à',
                  style: const pw.TextStyle(fontSize: 18),
                ),

                pw.SizedBox(height: 20),

                pw.Text(
                  studentName,
                  style: const pw.TextStyle(
                    fontSize: 28,
                    fontWeight: pw.FontWeight.bold,
                  ),
                ),

                pw.SizedBox(height: 30),

                pw.Text(
                  'pour avoir complété avec succès le cours',
                  style: const pw.TextStyle(fontSize: 18),
                  textAlign: pw.TextAlign.center,
                ),

                pw.SizedBox(height: 20),

                pw.Text(
                  courseName,
                  style: const pw.TextStyle(
                    fontSize: 24,
                    fontWeight: pw.FontWeight.bold,
                    color: PdfColors.blue900,
                  ),
                  textAlign: pw.TextAlign.center,
                ),

                pw.SizedBox(height: 50),

                pw.Text(
                  'Date: $currentDate',
                  style: const pw.TextStyle(fontSize: 16),
                ),

                pw.SizedBox(height: 60),

                pw.Row(
                  mainAxisAlignment:
                      pw.MainAxisAlignment.spaceBetween,

                  children: [

                    pw.Column(
                      children: [
                        pw.Container(
                          width: 150,
                          height: 1,
                          color: PdfColors.black,
                        ),
                        pw.SizedBox(height: 5),
                        pw.Text('Signature'),
                      ],
                    ),

                    pw.Column(
                      children: [
                        pw.Container(
                          width: 150,
                          height: 1,
                          color: PdfColors.black,
                        ),
                        pw.SizedBox(height: 5),
                        pw.Text('UniMentorAI'),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
      ),
    );

    return pdf.save();
  }
}




