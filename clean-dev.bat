@echo off
echo Cleaning Next.js build directories...

REM Force remove .next directory
if exist .next (
    rmdir /s /q .next 2>nul
    del /f /s /q .next\* 2>nul
    rmdir /s /q .next 2>nul
)

REM Force remove .next-build directory
if exist .next-build (
    rmdir /s /q .next-build 2>nul
    del /f /s /q .next-build\* 2>nul
    rmdir /s /q .next-build 2>nul
)

echo Clean complete!
echo You can now run: npm run dev