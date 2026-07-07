class ChatbotResponse {
  final String message;
  final DateTime timestamp;
  final bool isSuccess;
  final Map<String, dynamic>? metadata;

  const ChatbotResponse({
    required this.message,
    required this.timestamp,
    required this.isSuccess,
    this.metadata,
  });

  factory ChatbotResponse.success(String message, {Map<String, dynamic>? metadata}) => ChatbotResponse(
      message: message,
      timestamp: DateTime.now(),
      isSuccess: true,
      metadata: metadata,
    );

  factory ChatbotResponse.error(String message) => ChatbotResponse(
      message: message,
      timestamp: DateTime.now(),
      isSuccess: false,
    );
}

class ChatbotService {
  /// Point d’entrée principal du chatbot
  Future<ChatbotResponse> sendMessage(String message) async {
    final input = message.trim();

    if (input.isEmpty) {
      return ChatbotResponse.error('Message vide');
    }

    try {
      final response = await _generateResponse(input);

      return ChatbotResponse.success(
        response,
        metadata: {
          'input_length': input.length,
          'processed_at': DateTime.now().toIso8601String(),
        },
      );
    } catch (e) {
      return ChatbotResponse.error('Erreur chatbot: $e');
    }
  }

  /// Logique IA (facilement remplaçable par OpenAI / Gemini / backend)
  Future<String> _generateResponse(String input) async {
    await Future.delayed(const Duration(milliseconds: 300)); // simulation latence IA

    return _localFallbackAI(input);
  }

  /// Fallback intelligent (MVP offline / mode lite)
  String _localFallbackAI(String input) {
    final lower = input.toLowerCase();

    if (lower.contains('bonjour')) {
      return 'Bonjour 👋 Comment puis-je t’aider aujourd’hui ?';
    }

    if (lower.contains('cours')) {
      return 'Tu peux explorer les cours disponibles dans UniMentorAI 📚';
    }

    if (lower.contains('certificat')) {
      return 'Les certificats sont vérifiables via notre système sécurisé 🔐';
    }

    return 'Je suis ton assistant UniMentorAI 🤖 Pose-moi une question plus précise.';
  }
}