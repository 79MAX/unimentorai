# =========================
# CLEAN MIGRATION V2 - UniMentorAI
# =========================

[Console]::InputEncoding  = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "🚀 CLEAN MIGRATION V2 START" -ForegroundColor Cyan

# =========================
# SAFE STRUCTURE CHECK
# =========================

$base = "C:\Users\DJOTOHOU\UNIMENTORAI\unimentorai"

$folders = @(
    "src\modules\ai",
    "src\modules\security",
    "src\modules\ui",
    "src\modules\services",
    "src\modules\store",
    "src\modules\utils",
    "src\modules\payment"
)

foreach ($f in $folders) {
    $full = Join-Path $base $f

    if (!(Test-Path $full)) {
        Write-Host "➕ Creating: $full" -ForegroundColor Yellow
        New-Item -ItemType Directory -Force -Path $full | Out-Null
    }
    else {
        Write-Host "✔ OK: $full" -ForegroundColor Green
    }
}

# =========================
# DUPLICATION SCAN (SAFE)
# =========================

Write-Host "`n🔍 Scanning duplication..." -ForegroundColor Cyan

$duplicates = Get-ChildItem $base -Recurse -File |
    Group-Object Name |
    Where-Object { $_.Count -gt 1 }

foreach ($d in $duplicates) {
    Write-Host "⚠ DUPLICATE: $($d.Name)" -ForegroundColor Yellow
}

# =========================
# ARCHIVE LEGACY SAFE MODE
# =========================

$archive = Join-Path $base "archive-clean-v2"

if (!(Test-Path $archive)) {
    New-Item -ItemType Directory -Path $archive | Out-Null
}

$legacyFolders = @("src\ai", "src\security", "src\ui", "src\store", "src\utils")

foreach ($lf in $legacyFolders) {
    $full = Join-Path $base $lf

    if (Test-Path $full) {
        Write-Host "📦 Archiving: $full" -ForegroundColor Cyan
        Move-Item $full $archive -Force
    }
}

# =========================
# FINAL STATUS
# =========================

Write-Host "`n✅ CLEAN MIGRATION V2 COMPLETE" -ForegroundColor Green
Write-Host "SYSTEM READY FOR PHASE 2" -ForegroundColor Cyan
