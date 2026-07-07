/// Service for generating and managing certificate hashes
class CertificateHashService {
  String generateHash(String certificateId) => 'hash_$certificateId';

  bool validateHash(String hash, String certificateId) => hash == generateHash(certificateId);

  bool verifyHash(String originalHash, String currentHash) => originalHash == currentHash;
}

