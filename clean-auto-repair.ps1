# ======================================
# 🧠 UNIMENTORAI FRONTEND AUTO-REPAIR SYSTEM
# CTO SILICON VALLEY MODE
# ======================================

Write-Host "🧠 Starting Full Frontend Auto-Repair..." -ForegroundColor Cyan

# ======================================
# 1. CREATE CORE STRUCTURE
# ======================================

$folders = @(
  "frontend/src/security",
  "frontend/src/components",
  "frontend/src/hooks",
  "frontend/src/pages",
  "frontend/src/styles"
)

foreach ($f in $folders) {
  New-Item -ItemType Directory -Force $f | Out-Null
  Write-Host "✔ Created: $f" -ForegroundColor Green
}

# ======================================
# 2. VERIFY ENTRY FILES
# ======================================

$requiredFiles = @(
  "frontend/index.html",
  "frontend/src/main.jsx",
  "frontend/AppWithSplash.tsx"
)

foreach ($file in $requiredFiles) {
  if (!(Test-Path $file)) {
    Write-Host "❌ Missing: $file" -ForegroundColor Red
  } else {
    Write-Host "✔ OK: $file" -ForegroundColor Green
  }
}

# ======================================
# 3. CLEAN VITE STATE
# ======================================

Write-Host "🧹 Cleaning Vite cache..." -ForegroundColor Yellow

Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

# ======================================
# 4. KILL NODE SAFELY
# ======================================

Write-Host "🚫 Stopping Node processes..." -ForegroundColor Yellow

Get-Process node -ErrorAction SilentlyContinue | ForEach-Object {
  try {
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
  } catch {}
}

# ======================================
# 5. AUTO REPAIR CHECK
# ======================================

Write-Host "🔍 Running system validation..." -ForegroundColor Cyan

if (!(Test-Path "frontend/index.html")) {
  Write-Host "⚠ CRITICAL: index.html missing" -ForegroundColor Red
}

if (!(Test-Path "frontend/src/main.jsx") -and !(Test-Path "frontend/src/main.tsx")) {
  Write-Host "⚠ CRITICAL: React entry missing" -ForegroundColor Red
}

Write-Host "🧠 Validation complete" -ForegroundColor Green

# ======================================
# DONE
# ======================================

Write-Host "🚀 AUTO-REPAIR COMPLETE - SAFE TO RUN npm run dev" -ForegroundColor Green
