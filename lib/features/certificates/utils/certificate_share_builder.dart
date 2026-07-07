class CertificateShareBuilder {

  static String buildText({
    required String userName,
    required String courseTitle,
    required String certificateId,
    required String certificateHash,
    required String certificateUrl,
  }) => '''
🎓 I’m excited to share my new certification!

👤 Name: $userName
📘 Course: $courseTitle
🆔 Certificate ID: $certificateId
🔐 Verification Hash: $certificateHash

🌍 Verify here: $certificateUrl

Certified by UniMentorAI 🚀
#Certification #Learning #UniMentorAI #Education
''';
}




