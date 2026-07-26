$ErrorActionPreference = "Stop"
$root = Resolve-Path "$PSScriptRoot\.."
$outDir = Resolve-Path "$root\..\..\outputs"
$zip = Join-Path $outDir "easytax-prototype-source.zip"
if (Test-Path $zip) {
    Remove-Item $zip
}
Compress-Archive -Path (Join-Path $root "*") -DestinationPath $zip
Write-Host $zip
