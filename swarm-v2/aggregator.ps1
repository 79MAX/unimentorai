function Merge-Swarm($results) {

    $output = @"

==================== SWARM v2 REPORT ====================

[ARCHITECT]
$($results.architect)

--------------------------------------------------------

[CRITIC]
$($results.critic)

--------------------------------------------------------

[FAST]
$($results.fast)

--------------------------------------------------------

[GENERAL]
$($results.general)

========================================================

END OF SWARM ANALYSIS
"@

    return $output
}
