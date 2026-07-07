Write-Host "🚀 CONTROL TOWER V3 AUTONOMOUS AI OS" -ForegroundColor Cyan

$task = Read-Host "Enter task"

$model = "llama3.1:8b"

if ($task -match "refactor|code") {
    $model = "qwen3-coder:30b"
}
elseif ($task -match "bug|fix|error") {
    $model = "qwen2.5-coder:7b"
}
elseif ($task -match "security") {
    $model = "deepseek-r1:8b"
}

$systemMap = Get-Content ".\system-map-v2.json" -Raw

$prompt = @"
SYSTEM RULES:
- NO HALLUCINATION
- USE ONLY SYSTEM_MAP
- IF UNKNOWN → NOT PRESENT

SYSTEM MAP:
$systemMap

TASK:
$task
"@

Set-Content ".\v3_prompt.txt" $prompt -Encoding UTF8

Write-Host "Running Ollama model: $model" -ForegroundColor Yellow

$response = cmd /c "ollama run $model < v3_prompt.txt"

Write-Host "`n===== AI RESPONSE =====`n" -ForegroundColor Green
Write-Host $response