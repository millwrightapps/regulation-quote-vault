@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { . .\scripts\setup.ps1; Write-Host 'Open http://127.0.0.1:8765 in your browser. Keep this window open while reviewing.'; & .venv\Scripts\python.exe scripts\review_server.py }"
pause
