Write-Host "===================================================" -ForegroundColor Cyan
Write-Host " UNI MENTOR AI - AUTO FIX V2 PRO (OPTIMIZED)" -ForegroundColor Cyan
Write-Host "===================================================`n" -ForegroundColor Cyan

# =========================
# 0. ADMIN CHECK
# =========================
$isAdmin = ([Security.Principal.WindowsPrincipal] `
    [Security.Principal.WindowsIdentity]::GetCurrent()
).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ ERREUR : Lance PowerShell en ADMIN" -ForegroundColor Red
    exit 1
}

# =========================
# 1. DETECT NETWORK ADAPTER (AUTO)
# =========================
Write-Host "`n[1] Détection adaptateur réseau" -ForegroundColor Yellow

$adapter = Get-NetAdapter | Where-Object { $_.Status -eq "Up" } | Select-Object -First 1

if ($adapter) {
    Write-Host "✔ Adaptateur actif : $($adapter.Name)" -ForegroundColor Green
} else {
    Write-Host "❌ Aucun adaptateur réseau actif détecté" -ForegroundColor Red
}

# =========================
# 2. DNS FIX SMART (Cloudflare)
# =========================
Write-Host "`n[2] DNS FIX (Cloudflare)" -ForegroundColor Yellow

try {
    Set-DnsClientServerAddress -InterfaceAlias $adapter.Name -ServerAddresses ("1.1.1.1","1.0.0.1")
    Write-Host "✔ DNS configuré sur $($adapter.Name)" -ForegroundColor Green
} catch {
    Write-Host "⚠ Impossible de changer DNS automatiquement" -ForegroundColor DarkYellow
}

ipconfig /flushdns | Out-Null
Write-Host "✔ DNS cache vidé" -ForegroundColor Green

# =========================
# 3. MONGODB SRV TEST (CORRECT)
# =========================
Write-Host "`n[3] Test MongoDB SRV" -ForegroundColor Yellow

$mongoTest = "_mongodb._tcp.cluster0.mongodb.net"

try {
    $dns = Resolve-DnsName $mongoTest -ErrorAction Stop
    Write-Host "✔ MongoDB DNS SRV OK" -ForegroundColor Green
} catch {
    Write-Host "❌ MongoDB DNS SRV FAIL (ISP / DNS BLOCK)" -ForegroundColor Red
}

# =========================
# 4. INTERNET CHECK
# =========================
Write-Host "`n[4] Internet check" -ForegroundColor Yellow

$net = Test-NetConnection google.com -WarningAction SilentlyContinue

if ($net.PingSucceeded) {
    Write-Host "✔ Internet OK" -ForegroundColor Green
} else {
    Write-Host "❌ Problème réseau détecté" -ForegroundColor Red
}

# =========================
# 5. NODE / NPM CHECK
# =========================
Write-Host "`n[5] Node / NPM" -ForegroundColor Yellow

node -v
npm -v

# =========================
# 6. ENV VALIDATION (SMART)
# =========================
Write-Host "`n[6] Analyse .env" -ForegroundColor Yellow

if (Test-Path ".env") {

    $env = Get-Content ".env" -Raw

    $checks = @{
        "DB_URL / MONGO" = $env -match "DB_URL|MONGO"
        "JWT_SECRET"     = $env -match "JWT_SECRET"
    }

    foreach ($c in $checks.Keys) {
        if ($checks[$c]) {
            Write-Host "✔ $c OK" -ForegroundColor Green
        } else {
            Write-Host "❌ $c MANQUANT" -ForegroundColor Red
        }
    }

} else {
    Write-Host "❌ .env introuvable" -ForegroundColor Red
}

# =========================
# 7. PORT SCAN CLEAN
# =========================
Write-Host "`n[7] Ports (3000 / 5000 / 27017)" -ForegroundColor Yellow

$ports = 3000,5000,27017

foreach ($p in $ports) {
    $result = netstat -ano | findstr ":$p"

    if ($result) {
        Write-Host "⚠ Port $p utilisé" -ForegroundColor DarkYellow
    } else {
        Write-Host "✔ Port $p libre" -ForegroundColor Green
    }
}

# =========================
# 8. NODE PROCESS CLEAN (SAFE)
# =========================
Write-Host "`n[8] Nettoyage Node process" -ForegroundColor Yellow

$nodeProc = Get-Process node -ErrorAction SilentlyContinue

if ($nodeProc) {
    $nodeProc | Stop-Process -Force
    Write-Host "✔ Node processes arrêtés" -ForegroundColor Green
} else {
    Write-Host "✔ Aucun process Node actif" -ForegroundColor Green
}

# =========================
# 9. NPM CLEAN CACHE
# =========================
Write-Host "`n[9] NPM cache clean" -ForegroundColor Yellow

npm cache clean --force | Out-Null
Write-Host "✔ Cache npm nettoyé" -ForegroundColor Green

# =========================
# 10. BACKEND CHECK
# =========================
Write-Host "`n[10] Backend check" -ForegroundColor Yellow

if (Test-Path "server.js") {
    Write-Host "✔ Backend détecté (server.js)" -ForegroundColor Green
} else {
    Write-Host "⚠ server.js introuvable" -ForegroundColor DarkYellow
}

# =========================
# FINAL REPORT
# =========================
Write-Host "`n===================================================" -ForegroundColor Cyan
Write-Host " AUTO FIX TERMINÉ (VERSION OPTIMISÉE)" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan