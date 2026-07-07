# =========================
# CONTROL TOWER V5.2 STABLE CORE
# UniMentorAI - CLEAN EXECUTION ENGINE
# =========================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "🚀 CONTROL TOWER V5.2 INITIALIZING..." -ForegroundColor Cyan

$task = Read-Host "Enter task"

if ([string]::IsNullOrWhiteSpace($task)) {
    Write-Host "❌ Task vide" -ForegroundColor Red
    exit
}

# =========================
# SYSTEM MAP LOAD SAFE
# =========================
$systemMapPath = ".\system-map-v2.json"

if (Test-Path $systemMapPath) {
    $systemMap = Get-Content $systemMapPath -Raw -Encoding UTF8
} else {
    Write-Host "⚠ SYSTEM_MAP NOT FOUND" -ForegroundColor Yellow
    $systemMap = ""
}

# =========================
# MODEL ROUTER
# =========================
$model = "llama3.1:8b"

if ($task -match "code|refactor|backend|api") {
    $model = "qwen3-coder:30b"
}
elseif ($task -match "bug|fix|error") {
    $model = "qwen2.5-coder:7b"
}
elseif ($task -match "security|audit") {
    $model = "deepseek-r1:8b"
}

Write-Host "🧠 Model selected: $model" -ForegroundColor Yellow

# =========================
# PROMPT ENGINE
# =========================
$prompt = @"
CONTROL TOWER V5.2 MODE

RULES:
- No hallucination
- Use ONLY SYSTEM_MAP
- If missing info → NOT PRESENT
- Be structured and precise

SYSTEM_MAP:
$systemMap

TASK:
$task
"@

# =========================
# SAFE EXECUTION (FIXED)
# =========================
$tempFile = ".\v5_prompt_safe.txt"
Set-Content -Path $tempFile -Value $prompt -Encoding UTF8

$response = cmd /c "ollama run $model < `"$tempFile`""

# =========================
# OUTPUT
# =========================
Write-Host "`n===== RESPONSE =====`n" -ForegroundColor Green
Write-Output $response