Write-Host "========================================" -ForegroundColor Cyan
Write-Host " UNI MENTOR AI - AUDIT MONGODB / DNS " -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Fonction log propre
function Log($msg, $color="White") {
    Write-Host $msg -ForegroundColor $color
}

# 1. NODE
Log "[1] Node.js version check..." Yellow
try {
    $nodeVersion = node -v
    Log "Node: $nodeVersion" Green
} catch {
    Log "Node not found ❌" Red
}

# 2. NPM
Log "`n[2] npm version check..." Yellow
try {
    $npmVersion = npm -v
    Log "npm: $npmVersion" Green
} catch {
    Log "npm not found ❌" Red
}

# 3. DNS SRV MongoDB Atlas (IMPORTANT)
Log "`n[3] MongoDB SRV DNS resolution..." Yellow

$mongoSrv = "_mongodb._tcp.cluster0.mongodb.net"

try {
    $dns = Resolve-DnsName $mongoSrv -ErrorAction Stop
    Log "DNS OK ✔" Green
    $dns | ForEach-Object { Log $_.IPAddress Cyan }
} catch {
    Log "DNS FAILED ❌ (SRV record not resolving)" Red
    Log "Possible fix: change DNS to 8.8.8.8 or 1.1.1.1" Yellow
}

# 4. INTERNET CONNECTIVITY
Log "`n[4] Internet connectivity check..." Yellow
$internet = Test-NetConnection google.com -InformationLevel Quiet

if ($internet) {
    Log "Internet OK ✔" Green
} else {
    Log "Internet FAILED ❌" Red
}

# 5. MONGODB ATLAS PORT TEST (27017 + SRV fallback)
Log "`n[5] MongoDB port connectivity test..." Yellow

try {
    Test-NetConnection cluster0.mongodb.net -Port 27017
} catch {
    Log "MongoDB port test failed (normal if SRV blocked)" Yellow
}

# 6. ENV CHECK
Log "`n[6] Environment variables (.env) check..." Yellow

if (Test-Path ".env") {
    $envContent = Get-Content ".env"

    $keys = $envContent | Select-String "DB_URL|MONGO|JWT"

    if ($keys) {
        Log "Critical env keys found ✔" Green
        $keys
    } else {
        Log "Warning: DB_URL / MONGO / JWT missing ⚠" Yellow
    }
} else {
    Log ".env file missing ❌" Red
}

# 7. PORT CHECK
Log "`n[7] Local ports check..." Yellow

$ports = @(3000, 5000, 27017)

foreach ($p in $ports) {
    $result = netstat -ano | Select-String ":$p"

    if ($result) {
        Log "Port $p in use ✔" Green
    } else {
        Log "Port $p free" Gray
    }
}

# 8. DNS FLUSH (FIX ACTION)
Log "`n[8] DNS flush (fix step)..." Yellow
ipconfig /flushdns | Out-Null
Log "DNS cache cleared ✔" Green

# 9. FINAL SUMMARY
Log "`n========================================" Cyan
Log " AUDIT COMPLETE " Cyan
Log "========================================" Cyan

Log "`nIf MongoDB still fails:" Yellow
Log "- Change DNS: 8.8.8.8 / 1.1.1.1" Yellow
Log "- Check MongoDB Atlas IP whitelist" Yellow
Log "- Ensure SRV connection string is correct" Yellow