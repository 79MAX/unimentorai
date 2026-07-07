# =========================
# UNI MENTOR AI - V3 REAL AUTONOMOUS OS
# =========================

$root = "C:\Users\DJOTOHOU\UNIMENTORAI\unimentorai"
$systemMapPath = "$root\system\system-map.json"

if (!(Test-Path $systemMapPath)) {
    throw "SYSTEM_MAP not found"
}

$systemMap = Get-Content $systemMapPath -Raw | ConvertFrom-Json

$existing = @()
$missing = @()

foreach ($f in $systemMap.files) {
    $full = Join-Path $root $f
    if (Test-Path $full) { $existing += $f }
    else { $missing += $f }
}

$healthScore = [math]::Round(($existing.Count / $systemMap.files.Count) * 100, 2)

$model = "llama3.1:8b"

if ($missing.Count -gt 15) {
    $model = "deepseek-r1:8b"
}
elseif ($systemMap.files.Count -gt 40) {
    $model = "qwen3-coder:30b"
}
elseif ($healthScore -lt 70) {
    $model = "gemma4:latest"
}

$context = @{
    system = $systemMap.system
    type = $systemMap.type
    total_files = $systemMap.files.Count
    existing_files = $existing.Count
    missing_files = $missing.Count
    health_score = $healthScore
} | ConvertTo-Json -Depth 10

$prompt = @"
SYSTEM:
You are V3 REAL AUTONOMOUS AI OS ENGINE.

RULES:
- NEVER hallucinate
- ONLY use JSON input
- If unknown → write NOT PRESENT
- Be deterministic

TASK:
Generate production-grade architecture refactor plan.

INPUT:
$context

OUTPUT:
## SYSTEM HEALTH
## ARCHITECTURE REALITY
## CRITICAL ISSUES
## MISSING COMPONENTS
## REFACTOR STRATEGY
## PRODUCTION READINESS SCORE
## FINAL ACTION PLAN
"@

$body = @{
    model = $model
    prompt = $prompt
    stream = $false
} | ConvertTo-Json -Depth 20

Write-Host "🚀 Running V3 AI OS..." -ForegroundColor Cyan
Write-Host "Model: $model" -ForegroundColor Yellow
Write-Host "Health: $healthScore%" -ForegroundColor Green

$response = Invoke-RestMethod `
    -Uri "http://localhost:11434/api/generate" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"

Write-Host "`n===== V3 OUTPUT =====`n" -ForegroundColor Cyan
$response.response

$response.response | Out-File "$root\v3-autonomous-report.txt" -Encoding UTF8

Write-Host "`nSaved: v3-autonomous-report.txt" -ForegroundColor Green
