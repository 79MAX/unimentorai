class SessionModel {
  final String id;
  final String mentorId;
  final String learnerId;
  final String status;
  final DateTime createdAt;

  SessionModel({
    required this.id,
    required this.mentorId,
    required this.learnerId,
    required this.status,
    required this.createdAt,
  });

  factory SessionModel.fromMap(
    Map<String, dynamic> map,
    String id,
  ) => SessionModel(
      id: id,
      mentorId: map['mentorId'] ?? '',
      learnerId: map['learnerId'] ?? '',
      status: map['status'] ?? 'pending',
      createdAt: map['createdAt'].toDate(),
    );

  Map<String, dynamic> toMap() => {
      'mentorId': mentorId,
      'learnerId': learnerId,
      'status': status,
      'createdAt': createdAt,
    };
}




