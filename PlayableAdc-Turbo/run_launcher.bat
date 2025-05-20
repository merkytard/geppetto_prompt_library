@echo off
cd /d %~dp0server

echo [\•] Gite activacia venv...
call ..\venv\Scripts\activate.bat

echo [•] SpýŁtam launcher.py
python launcher.py

pause
