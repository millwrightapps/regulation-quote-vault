@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { . .\scripts\setup.ps1; Write-Host 'Open the Review dashboard address shown below in your browser. Keep this window open while reviewing.'; & .venv\Scripts\python.exe scripts\review_server.py }"
pause
