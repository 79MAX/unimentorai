# ======================================
# 🚀 UNIMENTORAI AUTO ENTRY REPAIR SYSTEM (SAFE)
# ======================================

Write-Host "🧠 Checking React Entry System..." -ForegroundColor Cyan

# ======================================
# 1. ENSURE STRUCTURE
# ======================================

New-Item -ItemType Directory -Force frontend/src | Out-Null

# ======================================
# 2. DETECT ENTRY
# ======================================

$mainJsx = "frontend/src/main.jsx"
$mainTsx = "frontend/src/main.tsx"

if (!(Test-Path $mainJsx) -and !(Test-Path $mainTsx)) {

    Write-Host "❌ Missing entry → creating main.jsx..." -ForegroundColor Red

    $entry = @"
import React from "react"
import ReactDOM from "react-dom/client"
import AppWithSplash from "../AppWithSplash"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWithSplash />
  </React.StrictMode>
)
"@

    Set-Content -Path $mainJsx -Value $entry -Encoding UTF8

    Write-Host "✔ main.jsx created" -ForegroundColor Green
}

# ======================================
# 3. SAFE INDEX CHECK (NO DESTRUCTIVE REPLACE)
# ======================================

$indexPath = "frontend/index.html"

if (Test-Path $indexPath) {

    $content = Get-Content $indexPath -Raw

    if ($content -notmatch "main\.jsx" -and $content -notmatch "main\.tsx") {

        Write-Host "⚠ index.html missing entry script" -ForegroundColor Yellow

        Write-Host "👉 Please manually ensure:" -ForegroundColor Cyan
        Write-Host '<script type="module" src="/src/main.jsx"></script>'
    }
}

# ======================================
# 4. FINAL VALIDATION
# ======================================

if (Test-Path $mainJsx -or Test-Path $mainTsx) {
    Write-Host "🚀 React Entry OK" -ForegroundColor Green
} else {
    Write-Host "❌ ENTRY STILL MISSING" -ForegroundColor Red
}

Write-Host "🧠 AUTO ENTRY REPAIR COMPLETE" -ForegroundColor Cyan
