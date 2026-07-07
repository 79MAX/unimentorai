import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class OfflineCacheService {

  /// 💾 SAVE DATA LOCALLY
  Future<void> save(String key, Map<String, dynamic> data) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(key, jsonEncode(data));
  }

  /// 📦 GET DATA FROM CACHE
  Future<Map<String, dynamic>?> get(String key) async {
    final prefs = await SharedPreferences.getInstance();
    final data = prefs.getString(key);

    if (data == null) return null;
    return jsonDecode(data);
  }

  /// 🧹 CLEAR CACHE
  Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}
