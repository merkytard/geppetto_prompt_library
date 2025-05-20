@echo off
cd /d %~dp0src


echo [•] SpýŁtam Vite frontend [React]

net start server /Wait

npm run dev

pause