# ============================================
# UniMentorAI - Flutter Dependency Cleaner
# ============================================

Write-Host "[INFO] Nettoyage Flutter UniMentorAI..." -ForegroundColor Cyan

Write-Host "[STEP] Flutter clean..." -ForegroundColor Yellow
flutter clean

Write-Host "[STEP] Suppression fichiers temporaires..." -ForegroundColor Yellow

Get-ChildItem -Recurse -Include *.g.dart,*.freezed.dart,*.mocks.dart -ErrorAction SilentlyContinue |
ForEach-Object {
    Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue
}

Write-Host "[STEP] Reparation cache pub..." -ForegroundColor Yellow
flutter pub cache repair

Write-Host "[STEP] Analyse packages..." -ForegroundColor Cyan
flutter pub outdated

Write-Host "[STEP] Upgrade securise..." -ForegroundColor Green
flutter pub upgrade

Write-Host "[STEP] Installation dependances..." -ForegroundColor Cyan
flutter pub get

Write-Host "[OK] Nettoyage termine." -ForegroundColor Green
