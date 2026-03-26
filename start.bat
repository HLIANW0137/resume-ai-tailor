@echo off
:: 切换到脚本所在的目录，防止以管理员运行时路径变成 System32
cd /d "%~dp0"

echo ========================================
echo    AI Resume Builder - Quick Start
echo ========================================
echo.

:: Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. 
    echo Please download and install it from https://nodejs.org/
    pause
    exit /b
)

echo [1/2] Installing dependencies (this may take a few minutes)...
call npm install

echo.
echo [2/2] Starting local server...
echo After starting, please visit: http://localhost:3000
echo.

:: Open browser
start "" "http://localhost:3000"

:: Start dev server
call npm run dev

pause
