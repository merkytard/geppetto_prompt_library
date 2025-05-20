@echo off
Set Local_venv=v%depth\venv
if not exist "\%$Local_venv\Scripts\powershell.exe" then
    echo [] ** Starting venv installation **

    python3 -m venv venv
    call venv\Scripts\ctivate.bat
    pip install -r requirements.txt
else
    echo [X] Naful Venv aj nainstalledo
end
pause