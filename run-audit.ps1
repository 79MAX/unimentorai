# =========================
# UNI MENTOR AI - AUDIT ENGINE V3
# =========================

$ErrorActionPreference = "Stop"

# =========================
# CONFIG
# =========================

$systemMapPath = "C:\Users\DJOTOHOU\UNIMENTORAI\unimentorai\system\system-map.json"
$outputPrompt = "C:\Users\DJOTOHOU\UNIMENTORAI\unimentorai\audit-prompt.txt"
$outputReport = "C:\Users\DJOTOHOU\UNIMENTORAI\unimentorai\audit-report.txt"

$ollamaUrl = "http://localhost:11434/api/generate"
$model = "llama3"

# =========================
# LOAD SYSTEM MAP
# =========================

Write-Host "🔍 Loading SYSTEM_MAP..." -ForegroundColor Cyan

if (!(Test-Path $systemMapPath)) {
    throw "SYSTEM_MAP introuvable: $systemMapPath"
}

$systemMapRaw = Get-Content $systemMapPath -Raw
$systemMap = $systemMapRaw | ConvertFrom-Json

Write-Host "✅ SYSTEM_MAP loaded: $($systemMap.system)" -ForegroundColor Green

# =========================
# BUILD PROMPT
# =========================

Write-Host "🧠 Building audit prompt..." -ForegroundColor Cyan

$systemMapJson = $systemMap | ConvertTo-Json -Depth 20

$prompt = @"
You are a Senior Principal Software Architect and Security Auditor.

TASK:
Perform deep architecture, security, and dependency audit.

RULES:
- Be strict
- Separate facts vs assumptions
- No hallucination
- Be technical and precise

SYSTEM_MAP:
$systemMapJson

OUTPUT FORMAT:
1. Architecture Analysis
2. Security Risks
3. Dependency Review
4. Critical Issues
5. Recommendations
"@

# Save prompt
Set-Content -Path $outputPrompt -Value $prompt -Encoding UTF8

Write-Host "📄 Prompt saved: $outputPrompt" -ForegroundColor Green

# =========================
# CALL OLLAMA (AI ENGINE)
# =========================

Write-Host "🚀 Calling AI Engine (Ollama)..." -ForegroundColor Cyan

try {
    $body = @{
        model = $model
        prompt = $prompt
        stream = $false
    } | ConvertTo-Json -Depth 10

    $response = Invoke-RestMethod -Uri $ollamaUrl -Method POST -Body $body -ContentType "application/json"

    $aiOutput = $response.response

    if (-not $aiOutput) {
        throw "Empty AI response"
    }

    Write-Host "✅ AI response received" -ForegroundColor Green
}
catch {
    Write-Host "⚠️ Ollama not available or failed. Falling back to prompt-only mode." -ForegroundColor Yellow
    $aiOutput = "AI ENGINE NOT AVAILABLE. PROMPT GENERATED ONLY.`n`n" + $prompt
}

# =========================
# SAVE FINAL REPORT
# =========================

Write-Host "💾 Writing audit report..." -ForegroundColor Cyan

Set-Content -Path $outputReport -Value $aiOutput -Encoding UTF8

# =========================
# OUTPUT SUMMARY
# =========================

Write-Host "`n===== AUDIT COMPLETE =====" -ForegroundColor Green
Write-Host "Prompt : $outputPrompt"
Write-Host "Report : $outputReport"

# =========================
# OPEN RESULT
# =========================

if (Get-Command code -ErrorAction SilentlyContinue) {
    code $outputReport
} else {
    Start-Process notepad.exe $outputReport
}