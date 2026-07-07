param(
  [string]$ProjectId = "unimentorai-pjhwn",
  [switch]$PruneAfterSet = $true
)

$ErrorActionPreference = "Stop"

$required = @(
  "OPENAI_API_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "PAYPAL_CLIENT_ID",
  "PAYPAL_CLIENT_SECRET",
  "KKIAPAY_PUBLIC_KEY",
  "KKIAPAY_PRIVATE_KEY",
  "KKIAPAY_SECRET_KEY",
  "WISE_API_TOKEN",
  "WISE_PROFILE_ID",
  "WISE_RECIPIENT_ACCOUNT_ID",
  "CERTIFICATES_SECRET"
)

Write-Host "[1/4] Vérification des variables d'environnement..."
foreach ($k in $required) {
  if (-not $env:$k -or [string]::IsNullOrWhiteSpace($env:$k)) {
    throw "Variable manquante: $k"
  }
}

Write-Host "[2/4] Sélection du projet Firebase..."
firebase use $ProjectId | Out-Null

Write-Host "[3/4] Rotation Secret Manager via Firebase CLI..."
foreach ($k in $required) {
  Write-Host " - Rotation $k"
  $value = $env:$k
  $value | firebase functions:secrets:set $k --project $ProjectId --data-file=- | Out-Host
}

if ($PruneAfterSet) {
  Write-Host "[4/4] Prune des versions non utilisées..."
  firebase functions:secrets:prune --project $ProjectId --force | Out-Host
}

Write-Host "Rotation terminée. Déployez ensuite les fonctions:"
Write-Host "firebase deploy --only functions --project $ProjectId"
