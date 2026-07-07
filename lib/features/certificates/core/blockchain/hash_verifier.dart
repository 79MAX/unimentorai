import 'certificate_hash_service.dart';

class HashVerifier {
  final CertificateHashService _service = CertificateHashService();

  bool verifyCertificate({
    required String storedHash,
    required String userId,
    required String courseId,
    required String certificateId,
    required DateTime issuedAt,
  }) => _service.verifyHash(
      expectedHash: storedHash,
      userId: userId,
      courseId: courseId,
      certificateId: certificateId,
      issuedAt: issuedAt,
    );
}




