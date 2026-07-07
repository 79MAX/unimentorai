$Root = Get-Location
$Report = Join-Path $Root "repair_report.md"

Write-Host "🔍 UniMentorAI Scan en cours..."

Remove-Item $Report -ErrorAction SilentlyContinue

Add-Content $Report "# UniMentorAI Repair Report"
Add-Content $Report ""

Add-Content $Report "## ROOT STRUCTURE"
Get-ChildItem -Recurse -Directory | ForEach-Object {
    Add-Content $Report $_.FullName
}

Add-Content $Report ""
Add-Content $Report "## DART FILES"
Get-ChildItem -Recurse -Filter *.dart | ForEach-Object {
    Add-Content $Report $_.FullName
}

Add-Content $Report ""
Add-Content $Report "## LEGAL MODULE CHECK"
Get-ChildItem -Recurse -Filter *.dart |
Where-Object { $_.FullName -match "legal" } |
ForEach-Object {
    Add-Content $Report $_.FullName
}

Add-Content $Report ""
Add-Content $Report "## CERTIFICATE MODULE CHECK"
Get-ChildItem -Recurse -Filter *.dart |
Where-Object { $_.FullName -match "certificate|fraud|verification|scan|quiz" } |
ForEach-Object {
    Add-Content $Report $_.FullName
}

Write-Host "✅ Scan terminé"
Write-Host "📄 Rapport généré : repair_report.md"
