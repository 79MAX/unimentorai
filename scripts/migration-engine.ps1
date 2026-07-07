Write-Host "🚀 UNI MENTOR AI MIGRATION ENGINE START" -ForegroundColor Cyan

$src = ".\apps\backend\src"
$report = @()

# =========================
# 1. DETECT LEGACY FILES
# =========================
Write-Host "🔍 Scanning legacy structure..." -ForegroundColor Yellow

$files = Get-ChildItem -Path $src -Recurse -Include *.js,*.ts -ErrorAction SilentlyContinue

foreach ($file in $files) {

    $name = $file.Name.ToLower()

    $targetModule = ""

    if ($name -match "auth") { $targetModule = "auth" }
    elseif ($name -match "user") { $targetModule = "users" }
    elseif ($name -match "course") { $targetModule = "courses" }
    elseif ($name -match "payment") { $targetModule = "payments" }
    elseif ($name -match "cert") { $targetModule = "certificates" }
    elseif ($name -match "ai") { $targetModule = "ai" }
    else { $targetModule = "shared" }

    $report += [PSCustomObject]@{
        File = $file.FullName
        Module = $targetModule
    }

    Write-Host "📦 $($file.Name) → $targetModule" -ForegroundColor DarkYellow
}

# =========================
# 2. COPY SAFE MIGRATION
# =========================
Write-Host "📁 Copying files into Clean Architecture..." -ForegroundColor Green

foreach ($item in $report) {

    $destFolder = "$src\modules\$($item.Module)\infrastructure\legacy"

    if (!(Test-Path $destFolder)) {
        New-Item -ItemType Directory -Force -Path $destFolder | Out-Null
    }

    Copy-Item $item.File -Destination $destFolder -Force
}

# =========================
# 3. REPORT
# =========================
Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "✅ MIGRATION SAFE COPY DONE" -ForegroundColor Green
Write-Host "⚠️ NEXT: refactor imports + move logic" -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Cyan