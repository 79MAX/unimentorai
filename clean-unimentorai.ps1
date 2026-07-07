# ================================
# UNI MENTOR AI - CLEAN SCRIPT
# ================================

Write-Host "🚀 Début du nettoyage UniMentorAI..." -ForegroundColor Cyan

$root = Get-Location

$foldersToDelete = @(
    "build",
    ".dart_tool",
    ".flutter-plugins",
    ".flutter-plugins-dependencies",
    ".pub-cache",
    "dist",
    "node_modules",
    "coverage"
)

$filesToDelete = @(
    "*.log",
    "*.tmp",
    "*.lock",
    ".DS_Store"
)

Write-Host "🧹 Nettoyage des dossiers cache..." -ForegroundColor Yellow

foreach ($folder in $foldersToDelete) {
    Get-ChildItem -Path $root -Recurse -Directory -Force -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -eq $folder } |
    ForEach-Object {
        Write-Host "Suppression : $($_.FullName)" -ForegroundColor Red
        Remove-Item $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "🧼 Nettoyage fichiers temporaires..." -ForegroundColor Yellow

foreach ($pattern in $filesToDelete) {
    Get-ChildItem -Path $root -Recurse -File -Force -Include $pattern -ErrorAction SilentlyContinue |
    ForEach-Object {
        Write-Host "Suppression : $($_.FullName)" -ForegroundColor DarkRed
        Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "📦 Flutter clean..." -ForegroundColor Yellow
flutter clean

Write-Host "📥 Flutter pub get..." -ForegroundColor Yellow
flutter pub get

Write-Host "✅ Nettoyage terminé !" -ForegroundColor Green
