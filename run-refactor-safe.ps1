# =========================
# UNI MENTOR AI - SAFE REFACTOR ENGINE (OLLAMA)
# =========================

$systemMapPath = ".\system-map-v2.json"
$outputReport = ".\refactor-safe-report.txt"

if (!(Test-Path $systemMapPath)) {
    throw "SYSTEM_MAP v2 introuvable"
}

$systemMap = Get-Content $systemMapPath -Raw

$prompt = @"
SYSTEM ROLE:
You are a Senior Silicon Valley CTO AI Refactor Engine.

CRITICAL RULES:
- NEVER modify or delete existing code
- NEVER assume missing information
- ALWAYS preserve current system
- ONLY propose safe refactor plan
- OUTPUT must be migration-safe

TASK:
Perform SAFE REFACTOR ANALYSIS of UniMentorAI.

DELIVER:
1. Architecture issues
2. Duplicate modules detection
3. Safe consolidation plan
4. Suggested new structure (NO deletion)
5. Step-by-step migration plan
6. Risk analysis

SYSTEM_MAP:
$systemMap
"@

$body = @{
    model = "qwen3-coder:30b"
    prompt = $prompt
    stream = $false
} | ConvertTo-Json -Depth 20

Write-Host "🚀 Running SAFE REFACTOR with Ollama..." -ForegroundColor Cyan

$response = Invoke-RestMethod `
    -Uri "http://localhost:11434/api/generate" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"

$response.response | Out-File $outputReport -Encoding UTF8

Write-Host "✅ SAFE REFACTOR COMPLETED" -ForegroundColor Green
Write-Host $outputReport
