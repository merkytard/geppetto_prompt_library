@echo off
echo [BIT-DEPLOY] Spúšťam Archivon do lokálneho BIT prostredia

REM  Vytvor cieśovy priecink ak neexistuje
IF NOT EXIST "%USERPROFILE%\\bit\\engine" (
    mkdir "%USERPROFILE\\bit\\engine"
)

REM Kopiérovanie
xcopy /E /I /Y "CreativeDatabase\\bit-engine" "%USERPROFILE\\bit\\engine"

REM Spustenie dashboardu
start "" "%USERPROFILE\\bit\engine\\dashboard\\bitface_view.md"

echo [OK] Archivacia do BIT dokónaë.
pause
