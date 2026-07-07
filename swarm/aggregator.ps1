function Merge-Responses($results) {
    $output = ""

    foreach ($r in $results) {
        $output += "`n--- MODEL OUTPUT ---`n"
        $output += $r
    }

    return $output
}
