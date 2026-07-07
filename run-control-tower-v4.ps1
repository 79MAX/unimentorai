# =========================
# CONTROL TOWER V4 - SELF HEALING AI OS
# UniMentorAI Production Core
# =========================

# =========================
# UTF-8 FIX (CRITIQUE)
# =========================
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Clear-Host
Write-Host "🚀 CONTROL TOWER V4 SELF-HEALING AI OS" -ForegroundColor Cyan

# =========================
# INPUT TASK
# =========================
$task = Read-Host "Enter task"

if ([string]::IsNullOrWhiteSpace($task)) {
    Write-Host "❌ Task vide. Abandon." -ForegroundColor Red
    exit
}

# =========================
# MODEL ROUTER (OPTIMISÉ)
# =========================
$model = "llama3.1:8b"

switch -Regex ($task) {
    "refactor|code|architecture|api|backend" { $model = "qwen3-coder:30b" }
    "bug|fix|error|debug|issue"              { $model = "qwen2.5-coder:7b" }
    "security|auth|jwt|vulnerability"        { $model = "deepseek-r1:8b" }
    "ui|ux|flutter|frontend|design"          { $model = "gemma4:latest" }
    default                                  { $model = "llama3.1:8b" }
}

Write-Host "Selected Model: $model" -ForegroundColor Yellow

# =========================
# LOAD SYSTEM MAP (SAFE)
# =========================
$systemMapPath = ".\system-map-v2.json"

if (!(Test-Path $systemMapPath)) {
    Write-Host "⚠ SYSTEM_MAP introuvable" -ForegroundColor Red
    $systemMap = "NOT PRESENT"
} else {
    $systemMap = Get-Content $systemMapPath -Raw -Encoding UTF8
}

# =========================
# PROMPT ENGINE (STABLE)
# =========================
$prompt = @"
YOU ARE CONTROL TOWER V4 - SELF HEALING AI SYSTEM.

RULES:
- No hallucination
- Use ONLY SYSTEM_MAP
- If missing info → return NOT PRESENT
- Be structured, precise, production-grade

SYSTEM_MAP:
$systemMap

TASK:
$task
"@

# =========================
# SAFE TEMP FILE (OLLAMA FIX)
# =========================
$tempFile = ".\v4_prompt.txt"
Set-Content -Path $tempFile -Value $prompt -Encoding UTF8

# =========================
# EXECUTION (STABLE OLLAMA PIPE)
# =========================
Write-Host "Running model..." -ForegroundColor Yellow

try {
    $response = Get-Content $tempFile -Raw -Encoding UTF8 | ollama run $model
}
catch {
    Write-Host "❌ Erreur Ollama: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# =========================
# OUTPUT CLEANER (ANTI UTF BUG)
# =========================
function Clean-OllamaOutput {
    param([string]$text)

    if (-not $text) { return "EMPTY RESPONSE" }

    # suppression caractères cassés Unicode
    $text = $text -replace "[^\u0000-\u007F\u00A0-\u00FF]", ""
    $text = $text -replace "├|┤|┬|┴|┼", ""

    return $text.Trim()
}

$response = Clean-OllamaOutput $response

# =========================
# OUTPUT
# =========================
Write-Host "`n===== AI RESPONSE =====`n" -ForegroundColor Green
Write-Output $response | Out-String