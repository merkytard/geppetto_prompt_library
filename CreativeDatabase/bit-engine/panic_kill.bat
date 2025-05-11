@echo off
title ☠ PANIC KILL - Zruš všetko čo dýcha ☠

echo -------------------------------------
echo 🔥 GEPPETTO PANIC KILLER 🔥
echo -------------------------------------

:: Zabitie známych server procesov
echo Killing common local servers...
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM uvicorn.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM php.exe >nul 2>&1
taskkill /F /IM java.exe >nul 2>&1
taskkill /F /IM ruby.exe >nul 2>&1
taskkill /F /IM gunicorn.exe >nul 2>&1
taskkill /F /IM streamlit.exe >nul 2>&1

echo ✅ All known dev servers killed.
echo -------------------------------------

:: Zobraz uvoľnené porty (voliteľné)
echo Current ports in use (optional overview):
netstat -ano | findstr :3000
netstat -ano | findstr :8000
netstat -ano | findstr :5000
netstat -ano | findstr :7860

echo -------------------------------------
echo 💀 PANIC MODE COMPLETE. Môžeš dýchať.
pause
