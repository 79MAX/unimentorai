# =========================
# CONTROL TOWER AI ORCHESTRATOR
# UniMentorAI - PHASE CORE
# =========================

[Console]::InputEncoding  = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "🚀 CONTROL TOWER AI ORCHESTRATOR START" -ForegroundColor Cyan

# =========================
# INPUT SAFE
# =========================
$task = Read-Host "Enter system task (refactor, security audit, optimize)"

if ([string]::IsNullOrWhiteSpace($task) -or $task -match "Enter task") {
    Write-Host "❌ INVALID TASK INPUT" -ForegroundColor Red
    exit
}

# =========================
# MODEL
# =========================
$model = "llama3.1:8b"

if ($task -match "code|refactor|backend|api") {
    $model = "qwen3-coder:30b"
}
elseif ($task -match "bug|fix|error|debug") {
    $model = "qwen2.5-coder:7b"
}
elseif ($task -match "security|audit") {
    $model = "deepseek-r1:8b"
}

# =========================
# PROMPT
# =========================
$prompt = @"
CONTROL TOWER AI ORCHESTRATOR

TASK:
$task

RULES:
- Clean output only
- No control characters
- Structured response
"@

Write-Host "⚙ Running Ollama..." -ForegroundColor Yellow

# =========================
# FIXED OLLAMA PIPE
# =========================
$response = $prompt | & ollama run $model

# =========================
# CLEAN OUTPUT
# =========================
$responseClean = $response -replace "`e\[[0-9;]*[a-zA-Z]", ""
$responseClean = $responseClean -replace "[^\x20-\x7EÀ-ÿ\n\r\-\:\>\_\/\.\{\}\[\]\(\)]", ""

Write-Host "`n===== RESPONSE =====`n" -ForegroundColor Green
Write-Output $responseClean
