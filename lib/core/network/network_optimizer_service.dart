class NetworkOptimizerService {

  /// 📉 DETECT LOW BANDWIDTH MODE
  bool isLowBandwidth(String connectionType) => connectionType == '2g' || connectionType == 'slow';

  /// ⚡ REDUCE IMAGE QUALITY
  String optimizeImage(String url, bool lowBandwidth) {
    if (lowBandwidth) {
      return '=40&format=webp';
    }
    return url;
  }

  /// 📚 REDUCE PAYLOAD SIZE
  Map<String, dynamic> optimizeResponse(Map<String, dynamic> data) {
    data.remove('heavyMetadata');
    return data;
  }
}
