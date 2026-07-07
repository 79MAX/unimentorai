# =========================
# CONTROL TOWER AI ROUTER V1
# =========================

$inputTask = Read-Host "Enter task"

Write-Host "🚀 AI ROUTER V1 ACTIVE" -ForegroundColor Cyan
Write-Host "Task received: $inputTask"

# =========================
# TASK CLASSIFICATION
# =========================

$model = ""

if ($inputTask -match "architecture|design system|refactor global|system") {
    $model = "llama3.1:8b"
}
elseif ($inputTask -match "bug|fix|patch|error|debug") {
    $model = "qwen2.5-coder:7b"
}
elseif ($inputTask -match "code|refactor|optimize|backend|api|firebase") {
    $model = "qwen3-coder:30b"
}
elseif ($inputTask -match "reason|analyze|decision|plan") {
    $model = "deepseek-r1:8b"
}
elseif ($inputTask -match "ui|ux|design|dashboard|frontend|flutter") {
    $model = "gemma4:latest"
}
else {
    $model = "llama3.1:8b"
}

Write-Host "========================="
Write-Host "SELECTED MODEL: $model"
Write-Host "========================="

# =========================
# OLLAMA CALL
# =========================

$response = ollama run $model "$inputTask"

Write-Host ""
Write-Host "===== AI RESPONSE ====="
Write-Host $response
