@echo off
setlocal enabledelayedexpansion

:: Konfigurácia
set LOG_FILE=command_history.json
set PY_SCRIPT=action_logger.py

:: Zaznamenaj príkaz
python "%PY_SCRIPT%" log_command "%*" "%CD%"

:: Spusti pôvodný príkaz
%*
set EXIT_CODE=!errorlevel!

:: Aktualizuj stav v logu
python "%PY_SCRIPT%" update_status "%CD%" !EXIT_CODE!

exit /b %EXIT_CODE%