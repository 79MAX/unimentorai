class FraudResult {
  final bool isFraud;
  final double confidence;
  final String? reason;

  const FraudResult({
    required this.isFraud,
    required this.confidence,
    this.reason,
  });

  factory FraudResult.clean() => const FraudResult(
    isFraud: false,
    confidence: 1.0,
  );
}

