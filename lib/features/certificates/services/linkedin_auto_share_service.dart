import 'dart:convert';

import 'package:url_launcher/url_launcher.dart';

class LinkedInAutoShareService {

  /// SHARE CERTIFICATE TO LINKEDIN
  static Future<void> shareCertificate({

    required String userName,
    required String courseName,
    required String certificateId,
    required String verificationUrl,

  }) async {

    final text = '''
🎓 I have successfully completed "$courseName" on UniMentorAI.

Certificate ID: $certificateId

Verify authenticity:
$verificationUrl

#UniMentorAI #Certification #Learning #Education #Skills
''';

    final encodedText = Uri.encodeComponent(text);

    final linkedInUrl =
        'https://www.linkedin.com/feed/?shareActive=true&text=$encodedText';

    final uri = Uri.parse(linkedInUrl);

    if (await canLaunchUrl(uri)) {
      await launchUrl(
        uri,
        mode: LaunchMode.externalApplication,
      );
    } else {
      throw Exception(
        'Could not launch LinkedIn share page',
      );
    }
  }

  /// GENERATE PUBLIC VERIFICATION URL
  static String generateVerificationUrl({
    required String certificateId,
    required String hash,
  }) {

    final payload = jsonEncode({
      'certificateId': certificateId,
      'hash': hash,
    });

    final encoded = Uri.encodeComponent(payload);

    return
        'https://unimentorai.com/verify?data=$encoded';
  }
}




