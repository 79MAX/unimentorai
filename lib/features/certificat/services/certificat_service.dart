import 'dart:typed_data';
import 'package:pdf/widgets.dart' as pw;
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:intl/intl.dart';

class CertificatService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseStorage _storage = FirebaseStorage.instance;

  Future<void> generateCertificate(String courseId, String courseTitle) async {
    final user = _auth.currentUser;
    if (user == null) return;

    final now = DateTime.now();
    final formattedDate = DateFormat('dd MMMM yyyy', 'fr_FR').format(now);
    final pdf = pw.Document();

    pdf.addPage(
      pw.Page(
        build: (pw.Context context) => pw.Center(
          child: pw.Column(
            mainAxisAlignment: pw.MainAxisAlignment.center,
            children: [
              pw.Text('CERTIFICAT DE RÉUSSITE', style: const pw.TextStyle(fontSize: 28, fontWeight: pw.FontWeight.bold)),
              pw.SizedBox(height: 30),
              pw.Text('Ce certificat est décerné à', style: const pw.TextStyle(fontSize: 16)),
              pw.SizedBox(height: 10),
              pw.Text(user.displayName ?? user.email ?? '', style: const pw.TextStyle(fontSize: 22, fontWeight: pw.FontWeight.bold)),
              pw.SizedBox(height: 20),
              pw.Text('Pour avoir complété le cours :', style: const pw.TextStyle(fontSize: 16)),
              pw.SizedBox(height: 10),
              pw.Text(courseTitle, style: const pw.TextStyle(fontSize: 20, fontWeight: pw.FontWeight.bold)),
              pw.SizedBox(height: 20),
              pw.Text('Date : $formattedDate', style: const pw.TextStyle(fontSize: 16)),
              pw.SizedBox(height: 50),
              pw.Text('UniMentorAI', style: const pw.TextStyle(fontSize: 18)),
            ],
          ),
        ),
      ),
    );

    final Uint8List pdfBytes = await pdf.save();

    final ref = _storage.ref().child('certificats/${user.uid}_$courseId.pdf');
    await ref.putData(pdfBytes);

    final downloadUrl = await ref.getDownloadURL();

    await _firestore.collection('certificats').add({
      'uid': user.uid,
      'courseId': courseId,
      'courseTitle': courseTitle,
      'url': downloadUrl,
      'createdAt': now,
    });
  }
}




