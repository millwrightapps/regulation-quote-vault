# Windows setup for the launchers: Python tools, whisper.cpp, ffmpeg and the Whisper model. Safe to run every time;
# it only installs what's missing. Run from the vault folder.
$ErrorActionPreference = 'Stop'
# The scripts read and write UTF-8 JSON; make Python use UTF-8 regardless of the Windows locale.
$env:PYTHONUTF8 = '1'
function Fail($message) { Write-Host $message; Read-Host 'Press Enter to close'; exit 1 }

if (-not (Test-Path .venv\Scripts\python.exe)) {
  $py = Get-Command py -ErrorAction SilentlyContinue
  if ($py) { py -3 -m venv .venv } else { python -m venv .venv }
  if (-not (Test-Path .venv\Scripts\python.exe)) { Fail 'Python 3.10 or newer is required. Install it from https://www.python.org/downloads/ (tick "Add to PATH").' }
}
& .venv\Scripts\python.exe -c 'import sys; raise SystemExit(sys.version_info < (3, 10))'
if ($LASTEXITCODE) { Fail 'Python 3.10 or newer is required.' }
& .venv\Scripts\python.exe -c 'import yt_dlp' 2>$null
if ($LASTEXITCODE) {
  Write-Host 'Installing yt-dlp (reads the YouTube playlist and downloads episode audio)...'
  & .venv\Scripts\python.exe -m pip install -q -r requirements.txt
  if ($LASTEXITCODE) { Fail 'Could not install yt-dlp. Check your internet connection and try again.' }
}

# whisper.cpp: the official Windows build, unpacked into tools\whisper.
if (-not (Get-Command whisper-cli -ErrorAction SilentlyContinue) -and -not (Test-Path tools\whisper\whisper-cli.exe)) {
  Write-Host 'Downloading whisper.cpp...'
  $release = Invoke-RestMethod https://api.github.com/repos/ggml-org/whisper.cpp/releases/latest
  $asset = $release.assets | Where-Object name -eq 'whisper-bin-x64.zip' | Select-Object -First 1
  if (-not $asset) { Fail 'Could not find the whisper.cpp Windows download. See https://github.com/ggml-org/whisper.cpp/releases' }
  New-Item -ItemType Directory -Force tools | Out-Null
  Invoke-WebRequest $asset.browser_download_url -OutFile tools\whisper.zip
  Expand-Archive tools\whisper.zip tools\whisper-unpacked -Force
  $cli = Get-ChildItem tools\whisper-unpacked -Recurse -Filter whisper-cli.exe | Select-Object -First 1
  if (-not $cli) { Fail 'The whisper.cpp download did not contain whisper-cli.exe.' }
  Move-Item $cli.Directory.FullName tools\whisper
  Remove-Item tools\whisper.zip, tools\whisper-unpacked -Recurse -Force -ErrorAction SilentlyContinue
}

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
  if (-not (Get-Command winget -ErrorAction SilentlyContinue)) { Fail 'Install ffmpeg (https://ffmpeg.org/download.html) and add it to PATH, then try again.' }
  Write-Host 'Installing ffmpeg with winget...'
  winget install --id Gyan.FFmpeg -e --accept-source-agreements --accept-package-agreements
  # Pick up the new PATH without reopening the window.
  $env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
  if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) { Fail 'ffmpeg installed, but Windows needs a fresh window to find it. Close this window and open the launcher again.' }
}

$model = 'models\ggml-large-v3-turbo-q5_0.bin'
if (-not (Test-Path $model)) {
  Write-Host 'Downloading the Whisper model (about 550 MB, once)...'
  New-Item -ItemType Directory -Force models | Out-Null
  Invoke-WebRequest https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo-q5_0.bin -OutFile "$model.part"
  Move-Item "$model.part" $model
}

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Host 'Note: install the GitHub CLI (winget install GitHub.cli) and run "gh auth login" to save and publish quotes.'
}
