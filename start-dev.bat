@echo off
echo Starting Next.js development server...
echo Press Ctrl+C to stop

REM Kill any existing Node processes running Next.js
taskkill /F /IM node.exe /FI "COMMANDLINE eq *next*" 2>nul

REM Clear Next.js cache
if exist .next\cache (
    echo Clearing Next.js cache...
    rmdir /s /q .next\cache 2>nul
)

REM Start the dev server
npm run dev

REM Cleanup on exit
echo.
echo Cleaning up...
taskkill /F /IM node.exe /FI "COMMANDLINE eq *next*" 2>nul
pause