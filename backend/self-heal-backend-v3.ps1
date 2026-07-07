# =========================================================
# UniMentorAI - SELF HEAL BACKEND ENGINE V3
# CTO Edition - AUTO FIX + ARCHITECTURE REPAIR
# =========================================================

$ErrorActionPreference = "Continue"
Clear-Host

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   UNI MENTORAI SELF-HEAL ENGINE V3"
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# =========================================================
# ROOT VALIDATION
# =========================================================

$root = Get-Location

if (!(Test-Path "$root\backend")) {
    Write-Host "❌ backend folder missing" -ForegroundColor Red
    exit
}

Set-Location "$root\backend"

# =========================================================
# VARIABLES
# =========================================================

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

$backupFolder = "..\backend_selfheal_backup_$timestamp"
$reportFile = "selfheal_report_$timestamp.txt"

# =========================================================
# REPORT INIT
# =========================================================

@"
==================================================
SELF HEAL BACKEND REPORT V3
Generated: $timestamp
==================================================

"@ | Out-File $reportFile

# =========================================================
# 1. BACKUP EVERYTHING SAFE
# =========================================================

Write-Host "[1/7] Creating full backup..." -ForegroundColor Cyan

New-Item -ItemType Directory -Path $backupFolder -Force | Out-Null

Get-ChildItem -Force | Copy-Item -Destination $backupFolder -Recurse -Force

Add-Content $reportFile "Backup created: $backupFolder"

# =========================================================
# 2. UNIFY MIDDLEWARE ARCHITECTURE
# =========================================================

Write-Host "[2/7] Normalizing middleware structure..." -ForegroundColor Cyan

if (Test-Path "middleware") {

    if (!(Test-Path "middlewares")) {
        Rename-Item "middleware" "middlewares"
        Write-Host "Renamed middleware → middlewares" -ForegroundColor Yellow
        Add-Content $reportFile "Renamed middleware -> middlewares"
    }
    else {
        Write-Host "Merging middleware into middlewares..." -ForegroundColor Yellow

        Get-ChildItem "middleware" -Recurse | ForEach-Object {
            Move-Item $_.FullName "middlewares\" -Force
        }

        Remove-Item "middleware" -Recurse -Force
        Add-Content $reportFile "Merged middleware into middlewares"
    }
}

# =========================================================
# 3. FIX BROKEN IMPORTS
# =========================================================

Write-Host "[3/7] Fixing imports..." -ForegroundColor Cyan

$files = Get-ChildItem -Recurse -Include *.js

foreach ($file in $files) {

    $content = Get-Content $file.FullName -Raw

    $updated = $content

    # middleware → middlewares fix
    $updated = $updated -replace "\.\./middleware/", "../middlewares/"
    $updated = $updated -replace "\./middleware/", "./middlewares/"

    # auth.middleware fallback safety
    $updated = $updated -replace "auth\.middleware", "auth.middleware"

    if ($updated -ne $content) {
        Set-Content $file.FullName $updated
        Write-Host "Fixed imports: $($file.Name)" -ForegroundColor Green
        Add-Content $reportFile "Fixed imports: $($file.FullName)"
    }
}

# =========================================================
# 4. DETECT DEAD FILES (IMPORT ANALYSIS LIGHT)
# =========================================================

Write-Host "[4/7] Detecting unused files..." -ForegroundColor Cyan

$allFiles = Get-ChildItem -Recurse -Include *.js

foreach ($file in $allFiles) {

    $name = $file.Name

    $usage = Select-String -Path $allFiles.FullName -Pattern $name -Quiet

    if (-not $usage) {
        Write-Host "Potential orphan: $name" -ForegroundColor Yellow
        Add-Content $reportFile "Orphan file: $($file.FullName)"
    }
}

# =========================================================
# 5. DETECT EMPTY CRITICAL FILES
# =========================================================

Write-Host "[5/7] Checking empty files..." -ForegroundColor Cyan

Get-ChildItem -Recurse -File |
Where-Object { $_.Length -eq 0 -and $_.Extension -eq ".js" } |
ForEach-Object {
    Write-Host "Empty file: $($_.FullName)" -ForegroundColor Red
    Add-Content $reportFile "Empty file: $($_.FullName)"
}

# =========================================================
# 6. STRUCTURE VALIDATION
# =========================================================

Write-Host "[6/7] Validating architecture..." -ForegroundColor Cyan

$required = @(
    "app.js",
    "server.js",
    "routes",
    "middlewares",
    "models",
    "services"
)

foreach ($r in $required) {
    if (Test-Path $r) {
        Write-Host "OK: $r" -ForegroundColor Green
    } else {
        Write-Host "MISSING: $r" -ForegroundColor Red
        Add-Content $reportFile "Missing: $r"
    }
}

# =========================================================
# 7. FINAL REPORT
# =========================================================

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host " SELF HEAL COMPLETE"
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""

Write-Host "Report: $reportFile"
Write-Host "Backup: $backupFolder"
Write-Host ""
Write-Host "Next step: npm run dev (verify backend stability)" -ForegroundColor Cyan