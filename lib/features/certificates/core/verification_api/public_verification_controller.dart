import 'verification_api_service.dart';

class PublicVerificationController {
  final VerificationApiService _service = VerificationApiService();

  Future<Map<String, dynamic>> check(String certificateId, String hash) async => await _service.verifyCertificate(
      certificateId: certificateId,
      providedHash: hash,
    );
}




