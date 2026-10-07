$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$releaseVersion = (Get-Content -LiteralPath (Join-Path $projectRoot 'VERSION') -Raw).Trim()
if ($releaseVersion -ne '1.5') { throw 'Update launcher version metadata before building a different release.' }
$compilerPath = Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\csc.exe'
if (-not (Test-Path -LiteralPath $compilerPath)) { throw 'The Windows .NET Framework C# compiler is required to build.' }
$outputDirectory = Join-Path $projectRoot 'dist'
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
$executablePath = Join-Path $outputDirectory ('Anime World Generator ' + $releaseVersion + '.exe')
$assets = @('index.html','style.css','fit.css','game.js','reactions.js','app.js','icon.svg','icon.ico',
    'reactions-jjk.png','reactions-naruto.png','reactions-onepiece.png','reactions-bleach.png','reactions-dragonball.png','reactions-fairytail.png','reactions-mha.png','reactions-aot.png','reactions-hxh.png',
    'reaction-variety.js','reaction-cast-v2.png','worlds-extra.js','reactions-extra.js','character-art.js','character-models-jjk.png','character-models-naruto.png','character-models-onepiece.png','character-models-bleach.png','character-models-dragonball.png','character-models-fairytail.png','character-models-mha.png','character-models-aot.png','character-models-hxh.png','portrait.js','portrait-atlas.png','portrait-female.png','battle-poses-v2.png','battle-legs.png','battle-hands.png','battle.js','battle-art.js',
    'battle-enemies-jjk.png','battle-enemies-naruto.png','battle-enemies-onepiece.png','battle-enemies-bleach.png','battle-enemies-dragonball.png','battle-enemies-fairytail.png','battle-enemies-mha.png','battle-enemies-aot.png','battle-enemies-hxh.png')
$compilerArguments = @('/nologo','/target:winexe','/platform:anycpu','/optimize+',
    '/reference:System.Windows.Forms.dll',('/win32icon:' + (Join-Path $projectRoot 'icon.ico')),('/out:' + $executablePath))
foreach ($asset in $assets) {
    $assetPath = Join-Path $projectRoot $asset
    if (-not (Test-Path -LiteralPath $assetPath)) { throw "Missing asset: $asset" }
    $compilerArguments += '/resource:' + $assetPath + ',AWG.assets.' + $asset
}
$compilerArguments += Join-Path $projectRoot 'launcher\Program.cs'
& $compilerPath @compilerArguments
if ($LASTEXITCODE -ne 0) { throw 'Executable compilation failed.' }

$verificationDirectory = Join-Path $projectRoot 'build\verify-1.5'
$verificationArguments = '--verify-extract "' + $verificationDirectory + '"'
$verification = Start-Process -FilePath $executablePath -ArgumentList $verificationArguments -Wait -PassThru -WindowStyle Hidden
if ($verification.ExitCode -ne 0) { throw 'Executable extraction verification failed.' }
foreach ($asset in $assets) {
    $sourceHash = (Get-FileHash -LiteralPath (Join-Path $projectRoot $asset) -Algorithm SHA256).Hash
    $extractedHash = (Get-FileHash -LiteralPath (Join-Path $verificationDirectory $asset) -Algorithm SHA256).Hash
    if ($sourceHash -ne $extractedHash) { throw "Embedded asset verification failed: $asset" }
}

$releaseReadme = Join-Path $outputDirectory 'READ ME.txt'
@'
ANIME WORLD GENERATOR — VERSION 1.5

Double-click Anime World Generator 1.5.exe to play.
Windows 10 or 11 with a modern default browser is recommended.
The executable includes all game files and artwork. No installer or internet is needed.
It extracts the game to %LOCALAPPDATA%\AnimeWorldGenerator\1.5 and opens index.html in your browser.
The launcher uses the .NET Framework supplied with modern Windows.

You can share the EXE by itself or this ZIP. Browser saves are personal to each player;
they are not included in the executable. Download characters in-game to keep text copies.
This packaged copy has its own save location, separate from a development-folder copy.

This is an unsigned personal release. Windows may display a publisher/reputation warning.
Fan-made game; not affiliated with the creators of the featured anime.
'@ | Set-Content -LiteralPath $releaseReadme -Encoding utf8
$hash = (Get-FileHash -LiteralPath $executablePath -Algorithm SHA256).Hash.ToLowerInvariant()
$checksumPath = Join-Path $outputDirectory 'SHA256.txt'
($hash + '  ' + [IO.Path]::GetFileName($executablePath)) | Set-Content -LiteralPath $checksumPath -Encoding ascii
$zipPath = Join-Path $outputDirectory ('Anime-World-Generator-' + $releaseVersion + '-Windows.zip')
Compress-Archive -LiteralPath @($executablePath,$releaseReadme,$checksumPath) -DestinationPath $zipPath -Force
$browserDirectory = Join-Path $outputDirectory ('Anime-World-Generator-' + $releaseVersion + '-Browser')
New-Item -ItemType Directory -Path $browserDirectory -Force | Out-Null
foreach ($asset in $assets) { Copy-Item -LiteralPath (Join-Path $projectRoot $asset) -Destination (Join-Path $browserDirectory $asset) -Force }
('ANIME WORLD GENERATOR ' + $releaseVersion + ' - BROWSER EDITION' + [Environment]::NewLine +
    'Extract the entire ZIP, then open index.html in a modern browser. Keep all files together.' + [Environment]::NewLine +
    'No executable or installer is included. Saves stay in your own browser.') | Set-Content -LiteralPath (Join-Path $browserDirectory 'READ ME.txt') -Encoding utf8
$browserZip = Join-Path $outputDirectory ('Anime-World-Generator-' + $releaseVersion + '-Browser.zip')
Compress-Archive -LiteralPath $browserDirectory -DestinationPath $browserZip -Force
Write-Output "Built and verified: $executablePath"
Write-Output "Shareable archive: $zipPath"
Write-Output "Browser archive: $browserZip"
Write-Output "SHA256: $hash"
