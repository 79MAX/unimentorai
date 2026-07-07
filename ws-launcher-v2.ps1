Write-Host "WS LAUNCHER V2 ENTERPRISE" -ForegroundColor Cyan

$PORTS = @(3001, 3002, 3003)
$SERVER_PATH = "backend\ws\server.cluster.js"

function Get-PortProcess($port) {
    $lines = netstat -ano | findstr ":$port"

    foreach ($line in $lines) {
        if ($line -match "\s+(\d+)$") {
            return $matches[1]
        }
    }
    return $null
}

function Kill-ProcessById($processId) {
    if ($processId) {
        Write-Host "Killing process $processId" -ForegroundColor Red
        taskkill /PID $processId /F | Out-Null
        Start-Sleep -Seconds 1
    }
}

Write-Host "Checking ports..." -ForegroundColor Yellow

foreach ($port in $PORTS) {

    $processId = Get-PortProcess $port
    Kill-ProcessById $processId
}

Start-Sleep -Seconds 2

Write-Host "Starting WS server..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList "node $SERVER_PATH"

Start-Sleep -Seconds 2

$activePort = $null

foreach ($port in $PORTS) {
    $check = netstat -ano | findstr ":$port"
    if ($check) {
        $activePort = $port
        break
    }
}

if ($activePort) {
    Write-Host "WS RUNNING ON ws://localhost:$activePort" -ForegroundColor Green
} else {
    Write-Host "WS FAILED TO START" -ForegroundColor Red
}

Write-Host "DONE" -ForegroundColor Cyan
