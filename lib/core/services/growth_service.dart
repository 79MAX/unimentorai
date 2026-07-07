import 'package:cloud_functions/cloud_functions.dart';

class GrowthService {
  final FirebaseFunctions _functions = FirebaseFunctions.instance;

  Future<void> logLearningActivity({
    required String courseId,
    int studyMinutes = 10,
    bool completedLesson = false,
  }) async {
    final callable = _functions.httpsCallable('logLearningActivity');
    await callable.call(<String, dynamic>{
      'course_id': courseId,
      'study_minutes': studyMinutes,
      'completed_lesson': completedLesson,
    });
  }

  Future<String> createReferralCode({String? code}) async {
    final callable = _functions.httpsCallable('createReferralCode');
    final result = await callable.call(<String, dynamic>{
      if (code != null && code.isNotEmpty) 'code': code,
    });
    final data = (result.data ?? {}) as Map<dynamic, dynamic>;
    return (data['code'] ?? '').toString();
  }

  Future<void> applyReferralCode(String code) async {
    final callable = _functions.httpsCallable('applyReferralCode');
    await callable.call(<String, dynamic>{'code': code});
  }

  Future<void> joinWeeklyChallenge(String challengeId) async {
    final callable = _functions.httpsCallable('joinWeeklyChallenge');
    await callable.call(<String, dynamic>{'challenge_id': challengeId});
  }

  Future<List<Map<String, dynamic>>> getLeaderboard({int limit = 20}) async {
    final callable = _functions.httpsCallable('getLeaderboard');
    final result = await callable.call(<String, dynamic>{'limit': limit});
    final data = (result.data ?? {}) as Map<dynamic, dynamic>;
    final raw = (data['leaderboard'] as List?) ?? const [];
    return raw.map((e) => Map<String, dynamic>.from(e as Map)).toList();
  }
}




