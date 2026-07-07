$path = "lib\core\routing"

New-Item -ItemType Directory -Force -Path $path | Out-Null

@"
class SafeRouter {
  Future<String> resolve(String userId) async {
    return '/home';
  }
}
"@ | Set-Content "$path\safe_router.dart"

@"
class NavigationGuard {}
"@ | Set-Content "$path\navigation_guard.dart"

@"
class AppRoutes {
  static const onboarding = '/onboarding';
  static const home = '/home';
  static const paywall = '/paywall';
}
"@ | Set-Content "$path\app_routes.dart"

Write-Host "✅ SAFE ROUTING FILES CREATED"
