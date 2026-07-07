Write-Host "🚀 UNI MENTOR AI V11 AUTO-DEPLOY STARTING..." -ForegroundColor Cyan

# =========================
# KILL NODE
# =========================
taskkill /F /IM node.exe 2>$null

Start-Sleep -Seconds 2

# =========================
# BACKEND
# =========================
Write-Host "STARTING BACKEND..." -ForegroundColor Green
Start-Process powershell -ArgumentList "cd backend; node server.js"

Start-Sleep -Seconds 3

# =========================
# FRONTEND
# =========================
Write-Host "STARTING FRONTEND..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "cd frontend; npm run dev"

Start-Sleep -Seconds 2

# =========================
# STATUS
# =========================
Write-Host ""
Write-Host "SYSTEM V11 DEPLOYED SUCCESSFULLY" -ForegroundColor Green
Write-Host "Backend: http://127.0.0.1:3001"
Write-Host "Frontend: http://localhost:5173"
Write-Host "WebSocket: ws://127.0.0.1:3001"