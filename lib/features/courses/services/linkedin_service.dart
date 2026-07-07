import 'dart:io';
import 'package:url_launcher/url_launcher.dart';
import '../utils/certificate_share_builder.dart';
import 'linkedin_share_model.dart';

class LinkedInService {

  /// 🔵 OPEN LINKEDIN SHARE DIALOG
  Future<void> shareCertificate(LinkedInShareModel data) async {

    final text = CertificateShareBuilder.buildText(
      userName: data.userName,
      courseTitle: data.courseTitle,
      certificateId: data.certificateId,
      certificateHash: data.certificateHash,
      certificateUrl: data.certificateUrl,
    );

    final encodedText = Uri.encodeComponent(text);

    final url = Uri.parse(
      'https://www.linkedin.com/sharing/share-offsite/?url=${data.certificateUrl}&summary=$encodedText'
    );

    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    } else {
      throw "Impossible d'ouvrir LinkedIn";
    }
  }
}




