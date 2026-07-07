import 'dart:convert';
import 'package:http/http.dart' as http;

/// 🤖 UniMentorAI - Core AI Tutor Engine
/// Optimisé pour :
/// - scalabilité
/// - multi-langue
/// - adaptation niveau utilisateur
/// - SaaS production ready
class AiTutorService {
  final String apiKey;
  final String baseUrl;
  final http.Client client;

  AiTutorService({
    required this.apiKey,
    this.baseUrl = 'https://api.openai.com/v1/chat/completions',
    http.Client? client,
  }) : client = client ?? http.Client();

  /// 🚀 MAIN ENTRY POINT (SAFE + SCALABLE)
  Future<String> askTutor({
    required String message,
    required String userLevel,
    required int progressPercent,
    required String userId,
    String language = 'en',
  }) async {
    try {
      final prompt = _buildSystemPrompt(
        level: userLevel,
        progress: progressPercent,
        language: language,
      );

      final response = await client.post(
        Uri.parse(baseUrl),
        headers: _headers(),
        body: jsonEncode({
          'model': 'gpt-4o-mini',
          'messages': [
            {
              'role': 'system',
              'content': prompt,
            },
            {
              'role': 'user',
              'content': message,
            }
          ],
          'temperature': 0.6,
        }),
      );

      if (response.statusCode != 200) {
        return 'AI Tutor error. Please try again.';
      }

      final data = jsonDecode(response.body);

      return data['choices'][0]['message']['content'];
    } catch (e) {
      return 'AI Tutor temporarily unavailable.';
    }
  }

  /// 🧠 SMART ADAPTIVE PROMPT ENGINE
  String _buildSystemPrompt({
    required String level,
    required int progress,
    required String language,
  }) {
    final learningStyle = _getLearningStyle(progress);

    return '''
You are UniMentorAI, a world-class AI tutor.

User profile:
- Level: $level
- Progress: $progress%
- Language: $language

Teaching style:
$learningStyle

Rules:
- Be clear and structured
- Adapt difficulty dynamically
- Use simple explanations if needed
- Give examples
- Encourage learning
- Never overwhelm beginner users
- Always personalize responses
''';
  }

  /// 🎯 ADAPTIVE LEARNING LOGIC
  String _getLearningStyle(int progress) {
    if (progress < 20) {
      return '''
- Very simple explanations
- Step-by-step breakdown
- Use analogies
- Avoid complex terminology
''';
    } else if (progress < 70) {
      return '''
- Balanced explanations
- Mix theory + practice
- Use examples
''';
    } else {
      return '''
- Advanced explanations
- Deep insights
- Mentor-level guidance
''';
    }
  }

  /// 🔐 HEADERS (SECURE & CLEAN)
  Map<String, String> _headers() => {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $apiKey',
    };

  /// 🧹 CLEANUP (IMPORTANT FOR PRODUCTION)
  void dispose() {
    client.close();
  }
}