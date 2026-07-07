function Validate-Swarm($text) {

    if ([string]::IsNullOrWhiteSpace($text)) {
        Write-Host "❌ ERROR: Empty swarm output"
        return $text
    }

    if ($text -match "UNKNOWN" -and $text.Length -lt 200) {
        Write-Host "⚠️ WARNING: Weak or incomplete analysis detected"
    }

    if ($text -match "I am not sure|cannot determine|insufficient information") {
        Write-Host "⚠️ WARNING: Model uncertainty detected"
    }

    if ($text.Length -gt 5000) {
        Write-Host "ℹ️ INFO: Large output detected (normal for swarm)"
    }

    return $text
}
