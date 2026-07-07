$filePath = ".\run-control-tower-orchestrator-v5.ps1"

if (Test-Path $filePath) {
    Write-Host "Fichier déjà existant" -ForegroundColor Yellow
    exit
}

Write-Host "Création Control Tower V5..." -ForegroundColor Cyan

$code = @"
# CONTROL TOWER V5 ORCHESTRATOR

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "CONTROL TOWER V5 ACTIVE"

$task = Read-Host "Enter task"

$model = "llama3.1:8b"

if ($task -match "refactor|code|architecture") {
    $model = "qwen3-coder:30b"
}
elseif ($task -match "bug|fix|error") {
    $model = "qwen2.5-coder:7b"
}
elseif ($task -match "security") {
    $model = "deepseek-r1:8b"
}

$systemMap = Get-Content ".\system-map-v2.json" -Raw -ErrorAction SilentlyContinue

$prompt = "SYSTEM: No hallucination`nTASK:`n$task"

$temp = ".\v5_prompt.txt"
Set-Content $temp $prompt -Encoding UTF8

$response = cmd /c "ollama run $model < `"$temp`""

Write-Host $response
"@

Set-Content -Path $filePath -Value $code -Encoding UTF8

Write-Host "OK V5 CREATED"
