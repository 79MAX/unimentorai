# =========================
# CONTROL TOWER V6 SWARM OS - PRODUCTION CLEAN
# UniMentorAI
# =========================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Clear-Host
Write-Host "🚀 CONTROL TOWER V6 SWARM OS START" -ForegroundColor Cyan

# =========================
# INPUT
# =========================
Write-Host "Paste task then ENTER:" -ForegroundColor DarkCyan
$task = [Console]::ReadLine()

if ([string]::IsNullOrWhiteSpace($task)) {
    Write-Host "❌ Task vide" -ForegroundColor Red
    exit
}

# =========================
# SYSTEM MAP
# =========================
$systemMapPath = ".\system-map-v2.json"

$systemMap = if (Test-Path $systemMapPath) {
    Get-Content $systemMapPath -Raw -Encoding UTF8
} else {
    "SYSTEM_MAP_NOT_FOUND"
}

# =========================
# SWARM MODEL ROUTING
# =========================

$plannerModel = "deepseek-r1:8b"
$coderModel   = "qwen3-coder:30b"
$reviewModel  = "qwen2.5-coder:7b"

Write-Host "🧠 SWARM MODE ACTIVE" -ForegroundColor Yellow

# =========================
# STAGE 1 - PLANNER AGENT
# =========================

$plannerPrompt = @"
You are the PLANNER AGENT.

RULES:
- No hallucination
- Use SYSTEM_MAP only

SYSTEM_MAP:
$systemMap

TASK:
$task

Output:
- architecture plan
- steps list
- risks
"@

$temp1 = ".\swarm_planner.txt"
Set-Content $temp1 $plannerPrompt -Encoding UTF8

$plan = cmd /c "ollama run $plannerModel < `"$temp1`""

# =========================
# STAGE 2 - CODER AGENT
# =========================

$coderPrompt = @"
You are the CODER AGENT.

RULES:
- Follow planner strictly
- No hallucination

PLAN:
$plan

TASK:
$task
"@

$temp2 = ".\swarm_coder.txt"
Set-Content $temp2 $coderPrompt -Encoding UTF8

$code = cmd /c "ollama run $coderModel < `"$temp2`""

# =========================
# STAGE 3 - REVIEW AGENT
# =========================

$reviewPrompt = @"
You are the REVIEWER AGENT.

RULES:
- Check bugs
- Check security
- Check architecture

CODE:
$code

ORIGINAL TASK:
$task
"@

$temp3 = ".\swarm_review.txt"
Set-Content $temp3 $reviewPrompt -Encoding UTF8

$review = cmd /c "ollama run $reviewModel < `"$temp3`""

# =========================
# FINAL OUTPUT
# =========================

Write-Host "`n===== PLANNING =====`n" -ForegroundColor Cyan
Write-Output $plan

Write-Host "`n===== CODE =====`n" -ForegroundColor Green
Write-Output $code

Write-Host "`n===== REVIEW =====`n" -ForegroundColor Yellow
Write-Output $review

# =========================
# CLEANUP
# =========================
Remove-Item $temp1,$temp2,$temp3 -Force -ErrorAction SilentlyContinue

Write-Host "`n🚀 SWARM COMPLETED" -ForegroundColor Cyan
