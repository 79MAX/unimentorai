/// Modèle de traduction avec système collaboratif
class TranslationModel {
  final String id;
  final String courseId;
  final String language;
  final String originalText;
  final String translatedText;
  final DateTime translatedAt;
  final String translatorId;
  final TranslationQuality quality;
  final bool isVerified;
  final List<TranslationCorrection>? corrections;
  final Map<String, dynamic>? metadata;

  const TranslationModel({
    required this.id,
    required this.courseId,
    required this.language,
    required this.originalText,
    required this.translatedText,
    required this.translatedAt,
    required this.translatorId,
    required this.quality,
    required this.isVerified,
    this.corrections,
    this.metadata,
  });

  factory TranslationModel.fromJson(Map<String, dynamic> json) => TranslationModel(
      id: json['id'] ?? '',
      courseId: json['courseId'] ?? '',
      language: json['language'] ?? '',
      originalText: json['originalText'] ?? '',
      translatedText: json['translatedText'] ?? '',
      translatedAt: json['translatedAt'] != null 
          ? DateTime.parse(json['translatedAt']) 
          : DateTime.now(),
      translatorId: json['translatorId'] ?? '',
      quality: TranslationQuality.values.firstWhere(
        (e) => e.name == json['quality'],
        orElse: () => TranslationQuality.automatic,
      ),
      isVerified: json['isVerified'] ?? false,
      corrections: (json['corrections'] as List<dynamic>?)
          ?.map((correction) => TranslationCorrection.fromJson(correction))
          .toList(),
      metadata: json['metadata'],
    );

  Map<String, dynamic> toJson() => {
      'id': id,
      'courseId': courseId,
      'language': language,
      'originalText': originalText,
      'translatedText': translatedText,
      'translatedAt': translatedAt.toIso8601String(),
      'translatorId': translatorId,
      'quality': quality.name,
      'isVerified': isVerified,
      'corrections': corrections?.map((c) => c.toJson()).toList(),
      'metadata': metadata,
    };

  // Méthodes utilitaires
  bool get hasCorrections => corrections?.isNotEmpty ?? false;
  int get correctionCount => corrections?.length ?? 0;
  bool get isApproved => isVerified && (corrections?.isEmpty ?? true);

  TranslationModel copyWith({
    String? id,
    String? courseId,
    String? language,
    String? originalText,
    String? translatedText,
    DateTime? translatedAt,
    String? translatorId,
    TranslationQuality? quality,
    bool? isVerified,
    List<TranslationCorrection>? corrections,
    Map<String, dynamic>? metadata,
  }) => TranslationModel(
      id: id ?? this.id,
      courseId: courseId ?? this.courseId,
      language: language ?? this.language,
      originalText: originalText ?? this.originalText,
      translatedText: translatedText ?? this.translatedText,
      translatedAt: translatedAt ?? this.translatedAt,
      translatorId: translatorId ?? this.translatorId,
      quality: quality ?? this.quality,
      isVerified: isVerified ?? this.isVerified,
      corrections: corrections ?? this.corrections,
      metadata: metadata ?? this.metadata,
    );

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is TranslationModel &&
        other.id == id &&
        other.courseId == courseId &&
        other.language == language;
  }

  @override
  int get hashCode => id.hashCode ^ courseId.hashCode ^ language.hashCode;
}

/// Correction de traduction
class TranslationCorrection {
  final String id;
  final String courseId;
  final String language;
  final String originalText;
  final String correctedText;
  final String proposedBy;
  final DateTime proposedAt;
  final int votes;
  final List<String> voters;
  final CorrectionStatus status;
  final String? reason;
  final Map<String, dynamic>? metadata;

  const TranslationCorrection({
    required this.id,
    required this.courseId,
    required this.language,
    required this.originalText,
    required this.correctedText,
    required this.proposedBy,
    required this.proposedAt,
    required this.votes,
    required this.voters,
    required this.status,
    this.reason,
    this.metadata,
  });

  factory TranslationCorrection.fromJson(Map<String, dynamic> json) => TranslationCorrection(
      id: json['id'] ?? '',
      courseId: json['courseId'] ?? '',
      language: json['language'] ?? '',
      originalText: json['originalText'] ?? '',
      correctedText: json['correctedText'] ?? '',
      proposedBy: json['proposedBy'] ?? '',
      proposedAt: json['proposedAt'] != null 
          ? DateTime.parse(json['proposedAt']) 
          : DateTime.now(),
      votes: json['votes'] ?? 0,
      voters: (json['voters'] as List<dynamic>?)?.cast<String>() ?? [],
      status: CorrectionStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => CorrectionStatus.pending,
      ),
      reason: json['reason'],
      metadata: json['metadata'],
    );

  Map<String, dynamic> toJson() => {
      'id': id,
      'courseId': courseId,
      'language': language,
      'originalText': originalText,
      'correctedText': correctedText,
      'proposedBy': proposedBy,
      'proposedAt': proposedAt.toIso8601String(),
      'votes': votes,
      'voters': voters,
      'status': status.name,
      'reason': reason,
      'metadata': metadata,
    };

  bool get isApproved => status == CorrectionStatus.approved;
  bool get isPending => status == CorrectionStatus.pending;
  bool get isRejected => status == CorrectionStatus.rejected;

  TranslationCorrection copyWith({
    String? id,
    String? courseId,
    String? language,
    String? originalText,
    String? correctedText,
    String? proposedBy,
    DateTime? proposedAt,
    int? votes,
    List<String>? voters,
    CorrectionStatus? status,
    String? reason,
    Map<String, dynamic>? metadata,
  }) => TranslationCorrection(
      id: id ?? this.id,
      courseId: courseId ?? this.courseId,
      language: language ?? this.language,
      originalText: originalText ?? this.originalText,
      correctedText: correctedText ?? this.correctedText,
      proposedBy: proposedBy ?? this.proposedBy,
      proposedAt: proposedAt ?? this.proposedAt,
      votes: votes ?? this.votes,
      voters: voters ?? this.voters,
      status: status ?? this.status,
      reason: reason ?? this.reason,
      metadata: metadata ?? this.metadata,
    );
}

/// Qualité de traduction
enum TranslationQuality {
  automatic,
  human,
  verified,
}

/// Statut d'une correction
enum CorrectionStatus {
  pending,
  approved,
  rejected,
}




