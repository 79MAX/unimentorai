import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/models/course_model.dart';
import 'courses_provider.dart';

final coursesSearchProvider = StateProvider<String>((ref) => '');

final filteredCoursesProvider = Provider<List<CourseModel>>((ref) {
  final query = ref.watch(coursesSearchProvider).toLowerCase();
  final coursesAsync = ref.watch(coursesProvider);
  return coursesAsync.maybeWhen(
    data: (courses) {
      if (query.isEmpty) return courses;
      return courses.where((c) {
        const lang = 'fr'; // ou détecter la langue courante
        return (c.title[lang]?.toLowerCase().contains(query) ?? false) ||
               (c.domain.toLowerCase().contains(query)) ||
               (c.level.toLowerCase().contains(query));
      }).toList();
    },
    orElse: () => [],
  );
}); 
 
 




