function Invoke-Model($model, $prompt) {
    return $prompt | ollama run $model
}

function Run-Swarm($prompt) {

    $base = "C:\Users\DJOTOHOU\UNIMENTORAI\unimentorai"
    $config = Get-Content "$base\swarm-v2\config.json" -Raw | ConvertFrom-Json

    Write-Host "🚀 SWARM v2 RUNNING..."

    $architect = Invoke-Model $config.models.architect $prompt
    $critic    = Invoke-Model $config.models.critic $prompt
    $fast      = Invoke-Model $config.models.fast $prompt
    $general   = Invoke-Model $config.models.general $prompt

    return @{
        architect = $architect
        critic    = $critic
        fast      = $fast
        general   = $general
    }
}
