/// 📚 UniMentorAI Docs Index
/// Central registry for all app documentation
library;

class DocsIndex {

  /// 🌍 Supported languages
  static const List<String> supportedLanguages = [
    'en',
    'fr',
    'sw',
  ];

  /// 📂 Document categories
  static const Map<String, List<String>> categories = {

    /// ⚖️ Legal documents
    'legal': [
      'terms_of_service',
      'privacy_policy',
      'refund_policy',
    ],

    /// 📘 Product documentation
    'product': [
      'how_it_works',
      'pricing_guide',
      'ai_tutor_guide',
    ],

    /// 🎓 Certificate system
    'certificates': [
      'certificate_spec',
      'verification_guide',
    ],

    /// 🆘 Help center
    'help': [
      'faq',
      'support',
      'contact',
    ],

    /// 📱 Offline learning content
    'offline': [
      'onboarding_course',
      'intro_ai_lesson',
    ],

    /// 🔌 API & system docs
    'api': [
      'docs_index',
      'endpoints',
    ],
  };

  /// 🔍 Get all documents in a category
  static List<String> getDocsByCategory(String category) => categories[category] ?? [];

  /// 📄 Check if document exists
  static bool docExists(String category, String docName) => categories[category]?.contains(docName) ?? false;

  /// 🌍 Build document path (for Firebase / local / assets)
  static String buildDocPath({
    required String category,
    required String docName,
    String lang = 'en',
  }) => 'docs/$lang/$category/$docName.md';

  /// ⚡ Get full index (for admin / debugging / AI system)
  static Map<String, dynamic> getFullIndex() => {
      'languages': supportedLanguages,
      'categories': categories,
      'totalDocs': categories.values
          .fold(0, (sum, list) => sum + list.length),
    };

  /// 🧠 AI-friendly search helper (future LLM integration)
  static List<String> searchDocs(String keyword) {
    final results = <String>[];

    categories.forEach((category, docs) {
      for (final doc in docs) {
        if (doc.toLowerCase().contains(keyword.toLowerCase())) {
          results.add('$category/$doc');
        }
      }
    });

    return results;
  }

  /// 🔐 Validate access (future premium / role-based docs)
  static bool canAccessDoc({
    required String docName,
    required bool isPremium,
  }) {
    const premiumDocs = [
      'pricing_guide',
      'certificate_spec',
    ];

    if (premiumDocs.contains(docName) && !isPremium) {
      return false;
    }

    return true;
  }
}