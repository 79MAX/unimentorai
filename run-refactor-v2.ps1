# =========================
# REFACTOR ENGINE V2 - AUTONOMOUS
# =========================

$systemMapPath = "C:\Users\DJOTOHOU\UNIMENTORAI\unimentorai\system\system-map.json"
$rootPath = "C:\Users\DJOTOHOU\UNIMENTORAI\unimentorai"

if (!(Test-Path $systemMapPath)) {
    throw "SYSTEM_MAP introuvable"
}

$systemMap = Get-Content $systemMapPath -Raw | ConvertFrom-Json

$existing = @()
$missing = @()

foreach ($file in $systemMap.files) {
    $fullPath = Join-Path $rootPath $file

    if (Test-Path $fullPath) {
        $existing += $file
    } else {
        $missing += $file
    }
}

$analysis = @{
    system = $systemMap.system
    type = $systemMap.type
    total_files = $systemMap.files.Count
    existing_files = $existing
    missing_files = $missing
    architecture_hint = "modular-monorepo"
}

$analysisJson = $analysis | ConvertTo-Json -Depth 10

$prompt = @"
SYSTEM:
You are a deterministic refactor engine.

RULES:
- ONLY use provided JSON
- DO NOT assume anything
- DO NOT invent files or dependencies
- If unknown: write NOT PRESENT

TASK:
Generate a production-grade refactor plan.

INPUT_JSON:
$analysisJson

OUTPUT FORMAT:
## ARCHITECTURE REALITY
## FILE SYSTEM ISSUES
## MISSING COMPONENTS
## TECH DEBT
## REFACTOR STRATEGY
## FINAL ACTION PLAN
"@

$body = @{
    model = "llama3.1:8b"
    prompt = $prompt
    stream = $false
} | ConvertTo-Json -Depth 20

$response = Invoke-RestMethod `
    -Uri "http://localhost:11434/api/generate" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"

Write-Host "`n===== REFACTOR ENGINE V2 OUTPUT =====`n" -ForegroundColor Green
$response.response

$response.response | Out-File "refactor-report-v2.txt" -Encoding UTF8

Write-Host "`nSaved: refactor-report-v2.txt" -ForegroundColor Cyan
