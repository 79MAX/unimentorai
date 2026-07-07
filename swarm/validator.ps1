function Validate-Output($text) {
    if ($text -match "UNKNOWN") {
        Write-Host "WARNING: incomplete analysis"
    }

    return $text
}
