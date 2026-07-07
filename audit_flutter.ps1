Write-Host "=== FLUTTER AUDIT ENGINE ENTERPRISE ===`n" -ForegroundColor Cyan

$root = Get-Location
$libPath = Join-Path $root "lib"

if (-not (Test-Path $libPath)) {
    Write-Host "❌ lib/ introuvable" -ForegroundColor Red
    exit
}

# =========================
# 1. COLLECTE SAFE
# =========================
Write-Host "📦 Collecte Dart..." -ForegroundColor Yellow

$dartFiles = Get-ChildItem $libPath -Recurse -Filter "*.dart" -File -ErrorAction SilentlyContinue
Write-Host "✔ Dart files: $($dartFiles.Count)`n" -ForegroundColor Green

# =========================
# 2. INDEX FILE SYSTEM (IMPORTANT FIX)
# =========================
$allFilesIndex = @{}
Get-ChildItem $root -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object {
    $allFilesIndex[$_.FullName.Replace($root.Path + "\", "")] = $true
}

# =========================
# 3. IMPORT ANALYSIS (FIXÉ & FIABLE)
# =========================
Write-Host "🔍 Analyse imports..." -ForegroundColor Yellow

$importRegex = 'import\s+["'']([^"'';]+)["'']'
$brokenImports = @()

foreach ($file in $dartFiles) {

    $content = Get-Content $file.FullName -ErrorAction SilentlyContinue

    foreach ($line in $content) {

        if ($line -match $importRegex) {

            $importPath = $matches[1]

            # skip flutter & dart core
            if ($importPath -match "^(package:|dart:)") {
                continue
            }

            # normalize path
            $cleanPath = $importPath -replace "^\./", ""
            $resolvedPath = Join-Path (Split-Path $file.FullName) $cleanPath

            if (-not (Test-Path $resolvedPath)) {
                $brokenImports += "$($file.Name) -> $importPath"
            }
        }
    }
}

Write-Host "❌ Imports cassés: $($brokenImports.Count)`n" -ForegroundColor Red

# =========================
# 4. DEAD CODE (SIGNAL-BASED)
# =========================
Write-Host "🧠 Analyse code suspect..." -ForegroundColor Yellow

$allText = ($dartFiles | ForEach-Object {
    Get-Content $_.FullName -ErrorAction SilentlyContinue
}) -join "`n"

function UsageCount($pattern) {
    ([regex]::Matches($allText, [regex]::Escape($pattern))).Count
}

$targets = @(
    "AuthService",
    "PaymentService",
    "CourseService",
    "AnalyticsService",
    "GamificationService",
    "UserService"
)

$deadCode = @()

foreach ($t in $targets) {
    $count = UsageCount $t
    if ($count -le 1) {
        $deadCode += "$t (usage faible: $count)"
    }
}

# =========================
# 5. FEATURES UNUSED (AMÉLIORÉ)
# =========================
Write-Host "🧩 Features scan..." -ForegroundColor Yellow

$featuresPath = Join-Path $libPath "features"
$features = Get-ChildItem $featuresPath -Directory -ErrorAction SilentlyContinue

$unusedFeatures = @()

foreach ($f in $features) {

    $name = $f.Name
    $used = Select-String -Path ($dartFiles.FullName) -Pattern $name -Quiet -ErrorAction SilentlyContinue

    if (-not $used) {
        $unusedFeatures += $name
    }
}

# =========================
# 6. SCORE ENGINE (PLUS INTELLIGENT)
# =========================

function Clamp($v) {
    if ($v -lt 0) { return 0 }
    if ($v -gt 100) { return 100 }
    return $v
}

$scoreImports = Clamp (100 - ($brokenImports.Count * 0.8))
$scoreDead    = Clamp (100 - ($deadCode.Count * 6))
$scoreFeature = Clamp (100 - ($unusedFeatures.Count * 4))

$globalScore = [math]::Round(($scoreImports + $scoreDead + $scoreFeature) / 3)

# =========================
# 7. OUTPUT
# =========================

Write-Host "`n========================" -ForegroundColor Cyan
Write-Host "📊 SCORE GLOBAL: $globalScore / 100"
Write-Host "========================`n"

Write-Host "❌ Imports cassés: $($brokenImports.Count)"
Write-Host "🧠 Code suspect: $($deadCode.Count)"
Write-Host "🧩 Features inutilisées: $($unusedFeatures.Count)"

# =========================
# 8. REPORT EXPORT
# =========================

$report = @"
FLUTTER AUDIT ENGINE ENTERPRISE

SCORE GLOBAL: $globalScore / 100

--- IMPORTS CASSÉS ---
$($brokenImports -join "`n")

--- CODE SUSPECT ---
$($deadCode -join "`n")

--- FEATURES ---
$($unusedFeatures -join "`n")

Generated: $(Get-Date)
"@

$reportPath = ".\flutter_audit_enterprise_report.txt"
$report | Set-Content $reportPath -Encoding UTF8

Write-Host "`n📄 Rapport: $reportPath" -ForegroundColor Green
Write-Host "`n=== END ENGINE ===" -ForegroundColor Cyan