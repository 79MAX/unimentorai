Write-Host "🔍 Checking critical entry files..." -ForegroundColor Cyan

if (!(Test-Path "frontend/index.html")) {
    Write-Host "❌ Missing frontend/index.html" -ForegroundColor Red
}

if (!(Test-Path "frontend/src/main.jsx") -and !(Test-Path "frontend/src/main.tsx")) {
    Write-Host "❌ Missing React entry (main.jsx or main.tsx)" -ForegroundColor Red
}

Write-Host "🧠 Frontend structure check complete" -ForegroundColor Green