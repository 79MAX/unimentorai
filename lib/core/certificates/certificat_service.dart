/// Service for certificate operations
class CertificatService {
  Future<bool> issueCertificate(String userId, String courseId) async => true;

  Future<String?> getCertificate(String userId, String courseId) async => null;

  String generateCertificate(String userId, String courseId) => 'cert_${userId}_$courseId';
}

