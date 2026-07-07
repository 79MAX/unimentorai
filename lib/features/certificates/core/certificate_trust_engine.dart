import 'services/verification_service.dart';

class CertificateTrustEngine {

  static Future<Map<String, dynamic>> processScan(Map qrData) async {

    final result = await VerificationService.verifyQR(
      certificateId: qrData['certificateId'],
      qrHash: qrData['qrHash'],
      userId: qrData['userId'],
    );

    return result;
  }
}




