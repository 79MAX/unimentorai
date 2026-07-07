Write-Host "🚀 STARTING UNIMENTORAI FULL SYSTEM..." -ForegroundColor Cyan

# =========================
# 1. KILL ALL NODE PROCESSES
# =========================
Write-Host "🧹 Cleaning Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

Start-Sleep -Seconds 2

# =========================
# 2. FREE PORTS (3001 + 5173)
# =========================
function Free-Port($port) {
    $connection = netstat -ano | findstr ":$port"

    if ($connection) {
        $parts = $connection -split '\s+'
        $pid = $parts[-1]

        if ($pid -match '^\d+$') {
            Write-Host "🔪 Killing process on port $port (PID: $pid)" -ForegroundColor Red
            taskkill /PID $pid /F | Out-Null
        }
    }
}

Free-Port 3001
Free-Port 5173

Start-Sleep -Seconds 2

# =========================
# 3. START BACKEND
# =========================
Write-Host "🚀 Starting BACKEND..." -ForegroundColor Green
Start-Process powershell -ArgumentList "cd backend; node server.bootstrap.js"

Start-Sleep -Seconds 3

# =========================
# 4. START FRONTEND
# =========================
Write-Host "🚀 Starting FRONTEND..." -ForegroundColor Green
Start-Process powershell -ArgumentList "cd frontend; npm run dev"

Start-Sleep -Seconds 3

# =========================
# 5. SUCCESS
# =========================
Write-Host "✅ SYSTEM READY" -ForegroundColor Cyan
Write-Host "👉 Backend: ws://localhost:3001" -ForegroundColor Gray
Write-Host "👉 Frontend: http://localhost:5173" -ForegroundColor Gray