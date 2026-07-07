class FraudResult {
  final bool isFraudulent;
  final double fraudScore;
  final DateTime analyzedAt;
  final String reason;
  final List<String> flags;

  const FraudResult({
    required this.isFraudulent,
    required this.fraudScore,
    required this.analyzedAt,
    required this.reason,
    this.flags = const [],
  });

  factory FraudResult.clean({
    required double score,
  }) => FraudResult(
      isFraudulent: false,
      fraudScore: score,
      analyzedAt: DateTime.now(),
      reason: 'Certificate looks clean',
    );

  factory FraudResult.fraud({
    required double score,
    required String reason,
    List<String> flags = const [],
  }) => FraudResult(
      isFraudulent: true,
      fraudScore: score,
      analyzedAt: DateTime.now(),
      reason: reason,
      flags: flags,
    );
}

class FraudEngine {
  /// Analyse avancée (prête pour IA / backend / ML futur)
  FraudResult analyze(String certificateHash) {
    final hash = certificateHash.trim();

    if (hash.isEmpty) {
      return FraudResult.fraud(
        score: 100,
        reason: 'Empty certificate hash',
        flags: ['empty_hash'],
      );
    }

    final score = _calculateFraudScore(hash);

    final flags = <String>[
      if (hash.length < 16) 'short_hash',
      if (_hasRepeatingPattern(hash)) 'repeating_pattern',
      if (_isWeakEntropy(hash)) 'low_entropy',
    ];

    final isFraud = score >= 70 || flags.isNotEmpty;

    if (isFraud) {
      return FraudResult.fraud(
        score: score,
        reason: _buildReason(flags),
        flags: flags,
      );
    }

    return FraudResult.clean(score: score);
  }

  double _calculateFraudScore(String hash) {
    // logique simple mais évolutive
    return (hash.runes.fold<int>(0, (a, b) => a + b) % 100).toDouble();
  }

  bool _hasRepeatingPattern(String hash) => RegExp(r'(.)\1{4,}').hasMatch(hash);

  bool _isWeakEntropy(String hash) {
    final uniqueChars = hash.split('').toSet().length;
    return uniqueChars < (hash.length * 0.4);
  }

  String _buildReason(List<String> flags) {
    if (flags.isEmpty) return 'No anomalies detected';

    return 'Suspicious patterns detected: ${flags.join(', ')}';
  }
}