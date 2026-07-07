# Script PowerShell pour compresser les images PNG en WebP et optimiser les PNG
# Dépendances : cwebp, pngquant (ajoutez-les au PATH)
# Téléchargez cwebp : https://developers.google.com/speed/webp/download
# Téléchargez pngquant : https://pngquant.org/

$assetDirs = @(
  'web/icons',
  'android/app/src/main/res/mipmap-hdpi',
  'android/app/src/main/res/mipmap-mdpi',
  'android/app/src/main/res/mipmap-xhdpi',
  'android/app/src/main/res/mipmap-xxhdpi',
  'android/app/src/main/res/mipmap-xxxhdpi',
  'ios/Runner/Assets.xcassets/AppIcon.appiconset',
  'macos/Runner/Assets.xcassets/AppIcon.appiconset'
)
$files = @()
foreach ($dir in $assetDirs) {
  if (Test-Path $dir) {
    $files += Get-ChildItem $dir -Filter *.png -File
  }
}
if (Test-Path 'web/favicon.png') { $files += Get-Item 'web/favicon.png' }

$totalOrig = 0; $totalOpt = 0; $report = @()
foreach ($file in $files) {
  $origSize = (Get-Item $file.FullName).Length
  $totalOrig += $origSize
  # Optimisation PNG
  $pngquant = "pngquant"
  if (Get-Command $pngquant -ErrorAction SilentlyContinue) {
    & $pngquant --quality=60-80 --ext .png --force $file.FullName
  }
  $optSize = (Get-Item $file.FullName).Length
  $totalOpt += $optSize
  # Conversion WebP
  $cwebp = "cwebp"
  if (Get-Command $cwebp -ErrorAction SilentlyContinue) {
    $webp = $file.FullName -replace ".png$", ".webp"
    & $cwebp -q 80 $file.FullName -o $webp
  }
  $report += [PSCustomObject]@{
    File = $file.FullName
    OrigKB = [math]::Round($origSize/1024,1)
    OptKB = [math]::Round($optSize/1024,1)
    Gain = [math]::Round(($origSize-$optSize)/1024,1)
    WebP = $webp
  }
  Write-Host "Optimisé: $($file.FullName) ($($origSize/1024) KB → $($optSize/1024) KB)"
}

Write-Host "`n--- Rapport de compression ---"
foreach ($r in $report) {
  Write-Host "$($r.File): -$([math]::Round(($r.Gain*100)/$r.OrigKB,1))% ($($r.OrigKB) KB → $($r.OptKB) KB), WebP: $($r.WebP)"
}
Write-Host "`nGain total: -$([math]::Round(($totalOrig-$totalOpt)/1024,1)) KB ($([math]::Round((1-$totalOpt/$totalOrig)*100,1))%)"

# Extension vidéo possible : ffmpeg pour mp4/webm plus tard 
 