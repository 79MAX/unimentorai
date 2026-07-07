Write-Host "🚀 UNIMENTORAI BACKEND MIGRATION ENGINE START" -ForegroundColor Cyan

$root = Resolve-Path ".\apps\backend\src" -ErrorAction SilentlyContinue

if (-not $root) {
    Write-Host "❌ Backend introuvable dans apps/backend/src" -ForegroundColor Red
    exit
}

# =========================
# 1. CLEAN ARCHITECTURE STRUCTURE
# =========================

$folders = @(
    "modules/auth/domain",
    "modules/auth/application",
    "modules/auth/infrastructure",
    "modules/auth/interface",

    "modules/users/domain",
    "modules/users/application",
    "modules/users/infrastructure",
    "modules/users/interface",

    "modules/courses/domain",
    "modules/courses/application",
    "modules/courses/infrastructure",
    "modules/courses/interface",

    "modules/payments/domain",
    "modules/payments/application",
    "modules/payments/infrastructure",
    "modules/payments/interface",

    "modules/certificates/domain",
    "modules/certificates/application",
    "modules/certificates/infrastructure",
    "modules/certificates/interface",

    "modules/ai/domain",
    "modules/ai/application",
    "modules/ai/infrastructure",
    "modules/ai/interface",

    "shared/utils",
    "shared/middleware",
    "shared/errors",
    "config",
    "bootstrap"
)

foreach ($f in $folders) {
    $path = Join-Path $root $f
    New-Item -ItemType Directory -Force -Path $path | Out-Null
}

Write-Host "📦 Clean Architecture structure created" -ForegroundColor Green

# =========================
# 2. SCAN LEGACY CODE
# =========================

Write-Host "🔍 Scanning legacy backend files..." -ForegroundColor Yellow

$legacyPatterns = @("controller", "service", "model", "route")

$files = Get-ChildItem -Recurse -Path $root -Include *.js,*.ts -ErrorAction SilentlyContinue

foreach ($file in $files) {
    foreach ($pattern in $legacyPatterns) {
        if ($file.Name -match $pattern) {
            Write-Host "⚠️ Legacy detected: $($file.FullName)" -ForegroundColor DarkYellow
        }
    }
}

# =========================
# 3. REPORT
# =========================

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ MIGRATION ENGINE EXECUTION DONE" -ForegroundColor Green
Write-Host "⚠️ NEXT STEP: manual module refactor required" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Cyan