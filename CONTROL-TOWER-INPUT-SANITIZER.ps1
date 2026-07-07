# =========================
# CONTROL TOWER INPUT SANITIZER V3
# UniMentorAI - Production Hardened Layer
# =========================

[Console]::InputEncoding  = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "🧠 INPUT SANITIZER ACTIVE (V3)" -ForegroundColor Cyan

# =========================
# CONFIG
# =========================
$logDir = ".\logs"
$logFile = Join-Path $logDir "sanitizer.log"

# =========================
# INPUT
# =========================
$task = Read-Host "Enter system task"

# =========================
# VALIDATION STRICT
# =========================
if ([string]::IsNullOrWhiteSpace($task)) {
    Write-Host "❌ EMPTY TASK BLOCKED" -ForegroundColor Red
    exit 1
}

# anti prompt injection / fake re-entry
$blockedPatterns = @(
    "Enter task",
    "Enter system task",
    "ignore previous",
    "system prompt",
    "developer mode"
)

foreach ($pattern in $blockedPatterns) {
    if ($task -match [regex]::Escape($pattern)) {
        Write-Host "❌ BLOCKED INPUT (SECURITY RULE)" -ForegroundColor Red
        exit 1
    }
}

# =========================
# SANITIZATION ENGINE (HARDENED)
# =========================

function Clean-Text {
    param([string]$text)

    # remove ANSI escape codes
    $text = $text -replace "`e\[[0-9;]*[a-zA-Z]", ""

    # remove cursor artifacts
    $text = $text -replace "\[\d+D", ""
    $text = $text -replace "\[K", ""

    # remove control chars (safe UTF-8 only)
    $text = $text -replace "[^\x20-\x7EÀ-ÿ\n\r]", ""

    # normalize spaces
    $text = $text -replace "\s+", " "

    return $text.Trim()
}

$task = Clean-Text $task

# =========================
# LOGGING SAFE
# =========================
if (!(Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $logFile -Value "$timestamp | $task" -Encoding UTF8

# =========================
# OUTPUT PIPELINE READY
# =========================

Write-Host "✅ TASK SANITIZED & PIPELINE READY" -ForegroundColor Green

# IMPORTANT: output for orchestrator
return $task