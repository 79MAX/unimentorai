# =========================
# UNI MENTOR AI - SYSTEM REPAIR ENGINE (SAFE MODE)
# =========================

$root = "."
$report = @()

Write-Host "🔍 SCANNING SYSTEM..." -ForegroundColor Cyan

# 1. FILE SCAN
$files = Get-ChildItem $root -Recurse -File

$report += "TOTAL FILES: $($files.Count)"

# 2. DETECT DUPLICATES
$duplicates = $files | Group-Object Name | Where-Object { $_.Count -gt 1 }

$report += "`nDUPLICATES:"
foreach ($d in $duplicates) {
    $report += "$($d.Name) -> $($d.Count) copies"
}

# 3. DETECT EMPTY FILES
$empty = $files | Where-Object { $_.Length -eq 0 }
$report += "`nEMPTY FILES: $($empty.Count)"

# 4. SAVE REPORT
$report | Out-File ".\system-health-report.txt"

Write-Host "✅ SYSTEM SCAN COMPLETE" -ForegroundColor Green
Write-Host "Report: system-health-report.txt"

# =========================
# AI REPAIR PROMPT (SAFE)
# =========================

$systemMap = Get-Content ".\system-map-v2.json" -Raw

$prompt = @"
You are a Senior Silicon Valley CTO AI System Engineer.

TASK:
- Detect missing modules
- Detect broken architecture
- Propose fixes ONLY (NO DIRECT MODIFICATION)
- Ensure scalability and security
- Ensure production-grade architecture

RULES:
- NEVER overwrite existing files
- NEVER delete anything
- ALWAYS generate SAFE FIX PROPOSALS

SYSTEM MAP:
$systemMap
"@

$body = @{
    model = "qwen3-coder:30b"
    prompt = $prompt
    stream = $false
} | ConvertTo-Json -Depth 20

Write-Host "🚀 RUNNING AI REPAIR ENGINE..." -ForegroundColor Cyan

$response = Invoke-RestMethod `
    -Uri "http://localhost:11434/api/generate" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"

$response.response | Out-File ".\ai-repair-report.txt"

Write-Host "✅ AI REPAIR COMPLETE" -ForegroundColor Green
Write-Host "Output: ai-repair-report.txt"
