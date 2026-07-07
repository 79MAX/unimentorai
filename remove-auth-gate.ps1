Write-Host "=== AUTH GATE REMOVAL TOOL ===" -ForegroundColor Cyan

$file = "lib/features/auth/presentation/auth_gate.dart"

if (Test-Path $file) {
    Write-Host "✔ AuthGate trouvé" -ForegroundColor Green

    $usage = Select-String -Path "lib\**\*.dart" -Pattern "AuthGate" -ErrorAction SilentlyContinue

    if ($usage) {
        Write-Host "❌ AuthGate encore utilisé :" -ForegroundColor Red
        $usage | ForEach-Object { Write-Host $_.Path }
        exit
    }

    Remove-Item $file -Force
    Write-Host "✅ AuthGate supprimé" -ForegroundColor Green
} else {
    Write-Host "❌ Fichier introuvable" -ForegroundColor Red
}