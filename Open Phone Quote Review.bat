@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { . .\scripts\setup.ps1; $ip = (Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -and $_.NetAdapter.Status -eq 'Up' } | Select-Object -First 1).IPv4Address.IPAddress; if (-not $ip) { Write-Host 'Connect this PC to your home network, then try again.'; exit 1 }; Write-Host 'Keep this window open. Use the phone address and pairing code printed below.'; & .venv\Scripts\python.exe scripts\review_server.py --lan-ip $ip }"
pause
