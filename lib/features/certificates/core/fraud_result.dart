/// Result model for fraud detection analysis
class FraudResult {
  final bool isFraudulent;
  final double fraudScore;
  final String reason;
  final DateTime analyzedAt;

  FraudResult({
    required this.isFraudulent,
    required this.fraudScore,
    required this.reason,
    required this.analyzedAt,
  });

  factory FraudResult.clean() => FraudResult(
    isFraudulent: false,
    fraudScore: 0.0,
    reason: 'No fraud detected',
    analyzedAt: DateTime.now(),
  );

  factory FraudResult.flagged({
    required String reason,
    required double score,
  }) => FraudResult(
    isFraudulent: score > 70,
    fraudScore: score,
    reason: reason,
    analyzedAt: DateTime.now(),
  );
}

