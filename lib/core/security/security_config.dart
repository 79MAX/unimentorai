class SecurityConfig {

  static const bool enableAntiTamper = true;
  static const bool enableRequestValidation = true;

  static bool validateToken(String token) => token.isNotEmpty && token.length > 20;

  static bool isSafeRequest(String input) => !input.contains('<script>');
}
