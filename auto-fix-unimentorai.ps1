Write-Host "===================================================" -ForegroundColor Cyan
Write-Host " UNI MENTOR AI - AUTO FIX FULL SYSTEM " -ForegroundColor Cyan
Write-Host "===================================================`n" -ForegroundColor Cyan

function Log($msg, $color="White") {
    Write-Host $msg -ForegroundColor $color
}

# ADMIN CHECK
$isAdmin = ([Security.Principal.WindowsPrincipal] `
    [Security.Principal.WindowsIdentity]::GetCurrent()
).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ Lance PowerShell en ADMIN" -ForegroundColor Red
    exit 1
}

# DNS FIX
Write-Host "`n[DNS FIX]" -ForegroundColor Yellow
ipconfig /flushdns | Out-Null

try {
    Resolve-DnsName "_mongodb._tcp.cluster0.mongodb.net" -ErrorAction Stop
    Write-Host "✔ MongoDB DNS OK" -ForegroundColor Green
} catch {
    Write-Host "❌ DNS MongoDB FAIL (probable ISP DNS)" -ForegroundColor Red
}

# NODE CHECK
Write-Host "`n[Node check]" -ForegroundColor Yellow
node -v
npm -v

# ENV CHECK
Write-Host "`n[ENV check]" -ForegroundColor Yellow
if (Test-Path ".env") {
    Get-Content ".env" | Select-String "DB_URL|MONGO|JWT"
} else {
    Write-Host ".env introuvable" -ForegroundColor Red
}

# PORT CLEAN
Write-Host "`n[PORT cleanup]" -ForegroundColor Yellow
netstat -ano | findstr :3000
netstat -ano | findstr :27017

Write-Host "`n✔ AUTO FIX DONE" -ForegroundColor Green
