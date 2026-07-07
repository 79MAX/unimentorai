[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()

$ErrorActionPreference = "SilentlyContinue"

Write-Host "`nSECURITY SCAN START - UniMentorAI" -ForegroundColor Cyan
Write-Host "====================================="

$root = Get-Location

# =========================
# 1. SENSITIVE FILES
# =========================
Write-Host "`n[1] Checking sensitive files..." -ForegroundColor Yellow

$sensitivePatterns = "\.env|secret|config|key|token|credential"

$sensitiveFiles = Get-ChildItem -Recurse -File -ErrorAction SilentlyContinue | Where-Object {
    $_.Name -match $sensitivePatterns
}

if ($sensitiveFiles.Count -gt 0) {
    Write-Host "WARNING: Sensitive files found:" -ForegroundColor Red
    foreach ($file in $sensitiveFiles) {
        Write-Host (" -> " + $file.FullName)
    }
} else {
    Write-Host "OK: No obvious sensitive files detected" -ForegroundColor Green
}

# =========================
# 2. EXPOSED SECRETS
# =========================
Write-Host "`n[2] Scanning for exposed secrets..." -ForegroundColor Yellow

$patterns = @(
    "API_KEY",
    "SECRET",
    "PASSWORD",
    "TOKEN",
    "PRIVATE_KEY",
    "mongodb://",
    "postgres://",
    "BEGIN RSA",
    "sk_live",
    "AKIA"
)

foreach ($pattern in $patterns) {

    $results = Get-ChildItem -Recurse -File -Include *.js,*.ts,*.json,*.env -ErrorAction SilentlyContinue |
        Select-String -Pattern $pattern -SimpleMatch -ErrorAction SilentlyContinue

    if ($results) {
        Write-Host ("WARNING Pattern detected: " + $pattern) -ForegroundColor Red

        foreach ($r in $results) {
            Write-Host (" -> " + $r.Path + ":" + $r.LineNumber)
        }
    }
}

# =========================
# 3. NODE MODULES
# =========================
Write-Host "`n[3] Node modules check..." -ForegroundColor Yellow

if (Test-Path ".\node_modules") {
    Write-Host "WARNING: node_modules exists (run npm audit recommended)" -ForegroundColor DarkYellow
} else {
    Write-Host "OK: No node_modules found" -ForegroundColor Green
}

# =========================
# 4. SOCKET / REALTIME
# =========================
Write-Host "`n[4] Socket usage check..." -ForegroundColor Yellow

$socketPattern = "io\(|new WebSocket|socket\.io"

$socketIssues = Get-ChildItem -Recurse -File -Include *.js,*.ts -ErrorAction SilentlyContinue |
    Select-String -Pattern $socketPattern -ErrorAction SilentlyContinue

if ($socketIssues.Count -gt 0) {
    Write-Host "WARNING: Socket usage found:" -ForegroundColor Red
    foreach ($s in $socketIssues) {
        Write-Host (" -> " + $s.Path + ":" + $s.LineNumber)
    }
} else {
    Write-Host "OK: No socket usage detected" -ForegroundColor Green
}

# =========================
# 5. EXPRESS SECURITY
# =========================
Write-Host "`n[5] Express security review..." -ForegroundColor Yellow

$expressPattern = "app\.use\(|cors\(|helmet\(|res\.header\("

$expressIssues = Get-ChildItem -Recurse -File -Include *.js -ErrorAction SilentlyContinue |
    Select-String -Pattern $expressPattern -ErrorAction SilentlyContinue

if ($expressIssues) {
    Write-Host "INFO: Express middleware found (manual review recommended)" -ForegroundColor DarkYellow
    foreach ($e in $expressIssues) {
        Write-Host (" -> " + $e.Path + ":" + $e.LineNumber)
    }
}

# =========================
# 6. HARD CODED PORTS
# =========================
Write-Host "`n[6] Hardcoded ports..." -ForegroundColor Yellow

$portPattern = "3000|3001|5000|8080"

$ports = Get-ChildItem -Recurse -File -Include *.js -ErrorAction SilentlyContinue |
    Select-String -Pattern $portPattern -ErrorAction SilentlyContinue

if ($ports) {
    Write-Host "WARNING: Hardcoded ports detected:" -ForegroundColor Red
    foreach ($p in $ports) {
        Write-Host (" -> " + $p.Path + ":" + $p.LineNumber)
    }
}

# =========================
# 7. ENTRY POINTS
# =========================
Write-Host "`n[7] Server entry points..." -ForegroundColor Yellow

$servers = Get-ChildItem -Recurse -File -Include server.js,index.js,app.js,main.js -ErrorAction SilentlyContinue

if ($servers.Count -gt 1) {
    Write-Host "WARNING: Multiple entry points detected:" -ForegroundColor Red
    foreach ($s in $servers) {
        Write-Host $s.FullName
    }
} else {
    Write-Host "OK: Single entry point detected" -ForegroundColor Green
}

Write-Host "`nSECURITY SCAN COMPLETE" -ForegroundColor Cyan
Write-Host "Review warnings before production deployment" -ForegroundColor Yellow