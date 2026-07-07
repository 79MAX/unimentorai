$root = "C:\Users\DJOTOHOU\UNIMENTORAI\unimentorai\backend"
$archive = Join-Path $root "archive-v12"

New-Item -ItemType Directory -Force -Path $archive | Out-Null

Write-Host "🚀 CLEAN V12 STARTING..."

# =========================
# SERVERS TO ARCHIVE
# =========================

$patterns = @(
"server.js",
"control-center.server.js",
"realtime.server.js",
"ai.websocket.gateway.js",
"learning.websocket.server.js"
)

foreach ($pattern in $patterns) {

    Get-ChildItem $root -Recurse -File -Filter $pattern -ErrorAction SilentlyContinue |
    ForEach-Object {

        $dest = Join-Path $archive $_.Name

        Write-Host "📦 ARCHIVING: $($_.FullName)"

        Move-Item $_.FullName $dest -Force
    }
}

# =========================
# MOVE REALTIME DUPLICATES
# =========================

$realtimeDirs = @(
"ai",
"websocket",
"realtime/manager"
)

foreach ($dir in $realtimeDirs) {

    $path = Join-Path $root $dir

    if (Test-Path $path) {
        Move-Item $path (Join-Path $archive $dir) -Force
        Write-Host "📦 ARCHIVED DIR: $dir"
    }
}

# =========================
# VERIFY ENTRY POINT
# =========================

Write-Host "🔍 VERIFYING ENTRY POINT..."

$entry = Join-Path $root "server.bootstrap.js"

if (Test-Path $entry) {
    Write-Host "✅ ENTRY OK: server.bootstrap.js"
} else {
    Write-Host "❌ ERROR: NO ENTRY POINT FOUND"
}

Write-Host ""
Write-Host "================================"
Write-Host "✅ CLEAN V12 COMPLETED"
Write-Host "================================"
