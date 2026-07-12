Write-Host "`n===================================" -ForegroundColor Cyan
Write-Host " WS DIAGNOSTIC TOOL (V15 CLEAN)" -ForegroundColor Cyan
Write-Host "===================================`n" -ForegroundColor Cyan

$PORT = 3001

Write-Host "[1] Checking port usage..." -ForegroundColor Yellow
$portCheck = netstat -ano | findstr ":$PORT"

if ($portCheck) {
    Write-Host "Port $PORT is ACTIVE:" -ForegroundColor Green
    $portCheck
} else {
    Write-Host "Port $PORT is NOT USED ❌" -ForegroundColor Red
}

Write-Host "`n[2] Checking Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Select-Object Id, CPU, WS

Write-Host "`n[3] Testing TCP connection..." -ForegroundColor Yellow
try {
    $tcp = Test-NetConnection -ComputerName "127.0.0.1" -Port $PORT
    $tcp | Select-Object TcpTestSucceeded, RemoteAddress, RemotePort
}
catch {
    Write-Host "TCP test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n[4] WebSocket server quick check..." -ForegroundColor Yellow
try {
    $request = [System.Net.HttpWebRequest]::Create("http://127.0.0.1:$PORT")
    $request.Method = "GET"
    $response = $request.GetResponse()
    Write-Host "Server reachable (HTTP response OK)" -ForegroundColor Green
    $response.Close()
}
catch {
    Write-Host "Server not responding via HTTP (OK for pure WS OR server down)" -ForegroundColor DarkYellow
}

Write-Host "`nDONE." -ForegroundColor Cyan
