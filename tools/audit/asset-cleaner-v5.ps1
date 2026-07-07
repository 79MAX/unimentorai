# =========================
# UNIMENTORAI ASSET CLEANER V5
# SAFE DELETE ENTERPRISE SYSTEM
# =========================

Set-Location "C:\Users\DJOTOHOU\UNIMENTORAI\unimentorai"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "UNIMENTORAI ASSET CLEANER V5" -ForegroundColor Cyan
Write-Host "SAFE DELETE ENTERPRISE SYSTEM" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$protectedPatterns = @(
"logo","brand","unimentor","certificate","certificat",
"watermark","seal","signature","favicon"
)

$criticalDirs = @(
"certificate","certificates",
"backend","pdf","generate",
"auth","security","payment"
)

$excludeDirs = @("node_modules",".git","dist","build","coverage",".next")

Write-Host "Indexation code source..." -ForegroundColor Yellow

$sourceFiles = Get-ChildItem -Recurse -File |
Where-Object {
    foreach($d in $excludeDirs){
        if($_.FullName -match $d){ return $false }
    }
    $_.Extension -in ".js",".jsx",".ts",".tsx",".json",".css",".html"
}

$code = ""
foreach($f in $sourceFiles){
    try { $code += Get-Content $f.FullName -Raw -ErrorAction Stop } catch {}
}

Write-Host "Code indexé OK" -ForegroundColor Green

$assets = Get-ChildItem -Recurse -File -Include `
*.svg,*.png,*.jpg,*.jpeg,*.webp,*.ico,`
*.pdf,*.doc,*.docx,*.md,*.txt |
Where-Object {
    foreach($d in $excludeDirs){
        if($_.FullName -match $d){ return $false }
    }
    return $true
}

$result = foreach($a in $assets){

    $name = $a.Name.ToLower()
    $base = $a.BaseName.ToLower()

    $score = 0
    $status = "UNUSED"
    $reason = ""

    foreach($p in $protectedPatterns){
        if($name -match $p -or $base -match $p){
            $score = 100
            $status = "PROTECTED"
            $reason = "Brand/Core Asset"
        }
    }

    foreach($c in $criticalDirs){
        if($code -match $base -and $a.FullName -match $c){
            if($score -lt 90){
                $score = 90
                $status = "CRITICAL"
                $reason = "Used in critical system"
            }
        }
    }

    if($code -match $base -and $score -eq 0){
        $score = 60
        $status = "USED"
        $reason = "Referenced in code"
    }

    if($score -eq 0){
        $status = "SAFE_DELETE"
        $reason = "No reference found"
    }

    [PSCustomObject]@{
        Asset = $a.FullName
        Status = $status
        Score = $score
        SizeKB = [math]::Round($a.Length/1KB,2)
        Reason = $reason
    }
}

$result | Export-Csv ".\asset-cleaner-v5.csv" -NoTypeInformation -Encoding UTF8

$deleteList = $result | Where-Object { $_.Status -eq "SAFE_DELETE" }

$deleteList | Select-Object Asset | Out-File ".\asset-safe-delete-v5.txt"

Write-Host ""
Write-Host "SCAN TERMINÉ V5" -ForegroundColor Green
Write-Host ("Total assets : " + $result.Count)
Write-Host ("Safe delete  : " + $deleteList.Count) -ForegroundColor Red
Write-Host ""
Write-Host "Fichiers générés:"
Write-Host "- asset-cleaner-v5.csv"
Write-Host "- asset-safe-delete-v5.txt"
