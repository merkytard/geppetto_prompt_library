@echo off
title Geppetto Dashboard Launcher

echo [1/4] Killing any existing uvicorn/fastapi servers...
taskkill /f /im python.exe /t >nul 2>&1

echo [2/4] Cleaning __pycache__...
for /r %%i in (__pycache__) do (
    if exist "%%i" rd /s /q "%%i"
)

echo [3/4] Preparing environment...
set PYTHONPATH=%cd%
call venv\Scripts\activate

echo [4/4] Starting Geppetto Dashboard...
python main.py

pause
