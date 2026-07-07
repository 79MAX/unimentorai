# =========================
# UNIMENTORAI - PHASE 1 CLEAN CORE
# CTO REBUILD SYSTEM
# =========================

Write-Host "🚀 PHASE 1 - CLEAN CORE START" -ForegroundColor Cyan

# =========================
# 1. CREATE SAFE BACKUP ARCHIVE
# =========================
$archiveRoot = "archive_rebuild_phase1"

if (!(Test-Path $archiveRoot)) {
    New-Item -ItemType Directory -Path $archiveRoot | Out-Null
}

# =========================
# 2. LEGACY FOLDERS TO ARCHIVE
# =========================
$legacyFolders = @(
    "src\ai",
    "src\security",
    "src\services",
    "src\ui",
    "src\store",
    "src\utils"
)

foreach ($folder in $legacyFolders) {
    if (Test-Path $folder) {
        $target = Join-Path $archiveRoot ($folder -replace "src\\", "")
        Move-Item $folder $target -Force
        Write-Host "📦 Archived: $folder" -ForegroundColor Yellow
    }
}

# =========================
# 3. ENSURE MODULES IS SINGLE SOURCE
# =========================
$modules = @(
    "ai",
    "security",
    "ui",
    "services",
    "store",
    "utils",
    "payment"
)

foreach ($m in $modules) {
    $path = "src\modules\$m"
    if (!(Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "➕ Created module: $m" -ForegroundColor Green
    }
}

# =========================
# 4. REMOVE DUPLICATE ROOT STRUCTURE SAFELY
# =========================
if (Test-Path "src\src") {
    Move-Item "src\src" "$archiveRoot\src_src" -Force
    Write-Host "📦 Archived duplicate src/src" -ForegroundColor Yellow
}

# =========================
# 5. VALIDATION CHECK
# =========================
Write-Host "`n🧪 VALIDATION..." -ForegroundColor Cyan

foreach ($m in $modules) {
    if (Test-Path "src\modules\$m") {
        Write-Host "✔ OK: modules/$m" -ForegroundColor Green
    } else {
        Write-Host "❌ MISSING: modules/$m" -ForegroundColor Red
    }
}

# =========================
# 6. FINAL REPORT
# =========================
"PHASE 1 COMPLETE - CLEAN CORE DONE" | Out-File "rebuild_phase1_report.txt"

Write-Host "`n✅ PHASE 1 COMPLETE - SYSTEM STABILIZED" -ForegroundColor Green