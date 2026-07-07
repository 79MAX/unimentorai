Write-Host "🚀 UNI MENTOR AI V12 PRODUCTION DEPLOY STARTING..." -ForegroundColor Cyan

$backendPath = "C:\Users\DJOTOHOU\UNIMENTORAI\unimentorai\backend"
$frontendPath = "C:\Users\DJOTOHOU\UNIMENTORAI\unimentorai\frontend"

# =========================
# CLEAN NODE
# =========================
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 2

# =========================
# FUNCTIONS SAFE BLOCK
# =========================
function Start-Backend {
    Write-Host "🔥 Starting Backend..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "cd $backendPath; node server.js"
}

function Start-Frontend {
    Write-Host "🌐 Starting Frontend..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "cd $frontendPath; npm run dev"
}

function Check-Backend {
    try {
        Invoke-WebRequest "http://127.0.0.1:3001/api/health" -TimeoutSec 2 -ErrorAction Stop | Out-Null
        Write-Host "🟢 Backend OK - $(Get-Date)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "🔴 Backend DOWN" -ForegroundColor Red
        return $false
    }
}

# =========================
# START SERVICES
# =========================
Start-Backend
Start-Sleep -Seconds 3
Start-Frontend

# =========================
# MONITOR LOOP SAFE (NO SYNTAX BREAK)
# =========================
for ($i = 0; $i -lt 999999; $i++) {

    $ok = Check-Backend

    if (-not $ok) {
        Write-Host "♻ Restarting backend..." -ForegroundColor Red
        Start-Backend
    }

    Start-Sleep -Seconds 5
}
