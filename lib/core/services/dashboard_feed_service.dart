import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:firebase_auth/firebase_auth.dart';

import '../models/course_model.dart';
import '../tenant/tenant_context.dart';

/// Agrège contenus pour le tableau de bord 3-2-1 (cours + mentors + opportunité).
class DashboardFeedService {
  DashboardFeedService({FirebaseFirestore? firestore})
      : _db = firestore ?? FirebaseFirestore.instance;

  final FirebaseFirestore _db;

  DateTime? _parseDate(dynamic v) {
    if (v is Timestamp) return v.toDate();
    if (v is String) return DateTime.tryParse(v);
    return null;
  }

  /// Jusqu'à [take] cours publiés, classés par pertinence simple (langue + tags vs objectifs).
  Future<List<CourseModel>> loadRecommendedCourses({
    required String languageCode,
    required List<String> goalIds,
    int take = 3,
    int fetchCap = 24,
  }) async {
    try {
      final orgId = await TenantContext.resolveOrganizationId();
      Query<Map<String, dynamic>> q =
          _db.collection('courses').where('isPublished', isEqualTo: true);
      if (orgId != null && orgId.isNotEmpty) {
        q = q.where('organizationId', isEqualTo: orgId);
      } else {
        q = q.where('organizationId', isNull: true);
      }
      final snap = await q.limit(fetchCap).get();

      final goals = goalIds.map((e) => e.toLowerCase()).toSet();
      final courses = <CourseModel>[];

      for (final doc in snap.docs) {
        final data = _normalizeCourseDoc(doc.data(), doc.id);
        try {
          courses.add(CourseModel.fromJson(data));
        } catch (_) {
          continue;
        }
      }

      int score(CourseModel c) {
        var s = 0;
        if (c.language.toLowerCase() == languageCode.toLowerCase()) s += 4;
        for (final t in c.tags) {
          final tl = t.toLowerCase();
          for (final g in goals) {
            if (tl.contains(g) || g.contains(tl)) s += 3;
          }
        }
        if (c.difficulty == CourseDifficulty.beginner && goalIds.contains('skills_tech')) s += 1;
        s += (c.rating * 0.5).round();
        return s;
      }

      courses.sort((a, b) => score(b).compareTo(score(a)));
      if (courses.length <= take) return courses;
      return courses.take(take).toList();
    } catch (_) {
      return const [];
    }
  }

  Map<String, dynamic> _normalizeCourseDoc(Map<String, dynamic> raw, String docId) {
    final data = Map<String, dynamic>.from(raw);
    data['id'] = docId;
    for (final key in ['createdAt', 'updatedAt']) {
      final v = data[key];
      if (v is Timestamp) {
        data[key] = v.toDate().toIso8601String();
      }
    }
    return data;
  }

  /// Aperçus mentors via Cloud Function (aucune lecture Firestore des profils d'autres utilisateurs).
  Future<List<MentorCardVm>> loadMentorSuggestions({
    required String languageCode,
    int limit = 2,
  }) async {
    if (FirebaseAuth.instance.currentUser == null) return const [];

    try {
      final callable = FirebaseFunctions.instance.httpsCallable('getDashboardMentorPreviews');
      final result = await callable.call(<String, dynamic>{
        'languageCode': languageCode.toLowerCase(),
        'limit': limit,
      });
      final data = result.data;
      if (data is! Map) return const [];
      final raw = (data['mentors'] as List?) ?? const [];
      final out = <MentorCardVm>[];
      for (final e in raw) {
        if (e is! Map) continue;
        final m = Map<String, dynamic>.from(e);
        final id = m['userId']?.toString() ?? '';
        if (id.isEmpty) continue;
        out.add(MentorCardVm(
          userId: id,
          headline: m['headline']?.toString() ?? 'Mentor',
          languages: List<String>.from((m['languages'] as List?) ?? const []),
        ));
        if (out.length >= limit) break;
      }
      return out;
    } catch (_) {
      return const [];
    }
  }

  /// Première opportunité : webinaire / événement à venir (sans index composite requis).
  Future<OpportunityVm?> loadPrimaryOpportunity() async {
    for (final collection in ['events', 'webinars', 'live_events']) {
      try {
        final q = await _db.collection(collection).limit(12).get();
        if (q.docs.isEmpty) continue;
        OpportunityVm? best;
        DateTime? bestTime;
        for (final doc in q.docs) {
          final m = doc.data();
          final date = _parseDate(m['date']);
          if (date == null) continue;
          if (date.isBefore(DateTime.now())) continue;
          if (bestTime == null || date.isBefore(bestTime)) {
            bestTime = date;
            best = OpportunityVm(
              id: doc.id,
              collection: collection,
              title: (m['title'] ?? 'Événement').toString(),
              startsAt: date,
              meetingLink: (m['meeting_link'] ?? m['meetingLink'] ?? '').toString(),
            );
          }
        }
        if (best != null) return best;
      } catch (_) {
        continue;
      }
    }
    return null;
  }
}

class MentorCardVm {
  final String userId;
  final String headline;
  final List<String> languages;

  const MentorCardVm({
    required this.userId,
    required this.headline,
    required this.languages,
  });
}

class OpportunityVm {
  final String id;
  final String collection;
  final String title;
  final DateTime? startsAt;
  final String meetingLink;

  const OpportunityVm({
    required this.id,
    required this.collection,
    required this.title,
    required this.startsAt,
    required this.meetingLink,
  });
}




