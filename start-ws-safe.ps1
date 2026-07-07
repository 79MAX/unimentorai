Write-Host "WS ULTRA SAFE STARTER"

$PORT = 3001

Write-Host "Checking port..."

$connections = netstat -ano | findstr ":$PORT"

$targetPid = $null

foreach ($line in $connections) {
    if ($line -match "\s+(\d+)$") {
        $targetPid = $matches[1]
    }
}

if ($targetPid) {
    Write-Host "Killing PID $targetPid"
    taskkill /PID $targetPid /F | Out-Null
    Start-Sleep -Seconds 2
} else {
    Write-Host "Port free"
}

Write-Host "Starting WS server..."

Start-Process powershell -ArgumentList "node backend\ws\server.cluster.js"

Start-Sleep -Seconds 2

$check = netstat -ano | findstr ":$PORT"

if ($check) {
    Write-Host "WS RUNNING ON $PORT"
    Write-Host "ws://localhost:$PORT"
} else {
    Write-Host "WS FAILED"
}

Write-Host "DONE"
