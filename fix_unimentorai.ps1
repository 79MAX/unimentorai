# =========================================================
# UniMentorAI - Enterprise Recovery Script V2
# SAFE + SCALABLE + SELF-HEALING
# =========================================================

$ErrorActionPreference = "Continue"

Clear-Host

# =========================================================
# UI
# =========================================================

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "      UniMentorAI ENTERPRISE RECOVERY TOOL"
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# =========================================================
# VERIFY PROJECT ROOT
# =========================================================

if (!(Test-Path ".\pubspec.yaml")) {

    Write-Host "ERROR: pubspec.yaml not found." -ForegroundColor Red
    Write-Host "Run this script inside UniMentorAI root folder." -ForegroundColor Yellow
    exit
}

# =========================================================
# VARIABLES
# =========================================================

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

$backupFolder = ".\backups\unimentorai_backup_$timestamp"

$deprecatedFolder = ".\deprecated_architecture_$timestamp"

$reportFile = ".\repair_report_$timestamp.txt"

$analysisFile = ".\final_analysis_$timestamp.txt"

# =========================================================
# CREATE REPORT
# =========================================================

@"
==================================================
UniMentorAI Repair Report
Generated: $timestamp
==================================================

"@ | Out-File $reportFile -Encoding utf8

# =========================================================
# CREATE BACKUP FOLDER
# =========================================================

Write-Host "[1/10] Creating backup..." -ForegroundColor Cyan

New-Item -ItemType Directory -Path ".\backups" -Force | Out-Null
New-Item -ItemType Directory -Path $backupFolder -Force | Out-Null

$excludeFolders = @(
    ".git",
    ".dart_tool",
    "build",
    "node_modules",
    "backups"
)

Get-ChildItem . -Force | Where-Object {

    $excludeFolders -notcontains $_.Name

} | Copy-Item -Destination $backupFolder -Recurse -Force

Write-Host "Backup completed." -ForegroundColor Green

Add-Content $reportFile "Backup created: $backupFolder"

# =========================================================
# CREATE DEPRECATED ZONE
# =========================================================

Write-Host "[2/10] Creating deprecated zone..." -ForegroundColor Cyan

New-Item -ItemType Directory -Path $deprecatedFolder -Force | Out-Null

# =========================================================
# MOVE LEGACY FOLDERS
# =========================================================

Write-Host "[3/10] Isolating legacy architecture..." -ForegroundColor Cyan

$legacyFolders = @(
    ".\lib\modules",
    ".\lib\services",
    ".\backend\backend"
)

foreach ($folder in $legacyFolders) {

    if (Test-Path $folder) {

        $leaf = Split-Path $folder -Leaf
        $destination = Join-Path $deprecatedFolder "${leaf}_legacy"

        Move-Item $folder $destination -Force

        Write-Host "Moved: $folder" -ForegroundColor Yellow

        Add-Content $reportFile "Legacy isolated: $folder"
    }
}

# =========================================================
# CLEAN TEMP FILES
# =========================================================

Write-Host "[4/10] Cleaning temporary folders..." -ForegroundColor Cyan

$tempFolders = @(
    ".dart_tool",
    "build"
)

foreach ($folder in $tempFolders) {

    if (Test-Path $folder) {

        Remove-Item $folder -Recurse -Force

        Write-Host "Removed: $folder" -ForegroundColor Green

        Add-Content $reportFile "Removed temp folder: $folder"
    }
}

# =========================================================
# REMOVE EMPTY FILES
# =========================================================

Write-Host "[5/10] Removing empty dangerous files..." -ForegroundColor Cyan

$deletedCount = 0

Get-ChildItem -Recurse -File | Where-Object {

    $_.Length -eq 0 -and
    $_.Extension -in @(".dart", ".js", ".ts", ".tsx")

} | ForEach-Object {

    Remove-Item $_.FullName -Force

    Write-Host "Deleted empty file: $($_.FullName)" -ForegroundColor Yellow

    Add-Content $reportFile "Deleted empty file: $($_.FullName)"

    $deletedCount++
}

Write-Host "Empty files removed: $deletedCount" -ForegroundColor Green

# =========================================================
# FLUTTER CLEAN
# =========================================================

Write-Host "[6/10] Running flutter clean..." -ForegroundColor Cyan

flutter clean

# =========================================================
# FLUTTER PUB GET
# =========================================================

Write-Host "[7/10] Running flutter pub get..." -ForegroundColor Cyan

flutter pub get

if ($LASTEXITCODE -ne 0) {

    Write-Host "flutter pub get FAILED." -ForegroundColor Red

    Add-Content $reportFile "flutter pub get FAILED"

    exit
}

# =========================================================
# DART AUTO FIX
# =========================================================

Write-Host "[8/10] Applying dart fixes..." -ForegroundColor Cyan

dart fix --apply

# =========================================================
# DETECT DUPLICATES
# =========================================================

Write-Host "[9/10] Scanning duplicate architecture..." -ForegroundColor Cyan

$duplicates = Get-ChildItem . -Recurse -File |
Group-Object Name |
Where-Object { $_.Count -gt 1 }

if ($duplicates.Count -gt 0) {

    Write-Host "Duplicate files detected." -ForegroundColor Yellow

    foreach ($dup in $duplicates) {

        Write-Host ""
        Write-Host $dup.Name -ForegroundColor Magenta

        Add-Content $reportFile "Duplicate: $($dup.Name)"

        foreach ($file in $dup.Group) {

            Write-Host " -> $($file.FullName)"

            Add-Content $reportFile " -> $($file.FullName)"
        }
    }

} else {

    Write-Host "No duplicate filenames detected." -ForegroundColor Green
}

# =========================================================
# FLUTTER ANALYZE
# =========================================================

Write-Host "[10/10] Running flutter analyze..." -ForegroundColor Cyan

flutter analyze | Tee-Object -FilePath $analysisFile

# =========================================================
# FINAL REPORT
# =========================================================

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host " RECOVERY COMPLETE"
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""

Write-Host "Generated files:" -ForegroundColor Cyan
Write-Host " -> $reportFile"
Write-Host " -> $analysisFile"
Write-Host ""

Write-Host "Recommended next actions:" -ForegroundColor Yellow
Write-Host "1. Merge duplicate models"
Write-Host "2. Remove dead imports"
Write-Host "3. Standardize architecture"
Write-Host "4. Add CI/CD pipeline"
Write-Host "5. Add automated tests"
Write-Host ""

Add-Content $reportFile "Recovery completed successfully."