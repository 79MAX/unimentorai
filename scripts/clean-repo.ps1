Write-Host "🚀 UniMentorAI Clean Repo Start..." -ForegroundColor Cyan

$root = Get-Location

# 1. Supprimer dossiers inutiles
$pathsToRemove = @(
    "archive-v2",
    "duplicate",
    "node_modules",
    ".DS_Store"
)

foreach ($path in $pathsToRemove) {
    $fullPath = Join-Path $root $path
    if (Test-Path $fullPath) {
        Remove-Item $fullPath -Recurse -Force
        Write-Host "🗑 Removed: $path"
    }
}

# 2. Trouver backend imbriqué (anti chaos detection)
Get-ChildItem -Recurse -Directory | Where-Object {
    $_.FullName -match "backend.*backend" -or
    $_.FullName -match "api.*api"
} | ForEach-Object {
    Write-Host "⚠️ Suspicious nesting: $($_.FullName)" -ForegroundColor Yellow
}

# 3. Créer structure propre si manquante
$folders = @(
    "apps/backend/src/modules",
    "apps/frontend/lib/features",
    "services/payment-service",
    "services/ai-engine",
    "packages/shared",
    "infrastructure/docker",
    "scripts"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
}

Write-Host "✅ Clean structure ensured" -ForegroundColor Green

# 4. Rapport final
Write-Host "🎯 CLEAN REPO DONE - READY FOR SCALABLE ARCHITECTURE" -ForegroundColor Cyan