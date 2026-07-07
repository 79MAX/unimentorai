Write-Host "🚀 CONTROL TOWER V2 STARTED" -ForegroundColor Cyan

$inputTask = Read-Host "Enter task"

$model = "llama3.1:8b"

if ($inputTask -match "code|refactor|api") {
    $model = "qwen3-coder:30b"
}
elseif ($inputTask -match "bug|error|fix") {
    $model = "qwen2.5-coder:7b"
}
elseif ($inputTask -match "analysis|architecture|security") {
    $model = "deepseek-r1:8b"
}

Write-Host "Selected Model: $model" -ForegroundColor Yellow

$systemMap = Get-Content ".\system-map-v2.json" -Raw -ErrorAction SilentlyContinue

$prompt = @"
SYSTEM RULES:
- DO NOT hallucinate
- ONLY use SYSTEM_MAP
- If missing → NOT PRESENT

SYSTEM_MAP:
$systemMap

TASK:
$inputTask
"@

$tempFile = ".\ctv2_prompt.txt"
Set-Content -Path $tempFile -Value $prompt -Encoding UTF8

Write-Host "Running Ollama..." -ForegroundColor Green

# SAFE EXECUTION (important fix)
$response = cmd /c "ollama run $model < $tempFile"

Write-Host "`n===== RESPONSE =====`n" -ForegroundColor Green
Write-Host $response