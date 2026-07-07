Write-Host "=== FLUTTER IMPORT REPAIR ENGINE ===" -ForegroundColor Cyan

$root = Get-Location
$lib = Join-Path $root "lib"

$dartFiles = Get-ChildItem $lib -Recurse -Filter "*.dart" -File

$broken = @()

foreach ($file in $dartFiles) {

    $content = Get-Content $file.FullName -ErrorAction SilentlyContinue

    foreach ($line in $content) {

        if ($line -match 'import\s+["''](.*?)["'']') {

            $importPath = $matches[1]

            if ($importPath -notmatch "package:|dart:") {

                $fullPath = Join-Path $root $importPath

                if (-not (Test-Path $fullPath)) {

                    $broken += [PSCustomObject]@{
                        File = $file.FullName
                        BrokenImport = $importPath
                    }
                }
            }
        }
    }
}

Write-Host "`n❌ Imports cassés détectés: $($broken.Count)" -ForegroundColor Red

$broken | Select-Object -First 30 | Format-Table -AutoSize

$broken | Export-Csv ".\broken_imports_report.csv" -NoTypeInformation

Write-Host "`n📄 Rapport généré: broken_imports_report.csv" -ForegroundColor Green
Write-Host "=== END REPAIR ENGINE ===" -ForegroundColor Cyan