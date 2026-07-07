Write-Host "===================================" -ForegroundColor Cyan
Write-Host "🚀 CONTROL CENTER LAUNCHER V1" -ForegroundColor Cyan
Write-Host "==================================="

# Stop Node processes
Write-Host "🛑 Stopping Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

Start-Sleep -Seconds 2

# Start backend
Write-Host "🚀 Starting Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "cd backend; node server.js"

Start-Sleep -Seconds 3

# Start frontend
Write-Host "🚀 Starting Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "cd frontend; npm run dev"

Start-Sleep -Seconds 3

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "✅ CONTROL CENTER RUNNING" -ForegroundColor Green
Write-Host "Frontend : http://localhost:5173+" -ForegroundColor White
Write-Host "Backend  : http://localhost:3001" -ForegroundColor White
Write-Host "===================================" -ForegroundColor Cyan
