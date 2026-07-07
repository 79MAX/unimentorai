import 'verification_api.dart';

class VerificationController {
  final VerificationAPI _api = VerificationAPI();

  /// 🌍 PUBLIC VERIFY ENDPOINT LOGIC
  Future<Map<String, dynamic>> verify(String certificateId) async {
    final result = await _api.verifyCertificate(certificateId);
    return result.toJson();
  }
}




