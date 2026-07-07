Write-Host "=== FLUTTER REPAIR ENGINE SAFE MODE ===`n" -ForegroundColor Cyan

$root = Get-Location
$libPath = Join-Path $root "lib"

if (-not (Test-Path $libPath)) {
    Write-Host "❌ lib/ introuvable" -ForegroundColor Red
    exit
}

Write-Host "📦 Scan projet..." -ForegroundColor Yellow

$dartFiles = Get-ChildItem $libPath -Recurse -Filter "*.dart" -File -ErrorAction SilentlyContinue
Write-Host "✔ Dart files: $($dartFiles.Count)`n" -ForegroundColor Green

$allText = ($dartFiles | ForEach-Object {
    Get-Content $_.FullName -ErrorAction SilentlyContinue
}) -join "`n"

Write-Host "🔍 Analyse imports..." -ForegroundColor Yellow

$importRegex = 'import\s+["''](.*?)["'']'
$matches = [regex]::Matches($allText, $importRegex)

$broken = @()
$valid = @()

foreach ($m in $matches) {

    $path = $m.Groups[1].Value

    if ($path -match "^(package:|dart:)") {
        continue
    }

    $resolved = Join-Path $root $path

    if (Test-Path $resolved) {
        $valid += $path
    } else {
        $broken += $path
    }
}

$broken = $broken | Select-Object -Unique

Write-Host "❌ Broken imports: $($broken.Count)`n" -ForegroundColor Red

Write-Host "🧩 Feature mapping..." -ForegroundColor Yellow

$featuresPath = Join-Path $libPath "features"
$features = Get-ChildItem $featuresPath -Directory -ErrorAction SilentlyContinue

$unused = @()

foreach ($f in $features) {

    if ($allText -notmatch [regex]::Escape($f.Name)) {
        $unused += $f.Name
    }
}

Write-Host "`n========================" -ForegroundColor Cyan
Write-Host "📊 REPAIR REPORT (SAFE MODE)"
Write-Host "========================`n"

Write-Host "📁 Total Dart files: $($dartFiles.Count)"
Write-Host "❌ Broken imports: $($broken.Count)"
Write-Host "🧩 Unused features: $($unused.Count)"

Write-Host "`n🚨 ACTION REQUIRED:"
Write-Host " - Fix imports cassés"
Write-Host " - Vérifier features inutilisées"
Write-Host " - Stabiliser architecture core"

Write-Host "`n=== END SAFE REPAIR ENGINE ===" -ForegroundColor Cyan
