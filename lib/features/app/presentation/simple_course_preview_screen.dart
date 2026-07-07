import 'package:flutter/material.dart';

import '../../../core/models/course_model.dart';

/// Aperçu cours sans Riverpod (compatible route `/home` hors ProviderScope).
class SimpleCoursePreviewScreen extends StatelessWidget {
  final CourseModel course;

  const SimpleCoursePreviewScreen({super.key, required this.course});

  @override
  Widget build(BuildContext context) => Scaffold(
      appBar: AppBar(title: Text(course.title)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(course.description, style: Theme.of(context).textTheme.bodyLarge),
          const SizedBox(height: 16),
          Text(
            '${course.steps.length} étapes · ${course.difficulty.name} · ${course.language}',
            style: Theme.of(context).textTheme.labelLarge,
          ),
          const SizedBox(height: 24),
          for (final step in course.steps) ...[
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.play_circle_outline),
              title: Text(step.title),
              subtitle: Text(
                step.content,
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const Divider(),
          ],
        ],
      ),
    );
}





