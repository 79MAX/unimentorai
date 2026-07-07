# =========================
# SAFE OLLAMA EXECUTION FIX (PRODUCTION STABLE)
# =========================

Write-Host "⚙ Running Ollama SAFE MODE..." -ForegroundColor Yellow

# TEMP FILES
$tempInput  = Join-Path $PWD "ollama_input.txt"
$tempOutput = Join-Path $PWD "ollama_output.txt"

# WRITE INPUT (UTF8 SAFE)
[System.IO.File]::WriteAllText(
    $tempInput,
    $prompt,
    (New-Object System.Text.UTF8Encoding($false))
)

# =========================
# OLLAMA EXECUTION (FIXED)
# =========================

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "ollama"
$psi.Arguments = "run $model"
$psi.RedirectStandardInput = $true
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.UseShellExecute = $false
$psi.CreateNoWindow = $true

$process = New-Object System.Diagnostics.Process
$process.StartInfo = $psi
$process.Start() | Out-Null

# SEND INPUT
$process.StandardInput.Write($prompt)
$process.StandardInput.Close()

# READ OUTPUT
$responseRaw = $process.StandardOutput.ReadToEnd()
$process.WaitForExit()

# =========================
# CLEANER (SAFE CTO VERSION)
# =========================

$responseClean = [string]$responseRaw

# remove ANSI escape sequences
$responseClean = $responseClean -replace "`e\[[0-9;]*[a-zA-Z]", ""

# remove cursor artifacts
$responseClean = $responseClean -replace "\[\d+D", ""
$responseClean = $responseClean -replace "\[K", ""

# ultra-safe character filter (NO REGEX RANGE BUG)
$responseClean = -join ($responseClean.ToCharArray() | Where-Object {
    $_ -eq "`n" -or $_ -eq "`r" -or $_ -ge ' '
})

# =========================
# OUTPUT
# =========================

Write-Host "`n===== RESPONSE CLEAN =====`n" -ForegroundColor Green
Write-Output $responseClean