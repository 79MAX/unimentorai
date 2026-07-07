# =========================
# PHASE 3 AUTO REFACTOR - UniMentorAI
# SAFE INTELLIGENT MIGRATION ENGINE
# =========================

[Console]::InputEncoding  = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "🚀 PHASE 3 AUTO REFACTOR START" -ForegroundColor Cyan

# =========================
# BASE CONFIG
# =========================

$base = "C:\Users\DJOTOHOU\UNIMENTORAI\unimentorai"

# =========================
# DRY RUN MODE (SAFE DEFAULT)
# =========================

$DRY_RUN = $true

Write-Host "🧪 DRY RUN MODE: $DRY_RUN" -ForegroundColor Yellow

# =========================
# DUPLICATE DETECTION ENGINE
# =========================

Write-Host "`n🔍 Scanning for duplicates..." -ForegroundColor Cyan

$files = Get-ChildItem $base -Recurse -File -ErrorAction SilentlyContinue

$duplicates = $files |
    Group-Object Name |
    Where-Object { $_.Count -gt 1 }

foreach ($d in $duplicates) {
    Write-Host "`n⚠ DUPLICATE FOUND: $($d.Name)" -ForegroundColor Yellow

    $items = $d.Group | Sort-Object Length -Descending

    $keep = $items[0]
    $remove = $items | Select-Object -Skip 1

    Write-Host "✔ KEEP: $($keep.FullName)" -ForegroundColor Green

    foreach ($r in $remove) {
        if ($DRY_RUN) {
            Write-Host "🧪 DRY-RUN DELETE: $($r.FullName)" -ForegroundColor DarkGray
        }
        else {
            Write-Host "🗑 DELETING: $($r.FullName)" -ForegroundColor Red
            Remove-Item $r.FullName -Force -ErrorAction SilentlyContinue
        }
    }
}

# =========================
# ARCHITECTURE VALIDATION
# =========================

Write-Host "`n🏗 Checking architecture..." -ForegroundColor Cyan

$requiredModules = @(
    "src\modules\ai",
    "src\modules\security",
    "src\modules\ui",
    "src\modules\services",
    "src\modules\store",
    "src\modules\utils",
    "src\modules\payment"
)

foreach ($m in $requiredModules) {
    $full = Join-Path $base $m

    if (Test-Path $full) {
        Write-Host "✔ OK: $m" -ForegroundColor Green
    }
    else {
        Write-Host "➕ MISSING: $m" -ForegroundColor Yellow

        if (-not $DRY_RUN) {
            New-Item -ItemType Directory -Path $full -Force | Out-Null
            Write-Host "✔ CREATED: $m" -ForegroundColor Green
        }
    }
}

# =========================
# LEGACY CLEAN DETECTION
# =========================

Write-Host "`n📦 Detecting legacy structure..." -ForegroundColor Cyan

$legacy = @("src\ai", "src\security", "src\ui", "src\store", "src\utils")

foreach ($l in $legacy) {
    $full = Join-Path $base $l

    if (Test-Path $full) {

        if ($DRY_RUN) {
            Write-Host "🧪 DRY-RUN ARCHIVE: $full" -ForegroundColor DarkGray
        }
        else {
            $archive = Join-Path $base "archive-v3"
            if (!(Test-Path $archive)) {
                New-Item -ItemType Directory -Path $archive | Out-Null
            }

            Write-Host "📦 ARCHIVING: $full" -ForegroundColor Cyan
            Move-Item $full $archive -Force
        }
    }
}

# =========================
# FINAL REPORT
# =========================

Write-Host "`n✅ PHASE 3 COMPLETE - AUTO REFACTOR DONE" -ForegroundColor Green
Write-Host "🧠 DRY RUN MODE = SAFE VALIDATION ONLY" -ForegroundColor Cyan
Write-Host "👉 Set `$DRY_RUN = $false` to execute real changes" -ForegroundColor Yellow
