@echo off
setlocal

:: ✅ Validácia
echo Spúšťam g-validate.py...
python _g-index\g-validate.py
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Validácia zlyhala. Zastavujem commit.
    pause
    exit /b 1
)

:: 🗃️ Vytvorenie priečinka na ZIP ak neexistuje
if not exist _a-archives\a-archives\a-archive-sources-zip (
    mkdir _a-archives\a-archives\a-archive-sources-zip
)

:: 🗃️ Vytvorenie snapshot ZIP
set SNAPNAME=geppetto_snapshot_%DATE:/=-%_%TIME::=-%.zip
set SNAPNAME=%SNAPNAME: =%
echo Tvorím zálohu: %SNAPNAME%
powershell Compress-Archive -Path * -DestinationPath _a-archives\a-archives\a-archive-sources-zip\%SNAPNAME%

:: ✅ Commit do Gitu
echo Commitujem zmeny...
git add .
git commit -m "📦 g-commit.bat snapshot + validácia"
git push origin main-trunk

echo ✅ Commit hotový!
pause
endlocal
