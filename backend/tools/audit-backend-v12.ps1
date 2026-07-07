$ErrorActionPreference = "Continue"

$Root = Split-Path $PSScriptRoot -Parent
$ReportDir = Join-Path $Root "audit-report"

New-Item -ItemType Directory -Force -Path $ReportDir | Out-Null

Write-Host ""
Write-Host "======================================="
Write-Host " UniMentorAI Backend Audit V12"
Write-Host "======================================="
Write-Host ""

$files = Get-ChildItem $Root -Recurse -File -Include *.js |
Where-Object {
    $_.FullName -notmatch "\\node_modules\\" -and
    $_.FullName -notmatch "\\archive"
}

$result = foreach($f in $files){

    $content = Get-Content $f.FullName -Raw

    [PSCustomObject]@{

        File = $f.FullName.Replace($Root,"")

        ServerListen = ($content -match "server\.listen")

        Express = ($content -match "express\s*\(")

        HttpServer = ($content -match "createServer\s*\(")

        WsServer = (
            $content -match "WebSocket\.Server" -or
            $content -match "new WebSocketServer" -or
            $content -match "createWS\s*\("
        )

        Bootstrap = ($content -match "createHttpServer")

        RequireEnv = ($content -match "env\.intelligent")

        Main = ($content -match "module\.exports")
    }
}

$result |
Export-Csv "$ReportDir\backend-audit.csv" -NoTypeInformation -Encoding UTF8

$servers = $result | Where-Object {
    $_.ServerListen -or
    $_.WsServer -or
    $_.Bootstrap
}

$servers | Format-Table
$servers | Out-File "$ReportDir\servers.txt"

Write-Host ""
Write-Host "========= SERVER FILES ========="

Get-ChildItem $Root -Recurse -File |
Where-Object { $_.Name -match "server" } |
Select FullName |
Out-File "$ReportDir\all-server-files.txt"

Get-ChildItem $Root -Recurse -File |
Where-Object { $_.Name -match "server" } |
Select FullName

Write-Host ""
Write-Host "========= FILES USING listen() ========="

Get-ChildItem $Root -Recurse -File -Include *.js |
Where-Object { $_.FullName -notmatch "\\node_modules\\" } |
ForEach-Object{
    $txt = Get-Content $_.FullName -Raw
    if($txt -match "listen\s*\("){
        Write-Host $_.FullName
    }
}

Write-Host ""
Write-Host "======================================="
Write-Host "Audit terminé"
Write-Host "Rapport : $ReportDir"
Write-Host "======================================="
