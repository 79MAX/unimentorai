# =========================
# SAFE CLEANUP ENGINE V1 - UniMentorAI
# =========================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Clear-Host
Write-Host "🚀 SAFE CLEANUP ENGINE START" -ForegroundColor Cyan

# =========================
# 1. DETECT DUPLICATES
# =========================

Write-Host "`n🔍 Detecting src/src duplication..." -ForegroundColor Yellow

$duplicates = Get-ChildItem -Recurse -File | Where-Object {
    $_.FullName -match "src\\src"
}

if ($duplicates.Count -gt 0) {
    Write-Host "`n⚠ DUPLICATES FOUND:" -ForegroundColor Red
    $duplicates | ForEach-Object { Write-Host $_.FullName }
} else {
    Write-Host "✔ No src/src duplication found" -ForegroundColor Green
}

# =========================
# 2. OLD VERSION FILES
# =========================

Write-Host "`n🧪 Detecting legacy versions..." -ForegroundColor Yellow

$legacy = Get-ChildItem -Recurse -File | Where-Object {
    $_.Name -match "v7|v8|v9|old|backup|copy"
}

if ($legacy.Count -gt 0) {
    Write-Host "`n⚠ LEGACY FILES:" -ForegroundColor Red
    $legacy | ForEach-Object { Write-Host $_.FullName }
} else {
    Write-Host "✔ No legacy files detected" -ForegroundColor Green
}

# =========================
# 3. LARGE FILES CHECK
# =========================

Write-Host "`n📦 Checking large files (>500KB)..." -ForegroundColor Yellow

Get-ChildItem -Recurse -File |
Where-Object { $_.Length -gt 500KB } |
Sort-Object Length -Descending |
Select-Object FullName, Length |
Format-Table -AutoSize

# =========================
# 4. STRUCTURE VALIDATION
# =========================

Write-Host "`n🏗 Checking clean architecture structure..." -ForegroundColor Yellow

$structure = @(
    "src\core",
    "src\ai",
    "src\auth",
    "src\security",
    "src\payment",
    "src\ui",
    "src\shared",
    "src\realtime",
    "src\modules"
)

foreach ($folder in $structure) {
    if (Test-Path $folder) {
        Write-Host "✔ OK: $folder" -ForegroundColor Green
    } else {
        Write-Host "⚠ MISSING: $folder" -ForegroundColor Red
    }
}

# =========================
# 5. REPORT GENERATION
# =========================

$reportPath = ".\cleanup-report.txt"

"UNIMENTORAI CLEANUP REPORT`n" | Out-File $reportPath

"=== DUPLICATES ===" | Out-File $reportPath -Append
$duplicates.FullName | Out-File $reportPath -Append

"=== LEGACY FILES ===" | Out-File $reportPath -Append
$legacy.FullName | Out-File $reportPath -Append

Write-Host "`n📄 REPORT GENERATED: cleanup-report.txt" -ForegroundColor Cyan

Write-Host "`n🚀 SAFE CLEANUP COMPLETE (NO FILE DELETED)" -ForegroundColor Green
