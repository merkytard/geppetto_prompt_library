@echo off
echo [BIT-DEPLOY] Spúšťam Archivon do lokálneho BIT prostredia...

REM Vytvor cieľový priečinok ak neexistuje
IF NOT EXIST "%USERPROFILE%\bit\engine" (
    mkdir "%USERPROFILE%\bit\engine"
)

REM Kopírovanie obsahu z CreativeDatabase\bit-engine do %USERPROFILE%\bit\engine
xcopy /E /I /Y "CreativeDatabase\bit-engine" "%USERPROFILE%\bit\engine"

REM Spustenie dashboard z markdownu – môže byť neskôr nahradené GUI
start "" "%USERPROFILE%\bit\engine\dashboard\bitface_view.md"

echo [OK] Archivácia do BIT dokončená.
pause
