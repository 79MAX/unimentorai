Write-Host "WS SAFE STARTER" -ForegroundColor Cyan

$PORT = 3001

Write-Host "Checking port $PORT..." -ForegroundColor Yellow

$lines = netstat -ano | findstr ":$PORT"
$pidToKill = $null

foreach ($line in $lines) {
    if ($line -match "\s+(\d+)$") {
        $pidToKill = $matches[1]
    }
}

if ($pidToKill) {
    Write-Host "Killing PID $pidToKill" -ForegroundColor Red
    taskkill /PID $pidToKill /F | Out-Null
    Start-Sleep -Seconds 2
} else {
    Write-Host "Port free" -ForegroundColor Green
}

Write-Host "Starting WS server..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList "node backend\ws\server.cluster.js"

Start-Sleep -Seconds 2

$check = netstat -ano | findstr ":$PORT"

if ($check) {
    Write-Host "WS RUNNING ON ws://localhost:$PORT" -ForegroundColor Green
} else {
    Write-Host "WS FAILED" -ForegroundColor Red
}

Write-Host "DONE" -ForegroundColor Cyan
