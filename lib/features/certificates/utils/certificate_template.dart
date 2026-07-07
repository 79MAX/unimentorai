import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;

/// 🎓 TEMPLATE CENTRAL DU CERTIFICAT (DESIGN SYSTEM)
class CertificateTemplate {

  /// 🧾 BUILD HEADER
  static pw.Widget buildHeader() => pw.Column(
      children: [
        pw.Text(
          'UNIMENTORAI',
          style: const pw.TextStyle(
            fontSize: 18,
            fontWeight: pw.FontWeight.bold,
            color: PdfColors.blue,
          ),
        ),
        pw.SizedBox(height: 8),
        pw.Text(
          'CERTIFICATE OF COMPLETION',
          style: const pw.TextStyle(
            fontSize: 24,
            fontWeight: pw.FontWeight.bold,
          ),
        ),
        pw.Divider(thickness: 2),
      ],
    );

  /// 👤 USER NAME BLOCK
  static pw.Widget buildUserName(String name) => pw.Text(
      name,
      style: const pw.TextStyle(
        fontSize: 22,
        fontWeight: pw.FontWeight.bold,
        color: PdfColors.black,
      ),
    );

  /// 📘 COURSE TITLE BLOCK
  static pw.Widget buildCourseTitle(String courseTitle) => pw.Text(
      courseTitle,
      style: const pw.TextStyle(
        fontSize: 18,
        fontWeight: pw.FontWeight.bold,
        color: PdfColors.grey800,
      ),
    );

  /// 🧾 LABEL TEXT
  static pw.Widget buildLabel(String text) => pw.Text(
      text,
      style: const pw.TextStyle(
        fontSize: 12,
      ),
    );

  /// 🔐 FOOTER SIGNATURE
  static pw.Widget buildFooter(String certificateId) => pw.Column(
      children: [
        pw.SizedBox(height: 20),
        pw.Divider(),
        pw.Text('Verified by UniMentorAI'),
        pw.Text('Certificate ID: $certificateId'),
      ],
    );
}




