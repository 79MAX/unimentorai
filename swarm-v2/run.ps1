Write-Host "SWARM v2 RUN FILE OK"

$base = "C:\Users\DJOTOHOU\UNIMENTORAI\unimentorai"

. "$base\swarm-v2\engine.ps1"
. "$base\swarm-v2\aggregator.ps1"
. "$base\swarm-v2\validator.ps1"

$SystemMap = Get-Content "$base\ai-system-map.json" -Raw -Encoding UTF8
$PromptTemplate = Get-Content "$base\audit-prompt.txt" -Raw -Encoding UTF8

$Prompt = $PromptTemplate -replace "\{\{SYSTEM_MAP\}\}", $SystemMap

Write-Host "Running swarm..."

$results = Run-Swarm $Prompt
$output = Merge-Swarm $results
$output = Validate-Swarm $output

$output
