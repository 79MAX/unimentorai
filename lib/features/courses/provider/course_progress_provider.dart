import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';

import '../services/course_progress_service.dart';
import '../../../core/models/course_progress.dart';

final courseProgressServiceProvider =
    Provider<CourseProgressService>((ref) => CourseProgressService());

final firebaseAuthProvider =
    Provider<FirebaseAuth>((ref) => FirebaseAuth.instance);

class CourseProgressNotifier extends FamilyAsyncNotifier<
    CourseProgress?,
    ({String courseId, int totalModules})> {

  late final String _courseId;
  late final int _totalModules;

  String get _userId =>
      ref.read(firebaseAuthProvider).currentUser?.uid ?? '';

  @override
  Future<CourseProgress?> build(
    ({String courseId, int totalModules}) args,
  ) async {
    _courseId = args.courseId;
    _totalModules = args.totalModules;

    if (_userId.isEmpty) return null;

    final service = ref.read(courseProgressServiceProvider);

    final progress =
        await service.getProgress(_userId, _courseId);

    return progress ??
        CourseProgress.empty(_courseId, _userId);
  }

  Future<void> completeModule(String moduleId) async {
    final current = state.value;
    if (current == null) return;

    try {
      final service = ref.read(courseProgressServiceProvider);

      // si déjà complété → exit
      if (current.completedModules.contains(moduleId)) {
        return;
      }

      final updatedModules = [
        ...current.completedModules,
        moduleId,
      ];

      final updated = current.copyWith(
        completedModules: updatedModules,
        isCompleted:
            updatedModules.length >= current.totalModules,
        lastAccessed: DateTime.now(),
      );

      await service.saveProgress(updated);

      state = AsyncData(updated);
    } catch (e, st) {
      state = AsyncError(e, st);
    }
  }

  Future<void> refreshProgress() async {
    if (_userId.isEmpty) return;

    state = const AsyncLoading();

    try {
      final service = ref.read(courseProgressServiceProvider);

      final progress =
          await service.getProgress(_userId, _courseId);

      state = AsyncData(progress);
    } catch (e, st) {
      state = AsyncError(e, st);
    }
  }
}

final courseProgressProvider =
    AsyncNotifierProvider.family<
        CourseProgressNotifier,
        CourseProgress?,
        ({String courseId, int totalModules})>(
  CourseProgressNotifier.new,
);
