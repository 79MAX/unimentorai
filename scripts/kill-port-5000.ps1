param(
    [int]$port = 5000
)

Write-Host "Checking port $port..."

$connections = netstat -ano | Select-String ":$port"

if (-not $connections) {
    Write-Host "Port already free"
    exit 0
}

$processIds = $connections | ForEach-Object {
    ($_ -split '\s+')[-1]
} | Where-Object { $_ -match '^\d+$' } | Select-Object -Unique

foreach ($processId in $processIds) {
    try {
        Write-Host "Killing PID: $processId"
        Stop-Process -Id $processId -Force -ErrorAction Stop
    }
    catch {
        Write-Host "Failed to kill PID $processId"
    }
}

Write-Host "Port cleared"