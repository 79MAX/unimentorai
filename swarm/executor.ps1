function Invoke-Ollama($model, $prompt) {
    return $prompt | ollama run $model
}

function Run-Swarm($models, $prompt) {
    $results = @()

    foreach ($m in $models) {
        Write-Host "Running model: $m"
        $results += Invoke-Ollama $m $prompt
    }

    return $results
}
