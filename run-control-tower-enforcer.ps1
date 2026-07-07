# =========================
# UNI MENTOR AI - CONTROL TOWER ENFORCER V1
# =========================

$root = Get-Location
$reportDir = ".\control-tower-report"
New-Item -ItemType Directory -Path $reportDir -Force | Out-Null

Write-Host "🚨 CONTROL TOWER ENFORCER STARTING..." -ForegroundColor Cyan

# =========================
# 1. DETECT DUPLICATES
# =========================

$files = Get-ChildItem $root -Recurse -File

$duplicates = $files | Group-Object Name | Where-Object { $_.Count -gt 1 }

$duplicatesReport = @()

foreach ($d in $duplicates) {
    $duplicatesReport += "DUPLICATE: $($d.Name) => $($d.Count)"
}

$duplicatesReport | Out-File "$reportDir\duplicates.txt"

# =========================
# 2. DETECT AI MULTI-ENGINE CLUSTERS
# =========================

$aiFiles = $files | Where-Object {
    $_.FullName -match "ai|memory|router|prompt|engine|context"
}

$aiClusters = $aiFiles | Group-Object Name | Where-Object { $_.Count -gt 1 }

$aiClusterReport = @()

foreach ($c in $aiClusters) {
    $aiClusterReport += "AI CLUSTER DUPLICATE: $($c.Name)"
}

$aiClusterReport | Out-File "$reportDir\ai-clusters.txt"

# =========================
# 3. DETECT DANGEROUS ARCHIVES
# =========================

$archiveFiles = Get-ChildItem ".\archive-v2" -Recurse -File -ErrorAction SilentlyContinue

$archiveReport = @()

if ($archiveFiles) {
    $archiveReport += "ARCHIVE-V2 DETECTED: $($archiveFiles.Count) files"
}

$archiveReport | Out-File "$reportDir\archive-report.txt"

# =========================
# 4. SYSTEM HEALTH SCORE
# =========================

$totalFiles = $files.Count
$duplicatePenalty = $duplicates.Count * 2
$aiPenalty = $aiClusters.Count * 3

$score = 100 - ($duplicatePenalty + $aiPenalty)

if ($score -lt 0) { $score = 0 }

"TOTAL FILES: $totalFiles" | Out-File "$reportDir\health.txt"
"SYSTEM SCORE: $score / 100" | Out-File "$reportDir\health.txt" -Append

# =========================
# 5. CONTROL TOWER SUMMARY
# =========================

Write-Host "=========================" -ForegroundColor Yellow
Write-Host "CONTROL TOWER REPORT" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow

Write-Host "Total Files: $totalFiles"
Write-Host "Duplicate Groups: $($duplicates.Count)"
Write-Host "AI Clusters: $($aiClusters.Count)"
Write-Host "System Score: $score / 100"

Write-Host "📁 Reports saved in: control-tower-report/" -ForegroundColor Green
