class VerificationResult {
  final bool isValid;
  final String certificateHash;
  final DateTime verifiedAt;
  final double trustScore;
  final bool fraudDetected;
  final String? reason;

  const VerificationResult({
    required this.isValid,
    required this.certificateHash,
    required this.verifiedAt,
    this.trustScore = 1.0,
    this.fraudDetected = false,
    this.reason,
  });

  factory VerificationResult.valid({
    required String hash,
    double trustScore = 1.0,
  }) => VerificationResult(
      isValid: true,
      certificateHash: hash,
      verifiedAt: DateTime.now(),
      trustScore: trustScore,
    );

  factory VerificationResult.invalid({
    required String hash,
    String reason = 'Invalid certificate',
  }) => VerificationResult(
      isValid: false,
      certificateHash: hash,
      verifiedAt: DateTime.now(),
      trustScore: 0.0,
      fraudDetected: true,
      reason: reason,
    );
}

class VerificationService {
  /// Future-ready (API / Firebase / blockchain / hash registry)
  Future<VerificationResult> verifyCertificate({
    required String hash,
  }) async {
    if (hash.trim().isEmpty) {
      return VerificationResult.invalid(
        hash: hash,
        reason: 'Empty certificate hash',
      );
    }

    final normalizedHash = hash.trim();

    // Simulation logique avancée (remplaçable par API)
    final isValid = _basicHashCheck(normalizedHash);

    if (!isValid) {
      return VerificationResult.invalid(
        hash: normalizedHash,
        reason: 'Hash verification failed',
      );
    }

    return VerificationResult.valid(
      hash: normalizedHash,
      trustScore: _computeTrustScore(normalizedHash),
    );
  }

  bool _basicHashCheck(String hash) => hash.length >= 16;

  double _computeTrustScore(String hash) {
    // logique évolutive (blockchain / ML / fraud engine)
    return (hash.length % 10) / 10 + 0.5;
  }
}