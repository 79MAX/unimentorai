# =========================================================
# UniMentorAI - Backend Stabilizer V2 (CLEAN + SAFE)
# CTO Edition - Production Ready Cleanup Script
# =========================================================

$ErrorActionPreference = "Continue"
Clear-Host

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   UniMentorAI BACKEND STABILIZER V2"
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# =========================================================
# ROOT CHECK
# =========================================================

$root = Get-Location

if (!(Test-Path "$root\backend")) {
    Write-Host "❌ backend folder not found. Run from project root." -ForegroundColor Red
    exit
}

Set-Location "$root\backend"

# =========================================================
# VARIABLES
# =========================================================

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFolder = "..\backend_backup_$timestamp"
$reportFile = "stabilize_report_$timestamp.txt"

# =========================================================
# REPORT INIT
# =========================================================

@"
==================================================
UniMentorAI Backend Stabilization Report V2
Generated: $timestamp
==================================================

"@ | Out-File $reportFile

# =========================================================
# BACKUP CORE FILES (SAFE SNAPSHOT)
# =========================================================

Write-Host "[1/8] Creating backup..." -ForegroundColor Cyan

New-Item -ItemType Directory -Path $backupFolder -Force | Out-Null

$exclude = @("node_modules", ".git")

Get-ChildItem -Force | Where-Object {
    $exclude -notcontains $_.Name
} | Copy-Item -Destination $backupFolder -Recurse -Force

Write-Host "Backup created: $backupFolder" -ForegroundColor Green
Add-Content $reportFile "Backup created: $backupFolder"

# =========================================================
# REMOVE DUPLICATE ARCHITECTURE FOLDERS
# =========================================================

Write-Host ""
Write-Host "[2/8] Removing duplicate architecture..." -ForegroundColor Cyan

$duplicateFolders = @(
    "middleware"   # ❌ deprecated (keep middlewares)
)

foreach ($folder in $duplicateFolders) {
    if (Test-Path $folder) {
        Remove-Item $folder -Recurse -Force
        Write-Host "Removed: $folder" -ForegroundColor Yellow
        Add-Content $reportFile "Removed folder: $folder"
    }
}

# =========================================================
# CLEAN TEMP FILES
# =========================================================

Write-Host ""
Write-Host "[3/8] Cleaning temp folders..." -ForegroundColor Cyan

$trash = @(".tmp", "dist", "build")

foreach ($t in $trash) {
    if (Test-Path $t) {
        Remove-Item $t -Recurse -Force
        Write-Host "Deleted: $t" -ForegroundColor Green
    }
}

# =========================================================
# DETECT EMPTY CRITICAL FILES
# =========================================================

Write-Host ""
Write-Host "[4/8] Detecting empty files..." -ForegroundColor Cyan

Get-ChildItem -Recurse -File |
Where-Object { $_.Length -eq 0 -and $_.Extension -in @(".js", ".ts") } |
ForEach-Object {
    Write-Host "Empty file: $($_.FullName)" -ForegroundColor Yellow
    Add-Content $reportFile "Empty file: $($_.FullName)"
}

# =========================================================
# DUPLICATE FILE DETECTION
# =========================================================

Write-Host ""
Write-Host "[5/8] Detecting duplicates..." -ForegroundColor Cyan

$duplicates = Get-ChildItem -Recurse -File |
Group-Object Name |
Where-Object { $_.Count -gt 1 }

foreach ($d in $duplicates) {
    Write-Host "Duplicate: $($d.Name)" -ForegroundColor Magenta
    Add-Content $reportFile "Duplicate: $($d.Name)"

    foreach ($f in $d.Group) {
        Write-Host " -> $($f.FullName)"
    }
}

# =========================================================
# IMPORT VALIDATION (CRITICAL FIX CHECK)
# =========================================================

Write-Host ""
Write-Host "[6/8] Checking broken imports..." -ForegroundColor Cyan

Get-ChildItem -Recurse -Include *.js |
Select-String "../middleware/" -ErrorAction SilentlyContinue |
ForEach-Object {
    Write-Host "Broken import detected: $($_.Path)" -ForegroundColor Red
    Add-Content $reportFile "Broken import: $($_.Path)"
}

# =========================================================
# ENTRY POINT CHECK
# =========================================================

Write-Host ""
Write-Host "[7/8] Checking entry files..." -ForegroundColor Cyan

$entryFiles = @("app.js", "server.js")

foreach ($f in $entryFiles) {
    if (Test-Path $f) {
        Write-Host "OK: $f" -ForegroundColor Green
    } else {
        Write-Host "MISSING: $f" -ForegroundColor Red
        Add-Content $reportFile "Missing entry file: $f"
    }
}

# =========================================================
# FINAL STATUS
# =========================================================

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host " STABILIZATION V2 COMPLETE"
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Report: $reportFile"
Write-Host ""
Write-Host "Next step: run 'npm install' + 'npm run dev'" -ForegroundColor Cyan