# ============================================
# UniMentorAI - FORCE CLEAN FLUTTER PROJECT
# ============================================

Write-Host "🧹 UniMentorAI CLEAN START..." -ForegroundColor Cyan

# Stop Flutter/Dart processes
Write-Host "🛑 Stop processes..." -ForegroundColor Yellow
Get-Process dart -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process flutter -ErrorAction SilentlyContinue | Stop-Process -Force

# Flutter clean
Write-Host "🧼 flutter clean..." -ForegroundColor Yellow
flutter clean

# Remove .dart_tool
Write-Host "🗑 Suppression .dart_tool..." -ForegroundColor Red
if (Test-Path ".dart_tool") {
    Remove-Item ".dart_tool" -Recurse -Force -ErrorAction SilentlyContinue
}

# Remove build
Write-Host "🗑 Suppression build..." -ForegroundColor Red
if (Test-Path "build") {
    Remove-Item "build" -Recurse -Force -ErrorAction SilentlyContinue
}

# Get dependencies
Write-Host "📦 flutter pub get..." -ForegroundColor Green
flutter pub get

Write-Host "✅ CLEAN TERMINÉ AVEC SUCCÈS" -ForegroundColor Green
