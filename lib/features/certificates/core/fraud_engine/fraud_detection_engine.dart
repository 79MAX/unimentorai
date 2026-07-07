import 'dart:math';

class FraudDetectionEngine {

  /// MAIN ENTRY POINT
  static FraudResult analyze({
    required String certificateId,
    required String userId,
    required String qrHash,
    required DateTime issuedAt,
    required List<String> scanHistory,
    required bool isBlockchainValid,
  }) {
    int score = 0;
    final List<String> flags = [];

    // 1. QR VALIDATION
    if (qrHash.isEmpty || qrHash.length < 20) {
      score += 40;
      flags.add('INVALID_QR_HASH');
    }

    // 2. BLOCKCHAIN CHECK
    if (!isBlockchainValid) {
      score += 50;
      flags.add('BLOCKCHAIN_MISMATCH');
    }

    // 3. SCAN ABUSE
    if (scanHistory.length > 50) {
      score += 20;
      flags.add('EXCESSIVE_SCANS');
    }

    // 4. TIMING ANOMALY
    final age = DateTime.now().difference(issuedAt).inDays;
    if (age < 0) {
      score += 60;
      flags.add('FUTURE_DATE_DETECTED');
    }

    // 5. RANDOM AI NOISE CHECK (SIMULATION V2)
    final randomFactor = Random().nextInt(10);
    if (randomFactor > 8) {
      score += 15;
      flags.add('ANOMALOUS_BEHAVIOR_PATTERN');
    }

    // FINAL DECISION
    FraudLevel level;

    if (score >= 80) {
      level = FraudLevel.highRisk;
    } else if (score >= 40) {
      level = FraudLevel.mediumRisk;
    } else {
      level = FraudLevel.safe;
    }

    return FraudResult(
      score: score,
      level: level,
      flags: flags,
      isTrusted: level == FraudLevel.safe,
    );
  }
}

enum FraudLevel {
  safe,
  mediumRisk,
  highRisk,
}

class FraudResult {
  final int score;
  final FraudLevel level;
  final List<String> flags;
  final bool isTrusted;

  FraudResult({
    required this.score,
    required this.level,
    required this.flags,
    required this.isTrusted,
  });
}




