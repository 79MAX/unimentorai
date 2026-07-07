param(
  [string]$ProjectId = "unimentorai-pjhwn"
)

$ErrorActionPreference = "Stop"

$secrets = @(
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

firebase use $ProjectId | Out-Null

Write-Host "Validation metadata Secret Manager"
foreach ($s in $secrets) {
  Write-Host "--- $s ---"
  firebase functions:secrets:get $s --project $ProjectId
}

Write-Host "\nValidation dépendances locales"
if (Test-Path ".env") { Get-Content ".env" }
if (Test-Path "functions/.env") { Get-Content "functions/.env" }

Write-Host "\nScan local rapide (patterns secrets)"
rg "sk-proj-|AKIA|AIza|serviceAccountKey|PRIVATE KEY" . --glob "!**/node_modules/**"
