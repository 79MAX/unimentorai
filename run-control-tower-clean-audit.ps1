# =========================
# UNIMENTORAI CLEAN AUDIT ENGINE V1
# =========================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Clear-Host
Write-Host "🚀 CLEAN AUDIT START - UniMentorAI" -ForegroundColor Cyan

$root = Get-Location

# =========================
# SCAN DUPLICATES
# =========================

Write-Host "`n🔍 Scanning duplicates..." -ForegroundColor Yellow

$files = Get-ChildItem -Recurse -File | Where-Object {
    $_.FullName -match "src\\src|duplicate|copy|backup|old|v7|v8|v9"
}

if ($files.Count -eq 0) {
    Write-Host "✔ No obvious duplicate folders found" -ForegroundColor Green
} else {
    Write-Host "`n⚠ POSSIBLE DUPLICATES:" -ForegroundColor Red
    $files | ForEach-Object { Write-Host $_.FullName }
}

# =========================
# CHECK ARCHITECTURE STRUCTURE
# =========================

Write-Host "`n🏗 Checking architecture..." -ForegroundColor Yellow

$structure = @(
    "src\ai",
    "src\auth",
    "src\security",
    "src\payment",
    "src\shared",
    "src\ui"
)

foreach ($folder in $structure) {
    if (Test-Path $folder) {
        Write-Host "✔ OK: $folder" -ForegroundColor Green
    } else {
        Write-Host "⚠ MISSING: $folder" -ForegroundColor Red
    }
}

# =========================
# DETECT LARGE FILES (POTENTIAL PROBLEMS)
# =========================

Write-Host "`n📦 Checking large files..." -ForegroundColor Yellow

Get-ChildItem -Recurse -File |
Where-Object { $_.Length -gt 500KB } |
Sort-Object Length -Descending |
Select-Object FullName, Length |
Format-Table -AutoSize

# =========================
# REPORT
# =========================

Write-Host "`n===== CLEAN AUDIT COMPLETE =====" -ForegroundColor Cyan
Write-Host "Next step: propose refactor plan + safe cleanup script" -ForegroundColor Yellow
