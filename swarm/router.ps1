function Get-SwarmModels {
    $config = Get-Content "$base\swarm\config.json" -Raw | ConvertFrom-Json
    return $config.models
}

function Select-Models($task) {
    $models = Get-SwarmModels

    if ($task -like "*architecture*") {
        return @($models.architect, $models.critic)
    }

    if ($task -like "*bug*") {
        return @($models.fast, $models.critic)
    }

    return @($models.general)
}
