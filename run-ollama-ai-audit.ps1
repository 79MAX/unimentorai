# =========================
# UNI MENTOR AI - OLLAMA AUDIT RUNNER (STABLE v1)
# =========================

$ErrorActionPreference = "Stop"

Write-Host "🚀 STARTING UNI MENTOR AI AUDIT..." -ForegroundColor Cyan

# =========================
# SAFE ROOT PATH
# =========================

$rootPath = Get-Location

$promptPath = Join-Path $rootPath "audit-prompt.txt"
$mapPath    = Join-Path $rootPath "system-map.json"

# =========================
# FILE CHECKS (NO CRASH LATER)
# =========================

if (!(Test-Path $promptPath)) {
    throw "❌ Missing file: audit-prompt.txt"
}

if (!(Test-Path $mapPath)) {
    throw "❌ Missing file: system-map.json"
}

# =========================
# LOAD FILES
# =========================

$prompt = Get-Content $promptPath -Raw
$systemMap = Get-Content $mapPath -Raw

# =========================
# BUILD FINAL PROMPT (SAFE REPLACE ONLY)
# =========================

$finalPrompt = $prompt.Replace("{{SYSTEM_MAP}}", $systemMap)

# =========================
# RUN OLLAMA (CLEAN CALL)
# =========================

$model = "llama3.1:8b"

Write-Host "`n🧠 Running Ollama model: $model ..." -ForegroundColor Yellow

$response = & ollama run $model "$finalPrompt"

# =========================
# OUTPUT
# =========================

Write-Host "`n===== RESULT =====`n" -ForegroundColor Green
Write-Output $response

Write-Host "`n✅ AUDIT COMPLETED" -ForegroundColor Cyan