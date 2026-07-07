Write-Host "=== FLUTTER ARCHITECTURE LOCK ENGINE ===" -ForegroundColor Cyan

$root = Get-Location
$lib = Join-Path $root "lib"

# 1. SCAN
$files = Get-ChildItem $lib -Recurse -Filter "*.dart" -File
Write-Host "📦 Dart files: $($files.Count)" -ForegroundColor Green

# 2. IMPORT EXTRACTION
$importRegex = 'import\s+["''](.*?)["'']'
$broken = @()

foreach ($f in $files) {

    $content = Get-Content $f.FullName -ErrorAction SilentlyContinue

    foreach ($line in $content) {

        if ($line -match $importRegex) {

            $imp = $matches[1]

            if ($imp -match "package:|dart:") { continue }

            $target = Join-Path $root $imp

            if (-not (Test-Path $target)) {

                $broken += [PSCustomObject]@{
                    File = $f.FullName
                    Import = $imp
                }
            }
        }
    }
}

# 3. FEATURES HEALTH
$featuresPath = Join-Path $lib "features"
$features = Get-ChildItem $featuresPath -Directory -ErrorAction SilentlyContinue

$unused = @()

foreach ($feat in $features) {

    $hit = Select-String -Path $files.FullName -Pattern $feat.Name -Quiet -ErrorAction SilentlyContinue

    if (-not $hit) {
        $unused += $feat.Name
    }
}

# 4. SCORE ENGINE
function Score($brokenCount, $unusedCount) {
    $score = 100 - ($brokenCount * 1.2) - ($unusedCount * 3)
    if ($score -lt 0) { return 0 }
    return [math]::Round($score)
}

$score = Score $broken.Count $unused.Count

# 5. REPORT
Write-Host "`n======================" -ForegroundColor Cyan
Write-Host "🔒 ARCHITECTURE LOCK REPORT"
Write-Host "======================"

Write-Host "📁 Files: $($files.Count)"
Write-Host "❌ Broken imports: $($broken.Count)"
Write-Host "🧩 Unused features: $($unused.Count)"
Write-Host "📊 Score: $score / 100"

Write-Host "`n🚨 SAMPLE BROKEN IMPORTS"
$broken | Select-Object -First 10 | Format-Table -AutoSize

Write-Host "`n🧩 UNUSED FEATURES"
$unused

# 6. EXPORT
$broken | Out-File ".\broken_imports.txt"
$unused | Out-File ".\unused_features.txt"

Write-Host "`n✔ LOCK ENGINE COMPLETE" -ForegroundColor Green
