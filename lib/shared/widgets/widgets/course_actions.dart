import 'package:flutter/material.dart';
import '../../../core/certificates/certificat_service.dart';
import '../package:unimentorai/features/quiz/quiz_screen.dart';

class CertificatButton extends StatelessWidget {
  final String courseId;
  final String courseTitle;

  const CertificatButton({super.key, required this.courseId, required this.courseTitle});

  @override
  Widget build(BuildContext context) => ElevatedButton(
      onPressed: () async {
        final service = CertificatService();
        service.generateCertificate(courseId, courseTitle);

        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Certificat généré avec succès 🎓')),
          );
        }
      },
      child: const Text('Télécharger mon certificat'),
    );
}

class QuizButton extends StatelessWidget {
  final String courseId;
  final String courseTitle;

  const QuizButton({super.key, required this.courseId, required this.courseTitle});

  @override
  Widget build(BuildContext context) => ElevatedButton(
      onPressed: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => QuizScreen(courseId: courseId, courseTitle: courseTitle),
          ),
        );
      },
      child: const Text('Passer le test final'),
    );
}







