class FraudScoreModel {
  final String certificateId;
  final int score;
  final String level;
  final DateTime checkedAt;

  FraudScoreModel({
    required this.certificateId,
    required this.score,
    required this.level,
    required this.checkedAt,
  });

  Map<String, dynamic> toMap() => {
      'certificateId': certificateId,
      'score': score,
      'level': level,
      'checkedAt': checkedAt.toIso8601String(),
    };
}




