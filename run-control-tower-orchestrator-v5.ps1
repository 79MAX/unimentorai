# =========================
# CONTROL TOWER V5 ORCHESTRATOR
# UniMentorAI - PRODUCTION CORE
# =========================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "🚀 CONTROL TOWER V5 ACTIVE" -ForegroundColor Cyan

$task = Read-Host "Enter task"

$model = "llama3.1:8b"

if ($task -match "refactor|code|architecture") {
    $model = "qwen3-coder:30b"
}
elseif ($task -match "bug|fix|error|debug") {
    $model = "qwen2.5-coder:7b"
}
elseif ($task -match "security|audit") {
    $model = "deepseek-r1:8b"
}
elseif ($task -match "ui|frontend|flutter") {
    $model = "gemma4:latest"
}

Write-Host "Selected Model: $model" -ForegroundColor Yellow

$systemMapPath = ".\system-map-v2.json"
$systemMap = Get-Content $systemMapPath -Raw -ErrorAction SilentlyContinue

$prompt = @"
YOU ARE CONTROL TOWER V5 ORCHESTRATOR.

RULES:
- No hallucination
- Use SYSTEM_MAP only
- Detect duplication, security flaws, architecture issues
- Output structured JSON only

SYSTEM_MAP:
$systemMap

TASK:
$task
"@

$tempFile = ".\v5_prompt.txt"
Set-Content -Path $tempFile -Value $prompt -Encoding UTF8

Write-Host "Running Ollama..." -ForegroundColor Yellow

$response = cmd /c "ollama run $model < `"$tempFile`""

Write-Host "`n===== AI RESPONSE =====`n" -ForegroundColor Green
Write-Host $response
