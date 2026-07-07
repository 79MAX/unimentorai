import 'dart:convert';
import 'package:hive/hive.dart';
import 'package:logger/logger.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Service de cache optimisé pour UniMentorAI
/// Gère le cache des traductions, cours et données utilisateur
class CacheService {
  static final CacheService _instance = CacheService._internal();
  factory CacheService() => _instance;
  CacheService._internal();

  final Logger _logger = Logger();
  late Box _cacheBox;
  late SharedPreferences _prefs;
  bool _isInitialized = false;

  // Clés de cache
  static const String _coursesKey = 'courses_cache';
  static const String _translationsKey = 'translations_cache';
  static const String _userDataKey = 'user_data_cache';
  static const String _lastSyncKey = 'last_sync_timestamp';

  /// Initialise le service de cache
  Future<void> initialize() async {
    if (_isInitialized) return;

    try {
      _prefs = await SharedPreferences.getInstance();
      
      // Initialiser Hive pour le cache local
      await Hive.openBox('cache');
      _cacheBox = Hive.box('cache');

      _isInitialized = true;
      _logger.i('CacheService initialisé avec succès');
    } catch (e) {
      _logger.e('Erreur initialisation CacheService: $e');
      rethrow;
    }
  }

  /// Cache un cours
  Future<void> cacheCourse(String courseId, Map<String, dynamic> courseData) async {
    _ensureInitialized();
    try {
      final cacheKey = 'course_$courseId';
      await _cacheBox.put(cacheKey, {
        'data': courseData,
        'timestamp': DateTime.now().millisecondsSinceEpoch,
        'type': 'course',
      });
      
      _logger.d('Cours $courseId mis en cache');
    } catch (e) {
      _logger.e('Erreur cache cours $courseId: $e');
    }
  }

  /// Récupère un cours du cache
  Future<Map<String, dynamic>?> getCachedCourse(String courseId) async {
    _ensureInitialized();
    try {
      final cacheKey = 'course_$courseId';
      final cachedData = _cacheBox.get(cacheKey);
      
      if (cachedData != null) {
        final data = Map<String, dynamic>.from(cachedData);
        final timestamp = data['timestamp'] as int;
        final cacheAge = DateTime.now().millisecondsSinceEpoch - timestamp;
        
        // Cache valide pendant 24h
        if (cacheAge < 24 * 60 * 60 * 1000) {
          _logger.d('Cours $courseId récupéré du cache');
          return Map<String, dynamic>.from(data['data']);
        } else {
          // Supprimer le cache expiré
          await _cacheBox.delete(cacheKey);
        }
      }
      
      return null;
    } catch (e) {
      _logger.e('Erreur récupération cache cours $courseId: $e');
      return null;
    }
  }

  /// Cache une traduction
  Future<void> cacheTranslation(
    String courseId,
    String language,
    Map<String, dynamic> translationData,
  ) async {
    _ensureInitialized();
    try {
      final cacheKey = 'translation_${courseId}_$language';
      await _cacheBox.put(cacheKey, {
        'data': translationData,
        'timestamp': DateTime.now().millisecondsSinceEpoch,
        'type': 'translation',
      });
      
      _logger.d('Traduction $courseId-$language mise en cache');
    } catch (e) {
      _logger.e('Erreur cache traduction $courseId-$language: $e');
    }
  }

  /// Récupère une traduction du cache
  Future<Map<String, dynamic>?> getCachedTranslation(
    String courseId,
    String language,
  ) async {
    _ensureInitialized();
    try {
      final cacheKey = 'translation_${courseId}_$language';
      final cachedData = _cacheBox.get(cacheKey);
      
      if (cachedData != null) {
        final data = Map<String, dynamic>.from(cachedData);
        final timestamp = data['timestamp'] as int;
        final cacheAge = DateTime.now().millisecondsSinceEpoch - timestamp;
        
        // Cache des traductions valide pendant 7 jours
        if (cacheAge < 7 * 24 * 60 * 60 * 1000) {
          _logger.d('Traduction $courseId-$language récupérée du cache');
          return Map<String, dynamic>.from(data['data']);
        } else {
          await _cacheBox.delete(cacheKey);
        }
      }
      
      return null;
    } catch (e) {
      _logger.e('Erreur récupération cache traduction $courseId-$language: $e');
      return null;
    }
  }

  /// Cache les données utilisateur
  Future<void> cacheUserData(String userId, Map<String, dynamic> userData) async {
    _ensureInitialized();
    try {
      final cacheKey = 'user_$userId';
      await _cacheBox.put(cacheKey, {
        'data': userData,
        'timestamp': DateTime.now().millisecondsSinceEpoch,
        'type': 'user',
      });
      
      _logger.d('Données utilisateur $userId mises en cache');
    } catch (e) {
      _logger.e('Erreur cache données utilisateur $userId: $e');
    }
  }

  /// Récupère les données utilisateur du cache
  Future<Map<String, dynamic>?> getCachedUserData(String userId) async {
    _ensureInitialized();
    try {
      final cacheKey = 'user_$userId';
      final cachedData = _cacheBox.get(cacheKey);
      
      if (cachedData != null) {
        final data = Map<String, dynamic>.from(cachedData);
        final timestamp = data['timestamp'] as int;
        final cacheAge = DateTime.now().millisecondsSinceEpoch - timestamp;
        
        // Cache utilisateur valide pendant 1h
        if (cacheAge < 60 * 60 * 1000) {
          _logger.d('Données utilisateur $userId récupérées du cache');
          return Map<String, dynamic>.from(data['data']);
        } else {
          await _cacheBox.delete(cacheKey);
        }
      }
      
      return null;
    } catch (e) {
      _logger.e('Erreur récupération cache données utilisateur $userId: $e');
      return null;
    }
  }

  /// Cache les résultats de recherche
  Future<void> cacheSearchResults(
    String query,
    String language,
    List<Map<String, dynamic>> results,
  ) async {
    _ensureInitialized();
    try {
      final cacheKey = 'search_${query}_$language';
      await _cacheBox.put(cacheKey, {
        'data': results,
        'timestamp': DateTime.now().millisecondsSinceEpoch,
        'type': 'search',
      });
      
      _logger.d('Résultats de recherche "$query" mis en cache');
    } catch (e) {
      _logger.e('Erreur cache résultats recherche "$query": $e');
    }
  }

  /// Récupère les résultats de recherche du cache
  Future<List<Map<String, dynamic>>?> getCachedSearchResults(
    String query,
    String language,
  ) async {
    _ensureInitialized();
    try {
      final cacheKey = 'search_${query}_$language';
      final cachedData = _cacheBox.get(cacheKey);
      
      if (cachedData != null) {
        final data = Map<String, dynamic>.from(cachedData);
        final timestamp = data['timestamp'] as int;
        final cacheAge = DateTime.now().millisecondsSinceEpoch - timestamp;
        
        // Cache de recherche valide pendant 2h
        if (cacheAge < 2 * 60 * 60 * 1000) {
          _logger.d('Résultats de recherche "$query" récupérés du cache');
          return List<Map<String, dynamic>>.from(data['data']);
        } else {
          await _cacheBox.delete(cacheKey);
        }
      }
      
      return null;
    } catch (e) {
      _logger.e('Erreur récupération cache résultats recherche "$query": $e');
      return null;
    }
  }

  /// Met à jour le timestamp de dernière synchronisation
  Future<void> updateLastSyncTimestamp() async {
    _ensureInitialized();
    try {
      await _prefs.setInt(_lastSyncKey, DateTime.now().millisecondsSinceEpoch);
      _logger.d('Timestamp de synchronisation mis à jour');
    } catch (e) {
      _logger.e('Erreur mise à jour timestamp sync: $e');
    }
  }

  /// Récupère le timestamp de dernière synchronisation
  Future<DateTime?> getLastSyncTimestamp() async {
    _ensureInitialized();
    try {
      final timestamp = _prefs.getInt(_lastSyncKey);
      if (timestamp != null) {
        return DateTime.fromMillisecondsSinceEpoch(timestamp);
      }
      return null;
    } catch (e) {
      _logger.e('Erreur récupération timestamp sync: $e');
      return null;
    }
  }

  /// Nettoie le cache expiré
  Future<void> cleanExpiredCache() async {
    _ensureInitialized();
    try {
      final now = DateTime.now().millisecondsSinceEpoch;
      final keysToDelete = <String>[];

      for (final key in _cacheBox.keys) {
        final cachedData = _cacheBox.get(key);
        if (cachedData != null) {
          final data = Map<String, dynamic>.from(cachedData);
          final timestamp = data['timestamp'] as int;
          final cacheAge = now - timestamp;
          final type = data['type'] as String;

          // Définir la durée de validité selon le type
          int maxAge;
          switch (type) {
            case 'course':
              maxAge = 24 * 60 * 60 * 1000; // 24h
              break;
            case 'translation':
              maxAge = 7 * 24 * 60 * 60 * 1000; // 7 jours
              break;
            case 'user':
              maxAge = 60 * 60 * 1000; // 1h
              break;
            case 'search':
              maxAge = 2 * 60 * 60 * 1000; // 2h
              break;
            default:
              maxAge = 24 * 60 * 60 * 1000; // 24h par défaut
          }

          if (cacheAge > maxAge) {
            keysToDelete.add(key.toString());
          }
        }
      }

      for (final key in keysToDelete) {
        await _cacheBox.delete(key);
      }

      _logger.i('${keysToDelete.length} entrées de cache expirées supprimées');
    } catch (e) {
      _logger.e('Erreur nettoyage cache: $e');
    }
  }

  /// Vide tout le cache
  Future<void> clearAllCache() async {
    _ensureInitialized();
    try {
      await _cacheBox.clear();
      await _prefs.remove(_lastSyncKey);
      _logger.i('Cache complètement vidé');
    } catch (e) {
      _logger.e('Erreur vidage cache: $e');
    }
  }

  /// Obtient les statistiques du cache
  Future<CacheStats> getCacheStats() async {
    _ensureInitialized();
    try {
      int courseCount = 0;
      int translationCount = 0;
      int userCount = 0;
      int searchCount = 0;
      int totalSize = 0;

      for (final key in _cacheBox.keys) {
        final cachedData = _cacheBox.get(key);
        if (cachedData != null) {
          final data = Map<String, dynamic>.from(cachedData);
          final type = data['type'] as String;
          
          switch (type) {
            case 'course':
              courseCount++;
              break;
            case 'translation':
              translationCount++;
              break;
            case 'user':
              userCount++;
              break;
            case 'search':
              searchCount++;
              break;
          }
          
          totalSize += jsonEncode(cachedData).length;
        }
      }

      return CacheStats(
        courseCount: courseCount,
        translationCount: translationCount,
        userCount: userCount,
        searchCount: searchCount,
        totalSize: totalSize,
        lastSync: await getLastSyncTimestamp(),
      );
    } catch (e) {
      _logger.e('Erreur calcul statistiques cache: $e');
      return CacheStats.empty();
    }
  }

  void _ensureInitialized() {
    if (!_isInitialized) {
      throw Exception('CacheService non initialisé');
    }
  }
}

/// Statistiques du cache
class CacheStats {
  final int courseCount;
  final int translationCount;
  final int userCount;
  final int searchCount;
  final int totalSize;
  final DateTime? lastSync;

  CacheStats({
    required this.courseCount,
    required this.translationCount,
    required this.userCount,
    required this.searchCount,
    required this.totalSize,
    this.lastSync,
  });

  factory CacheStats.empty() => CacheStats(
      courseCount: 0,
      translationCount: 0,
      userCount: 0,
      searchCount: 0,
      totalSize: 0,
    );

  int get totalEntries => courseCount + translationCount + userCount + searchCount;
  
  String get formattedSize {
    if (totalSize < 1024) return '${totalSize}B';
    if (totalSize < 1024 * 1024) return '${(totalSize / 1024).toStringAsFixed(1)}KB';
    return '${(totalSize / (1024 * 1024)).toStringAsFixed(1)}MB';
  }
}










